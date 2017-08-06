const path = require("path");
const webpack = require("webpack");

const defines = {
  "DEFAULT_WS_URI": process.env.WEBSOCKET_URI || "ws://localhost:8412/"
};

module.exports = {
  devtool: "source-map",
  entry: [
    "webpack-hot-middleware/client",
    "./src/index.js"
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/"
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                path.resolve(__dirname, './node_modules/bootstrap/scss/')
              ]
            }
          }
        ],
      }
    ]
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin(defines)
  ]
};
