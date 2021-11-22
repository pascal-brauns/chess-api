export { Type as Chess } from 'chess-processor';
export * as External from './External';
export * as Internal from './Internal';
import { Static } from '@sinclair/typebox';
import * as Schema from 'Schema';

export type User = Static<typeof Schema.User>;