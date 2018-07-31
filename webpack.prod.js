 const merge = require('webpack-merge');
 const common = require('./webpack.common.js')();
 const webpack = require('webpack');

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
         }
       }
     }
   },
   plugins: [
     new webpack.HashedModuleIdsPlugin()
   ],
 });