import { MongoClient, ObjectId, WithId, Document } from 'mongodb';
import * as Type from 'Type';

type User = Type.User;

const collection = async () => (
  (await new MongoClient(process.env.MONGO_URL)
    .connect())
    .db('chess')
    .collection('user')
);

const plain = (document: WithId<Document>): User => ({
  _id: document._id.toString(),
  nickname: document.nickname
});

export const create = async (nickname: string): Promise<User> => {
  const user = {
    _id: new ObjectId(),
    nickname
  };
  await (await collection()).insertOne(user);
  return await get(user._id.toString());
};

export const get = async (id: string) => {
  try {
    const user = await (await collection()).findOne({ _id: new ObjectId(id) });
    return (
      user
        ? plain(user)
        : null
    );
  }
  catch(error) {
    return null;
  }
}

export const set = async (id: string, user: User) => {
  const next = {
    nickname: user.nickname
  };

  const filter = {
    _id: new ObjectId(id)
  };

  await (await collection())
    .updateOne(filter, { $set: next });
}