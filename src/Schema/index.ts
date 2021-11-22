export { Schema as Chess } from 'chess-processor';
import { Type, ObjectOptions } from '@sinclair/typebox';

export * as External from './External';
export * as Internal from './Internal';

const options: ObjectOptions = {
  additionalProperties: false
};

import { Schema as Chess } from 'chess-processor';

export const Placement = Chess.Placement;

export const User = Type.Object({
  _id: Type.String(),
  nickname: Type.String(),
}, options);