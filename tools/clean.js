
import del from 'del';
import fs from './lib/fs';

/**
 * Cleans up the output directory.
 */
async function clean() {
  const NODE_ENV = process.env.NODE_ENV;
  await del([`build/${NODE_ENV}/*`], { dot: true });
  await fs.makeDir(`build/${NODE_ENV}/public`);
}

export default clean;
