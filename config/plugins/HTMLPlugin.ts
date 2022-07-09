import { Plugin } from 'esbuild';
import { rm, writeFile } from 'fs/promises';
import * as path from 'path';

interface HTMLPluginOptions {
  template?: string;
  title?: string;
  jsPath?: string[];
  cssPath?: string[];
}

export const HTMLPlugin = (options: HTMLPluginOptions): Plugin => {
  return {
    name: 'HTMLPlugin',
    setup(build) {
      const outdir = build.initialOptions.outdir;
      build.onStart(async () => {
        try {
          if (outdir) {
            await rm(outdir, { recursive: true });
          }
        } catch (error) {
          console.error(error);
        }
      });
      build.onEnd(async (result) => {
        const outputs = result.metafile?.outputs;
        const [jsPath, cssPath] = preparePaths(Object.keys(outputs || {}));
        if (outdir) {
          await writeFile(
            path.resolve(outdir, 'index.html'),
            renderHTML({ jsPath, cssPath, ...options }),
          );
        }
      });
    },
  };
};

const preparePaths = (paths: string[]) => {
  return paths.reduce<string[][]>(
    (acc, path) => {
      const [js, css] = acc;
      const splittedFileName = path.split('/').pop();
      if (splittedFileName?.endsWith('.js')) {
        js.push(splittedFileName);
      } else if (splittedFileName?.endsWith('.css')) {
        css.push(splittedFileName);
      }
      return acc;
    },
    [[], []],
  );
};

const renderHTML = (options: HTMLPluginOptions) => {
  return `
<!doctype html> 
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${options.title}</title>
    ${options?.cssPath?.map((path) => `<link rel="stylesheet" href="${path}">`).join('')}
</head>
<body>
    <div id="root"></div>
    ${options?.jsPath?.map((path) => `<script src="${path}"></script>`).join('')}
</body>
</html>
`;
};
