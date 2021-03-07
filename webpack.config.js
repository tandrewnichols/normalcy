const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const package = require('./package');

module.exports = {
  entry: {
    'normalcy': require.resolve(`./${package.main}`),
    'normalcy.min': require.resolve(`./${package.main}`)
  },
  output: {
    library: 'normalcy',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /lib.*\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.min\.js$/
      })
    ]
  }
};
