const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PATHS = {
  src: path.resolve(__dirname, "src"),
  dist: path.resolve(__dirname, "dist"),
  assets: "assets/",
};

const PAGES_DIR = `${PATHS.src}/pages`;
const PAGES = fs
  .readdirSync(PAGES_DIR)
  .filter((fileName) => fileName.endsWith(".pug"));

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  devServer: {
    contentBase: path.join(__dirname, "src"),
    port: 9000,
    open: true,
  },
  module: {
    rules: [
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      // CSS, PostCSS, Sass
      {
        test: /\.(scss|css)$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
      // изображения
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource",
      },
      // шрифты и SVG
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: "asset/inline",
      },
      {
        test: /\.pug$/,
        loader: "pug-loader",
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name].min.css`,
    }),
    ...PAGES.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: `${PAGES_DIR}/${page}`,
          filename: `./${page.replace(/\.pug/, ".html")}`,
        })
    ),
  ],
};
