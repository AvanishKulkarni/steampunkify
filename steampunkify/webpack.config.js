/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Webpack wire up.
module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    index: "./src/ui/index.js",
    code: "./src/documentSandbox/code.js",
  },
  devtool: "source-map",
  experiments: {
    topLevelAwait: true,
    outputModule: true,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    module: true,
    filename: "[name].js",
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'sounds'), // Serve static files from 'sounds' directory
      publicPath: '/sounds', // URL path to access files
    },
    port: 5241,
    hot: true,
    open: true,
  },
  externalsType: "module",
  externalsPresets: { web: true },
  externals: {
    "add-on-sdk-document-sandbox": "add-on-sdk-document-sandbox",
    "express-document-sdk": "express-document-sdk",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      scriptLoading: "module",
      excludeChunks: ["code"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/*.json", to: "[name][ext]" },
        { from: "src/*.css", to: "[name][ext]" },
        { from: "src/*.png", to: "[name][ext]", noErrorOnMissing: true },
        { from: "src/ui/sounds", to: "sounds" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        test: /(\.css)$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.mp3$/,
        type: 'asset/resource', // Serve mp3 files as assets
        generator: {
          filename: 'sounds/[name][ext]', // Output them in sounds folder in dist
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".css"],
  },
};
