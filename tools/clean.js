
import del from 'del';
import fs from './lib/fs';
import NODE_ENV from './lib/environment';

/**
 * Cleans up the output directory.
 */
async function clean() {
  await del([`build/${NODE_ENV}/*`]);
  await fs.makeDir(`build/${NODE_ENV}/public`);
}

export default clean;
