import fs from 'fs/promises';
import path from 'path';
import convert from '@openapi-contrib/json-schema-to-openapi-schema';
import * as Schema from '../Schema';

const schema = async <T>(root: string, name: string, schema: T) => fs.writeFile(
  path.resolve(root, `${name}.json`),
  JSON.stringify(await convert(schema), null, 2)
);

export const schemas = (root: string) => Promise.all([
  ...Object
    .keys(Schema.External)
    .filter(key => key !== 'Chess')
    .map((name: keyof typeof Schema.External) => schema(
      path.resolve(root, 'External'),
      name,
      Schema.External[name]
    )),
  schema(root, 'User', Schema.User),
  schema(root, 'Placement', Schema.Placement)
]);