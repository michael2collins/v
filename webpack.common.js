 const path = require('path');
 const autoprefixer = require('autoprefixer');
 const webpack = require('webpack');
 const CleanWebpackPlugin = require('clean-webpack-plugin');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
 // const ExtractTextPlugin = require('extract-text-webpack-plugin');
 const MiniCssExtractPlugin = require("mini-css-extract-plugin");
 const ProgressPlugin = require('webpack/lib/ProgressPlugin');
 const PurifyPlugin = require('@angular-devkit/build-optimizer').PurifyPlugin;
 const NamedLazyChunksWebpackPlugin = require('angular-named-lazy-chunks-webpack-plugin');
 const HtmlWebpackExternalPlugin = require('html-webpack-externals-plugin');
 const { NamedModulesPlugin, SourceMapDevToolPlugin, HashedModuleIdsPlugin, NoEmitOnErrorsPlugin, EnvironmentPlugin } = require('webpack');

 const ManifestPlugin = require('webpack-manifest-plugin');
 const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin');
 const ProvidePlugin = require('webpack/lib/ProvidePlugin');

 const entryPoints = ["inline", "polyfills", "styles", "vendor", "main"];
 const pkg = require('./package.json');
 const fileName = `${pkg.name}-${pkg.version}`;
 const options = require('./build.options');
 const thirdparty = require('./thirdparty');

 const CopyWebpackPlugin = require('copy-webpack-plugin');

 module.exports = function(env) {
     let defaultEnv = { prod: false, root: '/', sourceMaps: true };
     if (!env) {
         env = Object.assign(defaultEnv, options);
     }
     else {
         env = Object.assign(defaultEnv, options, env);
     }

     let isDev = !env.prod;
     let useSourcemaps = env.sourceMaps && env.sourceMaps !== 'false';
     //     let publicPath = env.root;
     let publicPath = '/';


     let entries = {
         "app": "./source/js/app.js"
         /*         "admin": "./source/client/admin/admin.module.ts",
                  "attendance": "./source/client/attendance/attendance.module.ts",
                  "main": "./source/client/main/main.module.ts",
                  "photos": "./source/client/photos/photo.module.ts",
                  "student": "./source/client/student/student.module.ts",
                  "portal": "./source/client/portal/portal.module.ts",
                  "payment": "./source/client/payment/payment.module.ts",
                  "login": "./source/client/login/login.module.ts",
                  "events": "./source/client/events/events.module.ts",
                  "email": "./source/client/email/email.module.ts",
                  "cc": "./source/client/cc/cc.module.ts",
                  "testmgmt": "./source/client/testmgmt/testmgmt.module.ts"
         */
     };

     let rules = [
         {
             "test": /\.(html)$/,
             "loader": "raw-loader"
         },
         /*  {
                 // Resolve against package path.
                 // require.resolve returns a path to it.
                 test: require.resolve("jquery"),
                 loader: "imports-loader?$=jquery",
               },         
         */
         /*       {
                     test: require.resolve('angular'),
                     loader: 'exports-loader?window.angular'
                 },
         */
         /*         {
                      // JS LOADER
                      // Reference: https://github.com/babel/babel-loader
                      // Transpile .js files using babel-loader
                      // Compiles ES6 and ES7 into ES5 code

                      test: /\.js$/,
                      exclude: /(node_modules|bower_components)/,
                      use: {
                          loader: 'babel-loader'
                          //                 options: {
                          //                     presets: ['@babel/preset-env']
                          //                 }
                      }
                  },
         */
         {
             "test": /\.(jpg|png|gif|ttf|woff|webp|otf|woff2|ani)$/,
             "loader": "url-loader",
             "options": {
                 "name": "[name].[hash:20].[ext]",
                 "limit": 10000
             }
         },
         {
             test: /\.less$/,
             use: [{
                 loader: 'style-loader'
             }, {
                 loader: 'css-loader',
                 options: {
                     sourceMap: true,
                 }
             }, {
                 loader: 'less-loader',
                 options: {
                     sourceMap: true,
                     paths: [
                         path.resolve(__dirname, './source/less')
                     ]
                 }
             }]
         },
         {
             test: /\.(sa|sc|c)ss$/,
             use: [
                 isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                 'css-loader',
                 'postcss-loader',
                 'sass-loader',
             ],
         }

     ];
     let prodRules = [{
             test: /\.js$/,
             exclude: /(node_modules|bower_components)/,
             use: {
                 loader: 'babel-plugin-angularjs-annotate',
                 loader: 'babel-loader'
             }
   
         //    "test": /(?:\.ngfactor\.js|\.ngstyle\.js\|\.ts)$/,
         //    "loader": "@ngtools/webpack"
         // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`

         //       test: /(\.js$|\.ts(x?)$)/,
         /*        test: /(\.js$)/,
                 exclude: /node_modules/,
                 use: [
                   { loader: 'babel-loader' },
         //          { loader: 'ts-loader' }

                 }]
         */
     }];
     let devRules = [
         // angular 2
         //         "test": /(?:\.ngfactor\.js|\.ngstyle\.js\|\.ts)$/,
         //         "loader": "@ngtools/webpack"
         {

             test: /\.js$/,
             exclude: /(node_modules|bower_components)/,
             use: {
                 loader: 'babel-plugin-angularjs-annotate',
                 loader: 'babel-loader'
             }
         },
         /*         {
                 test: /(\.ts(x?)$)/,
                 exclude: /node_modules/,
                 use: [
                   { loader: 'ts-loader' }
                 ]
              },
         */
     ];

     let prodPlugins = [
         new EnvironmentPlugin({
             "NODE_ENV": isDev ? "development" : "production"
         }),
         new HashedModuleIdsPlugin({
             "hashFunction": "md5",
             "hashDigest": "base64",
             "hashDigestLength": 4
         }),
         new PurifyPlugin(),
     ];
     let devPlugins = [
         new NamedLazyChunksWebpackPlugin(),
         new NamedModulesPlugin(),
     ];

     let plugins = [
         new CleanWebpackPlugin(['build']),
         new ProvidePlugin({
             jQuery: 'jquery',
             $: 'jquery',
             jquery: 'jquery',
             'window.jQuery': 'jquery',
             'window.$': 'jquery',
             //          'angular': 'angular',
         }),
         /*         new webpack.LoaderOptionsPlugin({
                      test: /\.scss$/i,
                      options: {
                          postcss: {
                              plugins: [autoprefixer]
                          }
                      }
                  }),
          */
         new NoEmitOnErrorsPlugin(),
         new ProgressPlugin(),
         new HtmlWebpackPlugin({
             title: 'Production',
             template: "./source/index2.ejs",
             filename: "./index.html",
             hash: false,
             minify: false,
             chunks: [
                 "app",
                 //                 "admin",
                 //                 "attendance",
                 //                 "cc", "email", "events", "login", "main", "payment", "photos", "portal", "student", "testmgmt"
                 "login",
                 "main",
                 "portal",
             ],
             "chunksSortMode": 'dependency',
             isDev: isDev,
             xhtml: true,
             compile: true,
             cache: false,
             showErrors: true,
             inject: true
         }),
         new HtmlWebpackExternalPlugin({
             externals: thirdparty
         }),
         new CopyWebpackPlugin([

            {
             "test": /\.html$/,
                from:'./source/**/template/*',
                to:'template',
                flatten: true
            },
            {
             "test": /\.html$/,
                from:'./source/**/includes/*',
                to:'templates/includes',
                flatten: true
            } 
        ]),          
         new MiniCssExtractPlugin({
             // Options similar to the same options in webpackOptions.output
             // both options are optional
             filename: isDev ? '[name].css' : '[name].[hash].css',
             chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
         }),
         new ManifestPlugin({
             fileName: 'manifest.json'
         })
         //         new DynamicCdnWebpackPlugin()         
     ];

     let output = {
         filename: fileName + '.[name].js',
         "chunkFilename": "[id].[chunkhash:20].chunk.js",
         "crossOriginLoading": false,
         "publicPath": publicPath,
         path: path.resolve(__dirname, 'build')
     };


     plugins = isDev ? plugins.concat(devPlugins) : plugins.concat(prodPlugins);
     rules = isDev ? rules.concat(devRules) : plugins.concat(prodRules);

     if (useSourcemaps) {
         plugins.push(new SourceMapDevToolPlugin({
             "filename": "[file].map[query]",
             "moduleFilenameTemplate": "[resource-path]?[hash]",
             "sourceRoot": "webpack:///"
         }))
     }
     const config = {
         "resolve": {
             "extensions": [
                 //                 ".ts", ".js", ".json"
                 ".js", ".json"
             ],
             //          "modules": ["./node_modules"],
             "symlinks": true,
         },
         "resolveLoader": {
             //         "modules": ["./node_modules"]
         },
         "entry": entries,
         "module": {
             "rules": rules
         },
         "plugins": plugins,
         "output": output,
         "node": {
             "fs": "empty",
             "global": true,
             "process": true,
             "module": false
         }
     };

     return config;
 };
 