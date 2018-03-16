var webpack = require('webpack');
var path = require('path');

const rules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
      'babel-loader',
    ],
  },
];

module.exports = {
  mode:"development",
  devtool: "source-map",
  entry: "./components/main.jsx",
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "app/",
    filename: "bundle.js"
  },
  module: {
    rules
  },
  resolve: {
    extensions: [ ".jsx", ".js"]
  },
};