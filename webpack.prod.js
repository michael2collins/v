 const merge = require('webpack-merge');
 const common = require('./webpack.common.js')();
 const webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"); 

 module.exports = merge(common, {
   mode: 'production',
   devtool: 'source-map',
   optimization: {
     runtimeChunk: 'single',
     splitChunks: {
       cacheGroups: {
         vendor: {
           test: /[\\/]node_modules[\\/]/,
           name: 'vendors',
           chunks: 'all'
         },
         styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
       }
     },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]     
   },
   plugins: [
     new webpack.HashedModuleIdsPlugin()
   ],
 });