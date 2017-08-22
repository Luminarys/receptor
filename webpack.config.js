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
      { test: /\.(ttf|eot|svg|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                path.resolve(__dirname, './node_modules'),
                path.resolve(__dirname, './scss/srht/srht/scss'),
              ]
            },
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
