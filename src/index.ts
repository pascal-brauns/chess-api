/* eslint-disable no-console */
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { json } from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import * as Validator from 'express-openapi-validator';
import IO from './IO';
import Router from './Router';
import * as OpenAPI from './OpenAPI';

const main = async () => {
  switch (process.argv[2]) {
    case 'serve': {
      const port = process.env.PORT;
      const app = express();
      app.use(morgan('tiny'));
      app.use(json({ strict: false }));
      app.get('/ping', (_, res) => res.send('pong'));
      app.use(express.static(path.resolve(process.env.STATIC_ROOT)));
      app.use(Router);
      app.use(Validator.middleware({
        apiSpec: path.resolve(process.cwd(), process.env.OPENAPI_SPECIFICATION),
        ignoreUndocumented: true
      }));
      const server = app.listen(parseInt(port), '0.0.0.0', () => {
        console.info(`Server listening on port ${port}`);
      });
      IO.attach(server);
      return;
    }
    case 'generate-openapi-schemas': {
      const root = process.env.OPENAPI_SCHEMA_ROOT_PATH;
      await OpenAPI.schemas(root);
      console.info('Schemas for OpenAPI were successfully generated!');
      return;
    }
  }
};

main();
