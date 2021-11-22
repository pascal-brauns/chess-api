import * as Schema from 'Schema';
import { Static } from '@sinclair/typebox';

export type Member = Static<typeof Schema.External.Member>;
export type Lobby = Static<typeof Schema.External.Lobby>;
export type Player = Static<typeof Schema.External.Player>;
export type Game = Static<typeof Schema.External.Game>;