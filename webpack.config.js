const path = require("path");
const webpack = require("webpack");

const defines = {
  "DEFAULT_WS_URI": process.env.WEBSOCKET_URI || "ws://localhost:8412/"
};

const env = process.env.ENVIRONMENT || "development";

module.exports = {
  devtool: "source-map",
  entry: [
    (env !== "production" && "react-hot-loader/patch"),
    (env !== "production" && "webpack-hot-middleware/client"),
    "font-awesome-sass-loader!./font-awesome.config.js",
    "./src/index.js"
  ].filter(f => f),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/"
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: [
          {
            loader: 'url-loader',
            options: { limit: 10000, mimetype: 'application/font-woff' },
          }
        ]
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [ { loader: 'file-loader' } ]
      },
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
    (env !== "production" && new webpack.HotModuleReplacementPlugin()),
    new webpack.EnvironmentPlugin(defines),
    new webpack.NamedModulesPlugin(),
  ].filter(p => p),
  resolve: {
    alias: {
      "react": "preact-compat",
      "react-dom": "preact-compat",
      "preact-compat": "preact-compat/dist/preact-compat"
    }
  }
};
