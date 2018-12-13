const path = require('path');
const webpack = require('webpack');
const setPath = url => path.resolve(__dirname, url);

const config = {
  entry: './src/index.js',
  output: {
    filename: 'derive-middleware.min.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [setPath('src')],
        exclude: /node_modules/,
        use: [
          {
          loader: 'babel-loader',
          options: {
              babelrc: true,
          }
        }]
      },
    ]
  }
};

module.exports = config;
