import { MongoClient, ObjectId, WithId, Document } from 'mongodb';
import * as Type from 'Type';

type Color = Type.Chess.Color;
type User = Type.User;
type Lobby = Type.Internal.Lobby;

const collection = async () => (
  (await new MongoClient(process.env.MONGO_URL)
    .connect())
    .db('chess')
    .collection('lobby')
);

const internal = (document: WithId<Document>): Lobby => ({
  _id: document._id.toString(),
  name: document.name,
  members: document.members,
});

const plain = (lobby: Lobby) => ({
  name: lobby.name,
  members: lobby.members
});

export const all = async (): Promise<Lobby[]> => (
  (await (await collection())
    .find()
    .toArray())
    .map(internal)
);

export const create = async (user: User): Promise<Lobby> => {
  const lobby = {
    name: `${user.nickname}'s lobby`,
    members: [] as Type.Internal.Member[]
  };
  await (await collection()).insertOne(lobby);
  return await get((lobby as Lobby)._id);
};

export const selectColor = async (
  user: User,
  id: string,
  color: Color
): Promise<void> => {
  const lobby = await get(id);
  const index = lobby.members.findIndex(member => member._id === user._id);
  lobby.members[index] = {
    ...lobby.members[index],
    color: (
      lobby.members[index]?.color === color
        ? null
        : color
    ),
    ready: false
  };
  await set(id, lobby);
}

export const toggleReady = async (user: User, id: string): Promise<void> => {
  const lobby = await get(id);
  const member = lobby.members.findIndex(member => member._id === user._id);
  lobby.members[member] = {
    ...lobby.members[member],
    ready: (
      lobby.members[member].color &&
      !lobby.members[member].ready
    )
  };
  await set(id, lobby)
};

export const leave = async (user: User, id: string) => {
  const lobby = await get(id);
  if (lobby.members.length === 1) {
    await remove(id);
    return null;
  }
  else {
    const member = lobby.members.findIndex(member => member._id === user._id);
    lobby.members.splice(member, 1);
    await set(id, lobby);
    return get(id);
  }
}

export const getColor = async (user: User, id: string) => (
  (await get(id))
    ?.members
    .find(member => member._id === user._id)
    ?.color || null
);

export const join = async (user: User, id: string): Promise<void> => {
  const lobby = await get(id);
  if (lobby.members.length < 2) {
    lobby.members.push({
      _id: user._id,
      nickname: user.nickname,
      color: null,
      ready: false
    });
    await set(id, lobby);
  }
};

export const get = async (id: string): Promise<Lobby> => {
  const lobby = await (await collection()).findOne({ _id: new ObjectId(id) });
  return (
    lobby
      ? internal(lobby)
      : null
  );
};

const set = async (id: string, next: Lobby) => (
  (await collection())
    .updateOne({ _id: new ObjectId(id) }, {
      $set: plain(next)
    })
);

export const remove = async (id: string) => (
  await (await collection())
    .deleteOne({ _id: new ObjectId(id) })
);