export { Schema as Chess } from 'chess-processor';
import { Schema as Chess } from 'chess-processor';
import { Type, ObjectOptions } from '@sinclair/typebox';

const options: ObjectOptions = {
  additionalProperties: false
};

export const Member = Type.Object({
  nickname: Type.String(),
  color: Chess.Color,
  ready: Type.Boolean()
}, options);

export const Lobby = Type.Object({
  _id: Type.String(),
  name: Type.String(),
  members: Type.Array(Member)
}, options);

export const Player = Type.Object({
  nickname: Type.String(),
  color: Chess.Color
}, options);

export const Game = Type.Object({
  _id: Type.String(),
  players: Type.Array(Player),
  state: Chess.State
}, options);