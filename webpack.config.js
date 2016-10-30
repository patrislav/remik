const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const DEBUG = !['production', 'staging'].includes(process.env.NODE_ENV)

const chunkName = DEBUG ? '[name].js' : '[name].[chunkhash].js'
const cssIdentName = DEBUG ? '[path][name]__[local]' : '[hash:base64]'

let config = {
  entry: {
    app: path.resolve('app/main.js')
  },
  output: {
    path: path.resolve('build/dist'),
    publicPath: '/',
    filename: chunkName
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          // https://github.com/babel/babel-loader#options
          cacheDirectory: DEBUG,
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          `css-loader?modules&importLoaders=1&localIdentName=${cssIdentName}`,
          'postcss-loader'
        ]
      }
    ]
  },
  devtool: DEBUG && 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('app/index.ejs'),
      filename: 'index.html'
    })
  ]
}

if (DEBUG) {
  config.plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    ...config.plugins
  ]
}
else {
  config.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    ...config.plugins
  ]
}

module.exports = config
