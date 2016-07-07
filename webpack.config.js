var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'js/main.jsx'),
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: "app/", 
        filename: 'bundle.js',
    },
    module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel',
        exclude: /node_modules/,

      }
    ]
  },
  resolve: {
    extensions: ['',  '.jsx','.js']
  },
  // plugins: [
  //   new webpack.HotModuleReplacementPlugin(),
  //   new webpack.NoErrorsPlugin()
  // ]
};