import esbuild from 'esbuild';
import express from 'express';
import { config } from './esbuild-config';
import * as path from 'path';

const PORT = Number(process.env.PORT) || 3000;

const app = express();

app.use(express.static(path.resolve(__dirname, '..', '..', 'build')));

app.listen(PORT, () => console.log(`Listening on port http://localhost:${PORT}`));

esbuild
  .build(config)
  .then((result) => {
    console.log(result);
  })
  .catch(console.log);
