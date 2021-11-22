import * as Schema from 'Schema';
import { Static } from '@sinclair/typebox';

export type Member = Static<typeof Schema.Internal.Member>;
export type Lobby = Static<typeof Schema.Internal.Lobby>;
export type Player = Static<typeof Schema.Internal.Player>;
export type Game = Static<typeof Schema.Internal.Game>;