import path from 'path';
import { BuildOptions } from 'esbuild';
import { CleanPlugin } from '../plugins/CleanPlugin';
import { HTMLPlugin } from '../plugins/HTMLPlugin';

const mode = process.env.MODE || 'development';

console.log(`Building in ${mode} mode`);

const isDev = mode === 'development';
const isProduction = mode === 'production';

const resolve = (...args: string[]) => path.resolve(__dirname, '..', '..', ...args);

export const config: BuildOptions = {
  outdir: resolve('build'),
  entryPoints: [resolve('src', 'index.jsx')],
  entryNames: '[dir]/bundle.[name]-[hash]',
  metafile: true,
  bundle: true,
  minify: isProduction,
  loader: { '.png': 'file', '.jpg': 'file', '.svg': 'file' },
  tsconfig: resolve('tsconfig.json'),
  plugins: [CleanPlugin, HTMLPlugin({ title: 'React App' })],
  sourcemap: isDev,
  watch: isDev && {
    onRebuild(err, result) {
      if (err) {
        console.error(err);
      } else {
        console.log(result);
      }
    },
  },
};
