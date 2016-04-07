import path from 'path';
import webpack from 'webpack';
import extend from 'extend';
import fs from 'fs';

const NODE_ENV = process.env.NODE_ENV;
const VERBOSE = process.argv.includes('--verbose');
const DEBUG = (NODE_ENV === 'development');
const GLOBALS = {
  __DEV__: DEBUG
}
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];

let nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

//
// Common configuration chunk to be used for both
// client-side and server-side bundles
// -----------------------------------------------------------------------------

const baseConfig = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, '../server'),
          path.resolve(__dirname, '../client'),
        ],
        query: {
          // https://github.com/babel/babel-loader#options
          cacheDirectory: DEBUG,

          // https://babeljs.io/docs/usage/options/
          babelrc: false,
          presets: [
            'react',
            'es2015',
            'stage-3',
          ],
          plugins: [
            'transform-runtime',
          ],
        },
      },
      {
        test: /\.scss$/,
        loaders: [
          'isomorphic-style-loader',
          `css-loader?${JSON.stringify({
            sourceMap: DEBUG,
            // CSS Modules https://github.com/css-modules/css-modules
            modules: true,
            localIdentName: DEBUG ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
            // CSS Nano http://cssnano.co/options/
            minimize: !DEBUG,
          })}`,
          'postcss-loader?parser=postcss-scss',
        ],
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader',
        query: {
          name: DEBUG ? '[path][name].[ext]?[hash]' : '[hash].[ext]',
          limit: 10000,
        },
      },
      {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
        query: {
          name: DEBUG ? '[path][name].[ext]?[hash]' : '[hash].[ext]',
        },
      },
      // {
      //   test: /\.jade$/,
      //   loader: 'jade-loader',
      // },
    ],
  },

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },
};

export const clientConfig = extend(true, {}, baseConfig, {
  entry: path.resolve(__dirname, '../client/index.js'),
  output: {
    path: path.resolve(__dirname, '../build', NODE_ENV, 'public/scripts'),
    filename: 'application.js'
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ],
  resolve: {
    root: path.resolve(__dirname, '../client'),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json']
  },
  devtool: 'source-map'
});

export const serverConfig = extend(true, {}, baseConfig, {
  entry: path.resolve(__dirname, '../server/index.js'),
  output: {
    path: path.resolve(__dirname, '../build', NODE_ENV),
    filename: 'server.js'
  },
  target: 'node',
  externals: nodeModules,
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  // resolve: {
  //   root: path.resolve(__dirname, '../server'),
  //   modulesDirectories: ['node_modules'],
  //   extensions: ['', '.js', '.json']
  // },
  devtool: 'source-map'
});


export default [clientConfig, serverConfig];
