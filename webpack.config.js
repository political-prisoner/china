const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: __dirname + "/docs",
    filename: "dist/app.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "en/index.html",
      template: "src/templates/en/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "zh/index.html",
      template: "src/templates/zh/index.html",
    }),
  ],
};
