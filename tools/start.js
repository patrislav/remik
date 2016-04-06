import run from './run';
import runServer from './runServer';
import webpackConfig from './webpack.config';
import build from './build';
import NODE_ENV from './lib/environment';

async function start() {
  runServer();
}

export default start;
