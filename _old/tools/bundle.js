import webpack from 'webpack';
import webpackConfig from './webpack.config';

/**
 * Creates application bundles from the source files.
 */
function bundle() {
  return new Promise((resolve, reject) => {
    const errorHandler = (err, stats) => {
      if (err) {
        return reject(err);
      }

      console.log(stats.toString(webpackConfig[0].stats));
      return resolve();
    }

    if (process.argv.includes('--watch')) {
      webpack(webpackConfig).watch({
        aggregateTimeout: 300,
        poll: true
      }, errorHandler);
    } else {
      webpack(webpackConfig).run(errorHandler);
    }
  });
}

export default bundle;
