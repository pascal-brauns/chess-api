import { Type } from '@sinclair/typebox';
import { Chess } from 'Schema';
import * as External from './External';

export const Member = Type.Intersect([
  External.Member,
  Type.Object({
    _id: Type.String()
  })
], );

export const Lobby = Type.Object({
  _id: Type.String(),
  name: Type.String(),
  members: Type.Array(Member)
});

export const Player = Type.Intersect([
  External.Player,
  Type.Object({
    _id: Type.String()
  })
]);

export const Game = Type.Object({
  _id: Type.String(),
  players: Type.Array(Player),
  state: Chess.State
});