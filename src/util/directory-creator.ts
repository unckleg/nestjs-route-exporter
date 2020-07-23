import * as fs from 'fs';

/**
 * Create directory where routes will be exported.
 *
 * @param {String} path | Can be './routes' || './routes/api' || './exported/nested/routes/api'
 */
export const directoryCreator = (path: string): void => {
  let pathTree = './';
  for (let dir of path.split('/')) {
    if (dir === '.') {
      continue;
    }

    pathTree += `${dir}/`;
    const normalizedPath = dir !== './' ? pathTree : dir;
    if (!fs.existsSync(normalizedPath)) {
      fs.mkdirSync(normalizedPath);
      fs.chmod(normalizedPath, '0777', () => undefined);
    }
  }
};
