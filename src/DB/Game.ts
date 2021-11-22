import { State } from 'chess-processor';
import * as Type from 'Type';

import { MongoClient, ObjectId, Document } from 'mongodb';

type Game = Type.Internal.Game;
type Lobby = Type.Internal.Lobby;
type Placement = Type.Chess.Placement;

const collection = async () => (
  (await new MongoClient(process.env.MONGO_URL)
    .connect())
    .db('chess')
    .collection('game')
);

const index = (game: Game) => ({
  ...game,
  _id: new ObjectId(game._id)
});

const internal = (id: string, document: Document): Game => ({
  _id: id,
  state: document.state,
  players: document.players
});

export const create = async (lobby: Lobby) => {
  const game: Game = {
    _id: lobby._id,
    players: lobby.members.map(member => ({
      _id: member._id,
      nickname: member.nickname,
      color: member.color
    })),
    state: State.initial()
  };
  await (await collection()).insertOne(index(game));
  return await get(lobby._id);
}

export const get = async (id: string): Promise<Game> => {
  const game = await (await collection()).findOne({ _id: new ObjectId(id) });
  return (
    game
      ? internal(id, game)
      : null
  );
};

export const dispatch = async (id: string, placement: Placement) => {
  const game = await get(id);
  const next = {
    players: game.players,
    state: State.dispatch(game.state, placement)
  };
  (await collection()).updateOne({ _id: new ObjectId(id) }, {
    $set: next
  });
  return await get(id);
}