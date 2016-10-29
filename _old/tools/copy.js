
import path from 'path';
import gaze from 'gaze';
import Promise from 'bluebird';
import dateformat from 'dateformat';
import fs from './lib/fs';
import pkg from '../package.json';

async function copy() {
  const ncp = require('ncp');
  const NODE_ENV = process.env.NODE_ENV;

  ncp('./tools/build-default', `./build/${NODE_ENV}`);
  ncp(`./tools/env/${NODE_ENV}.env`, `./build/${NODE_ENV}/.env`);
  ncp('./public', `./build/${NODE_ENV}/public`);
  ncp('./views', `./build/${NODE_ENV}/views`);

  await fs.writeFile(`./build/${NODE_ENV}/package.json`, JSON.stringify({
    private: true,
    engines: pkg.engines,
    dependencies: pkg.dependencies,
    scripts: {
      start: 'node server.js',
    },
  }, null, 2));

  let version = pkg.version + '+' + dateformat('UTC:yyyymmddhhMM');
  if (NODE_ENV == 'development') {
    version += '.dev';
  }
  await fs.writeFile(`./build/${NODE_ENV}/VERSION`, version, null, 2);

  if (process.argv.includes('--watch')) {
    const watcher = await new Promise((resolve, reject) => {
      gaze('./views/**/*.*', (err, val) => err ? reject(err) : resolve(val));
    });

    watcher.on('changed', async (file) => {
      const relPath = file.substr(path.join(__dirname, '../views/').length);
      await ncp(`./views/${relPath}`, `./build/${NODE_ENV}/views/${relPath}`);
    })
  }
}

export default copy;
