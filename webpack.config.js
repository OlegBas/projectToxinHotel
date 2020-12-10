const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const OptimizeCssAssetWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack");

const optimization = () => {
  const configObj = {
    splitChunks: {
      chunks: "all",
    },
  };

  if (isProd) {
    configObj.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return configObj;
};

const plugins = () => {
  const basePlugins = [
    new MiniCssExtractPlugin({
      filename: `./assets/css/${filename("css")}`,
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: PATHS.assets,
          to: PATHS.dist + "/assets",
        },
      ],
    }),
    ...PAGES.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: `${PAGES_DIR}/${page}`,
          filename: `./${page.replace(/\.pug/, ".html")}`,
        })
    ),
  ];

  if (isProd) {
    // basePlugins.push(
    //   // new ImageminPlugin({
    //   //   bail: false, // Ignore errors on corrupted images
    //   //   cache: true,
    //   //   imageminOptions: {
    //   //     plugins: [
    //   //       ["gifsicle", { interlaced: true }],
    //   //       ["jpegtran", { progressive: true }],
    //   //       ["optipng", { optimizationLevel: 5 }],
    //   //       [
    //   //         "svgo",
    //   //         {
    //   //           plugins: [
    //   //             {
    //   //               removeViewBox: false,
    //   //             },
    //   //           ],
    //   //         },
    //   //       ],
    //   //     ],
    //   //   },
    //   // })
    // );
  }

  return basePlugins;
};

const PATHS = {
  src: path.resolve(__dirname, "src"),
  dist: path.resolve(__dirname, "dist"),
  assets: path.resolve(__dirname, "src/assets"),
};

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const filename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const PAGES_DIR = `${PATHS.src}/pages`;
const PAGES = fs
  .readdirSync(PAGES_DIR)
  .filter((fileName) => fileName.endsWith(".pug"));

module.exports = {
  context: PATHS.src,
  entry: "./js/index.js",
  output: {
    path: PATHS.dist,
    filename: `./assets/js/${filename("js")}`,
    publicPath: "",
  },
  devServer: {
    contentBase: PATHS.src,
    port: 9000,
    open: true,
  },
  optimization: optimization(),
  devtool: isProd ? false : "source-map",
  module: {
    rules: [
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      //CSS
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      //Sass
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
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
  plugins: plugins(),
};
