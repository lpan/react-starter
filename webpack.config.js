const webpack = require('webpack');
const path = require('path');
const { mergeWith, concat } = require('ramda');

const SRC_PATH = path.join(__dirname, 'src', 'client', 'entry.js');
const BUILD_PATH = path.join(__dirname, 'public');

const ENV = process.env.NODE_ENV;
const isProd = ENV === 'production';

const common = {
  entry: [
    SRC_PATH,
    'webpack-hot-middleware/client',
  ],
  output: {
    path: BUILD_PATH,
    filename: 'bundle.js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js'],
    alias: {},
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /.+\.config.js/],
        loader: 'babel',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(ENV),
      },
    }),
  ],
};

const production = {
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false,
      },
    }),
  ],
};

const development = {
  devtool: 'cheap-module-eval-source-map',

  plugins: [
    // new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
};

const getConfig = mergeWith(concat, common);

module.exports = isProd ? getConfig(production) : getConfig(development);
