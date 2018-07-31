 const path = require('path');
 const CleanWebpackPlugin = require('clean-webpack-plugin');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
 const ProgressPlugin = require('webpack/lib/ProgressPlugin');
 const PurifyPlugin = require('@angular-devkit/build-optimizer').PurifyPlugin;
 const ModuleConcatenationPlugin = require('webpack').optimize;
 const NamedLazyChunksWebpackPlugin = require('angular-named-lazy-chunks-webpack-plugin');
 const HtmlWebpackExternalPlugin = require('html-webpack-externals-plugin');
 
 //const SuppressExtractedTextChunksWebpackPlugin  = require('suppress-chunks-webpack-plugin');
// const BaseHrefWebpackPlugin = require('base-href-webpack-plugin');
 const {NamedModulesPlugin, SourceMapDevToolPlugin,HashedModuleIdsPlugin,NoEmitOnErrorsPlugin } = require('webpack');
// const {AngularCompilerPlugin} = require('@ngtools/webpack')
 
 const entryPoints = ["inline","polyfills","styles","vendor","main"];
 const pkg = require('./package.json');
 const fileName = `${pkg.name}-${pkg.version}`;
 const options = require('./build.options');
 const thirdparty = require('./thirdparty');
 
 module.exports = function(env) {
    let defaultEnv = { prod: false, root: '/', sourceMaps: true };
    if (!env) {
        env = Object.assign(defaultEnv, options);
    } else {
        env = Object.assign(defaultEnv, options, env);
    }

    let isDev = !env.prod;
    let useSourcemaps = env.sourceMaps && env.sourceMaps !== 'false';
    let publicPath = env.root;
    
    let entries = {
        "main": [
            "./source/js/app.js",
            ]        
    };
    let prodPlugins = [
//        new SuppressExtractedTextChunksWebpackPlugin(),
        new HashedModuleIdsPlugin({
            "hashFunction": "md5",
            "hashDigest": "base64",
            "hashDigestLength": 4
        }),
//        new ModuleConcatenationPlugin(),
        new PurifyPlugin(),
/*        new AgularCompilerPlusing({
            "mainPath": "main.ts",
            "tsConfigPath": "source/tsconfig.app.json",
            "compilerOptions": {},
            "sourceMap": useSourcemaps,
            "skipCodeGeneration": false
        })
*/        
        ];
    let devPlugins = [
        new NamedLazyChunksWebpackPlugin(),
        new NamedModulesPlugin(),
/*        new AgularCompilerPlusing({
            "mainPath": "main.ts",
            "tsConfigPath": "source/tsconfig.app.json",
            "compilerOptions": {},
            "sourceMap": useSourcemaps,
            "skipCodeGeneration": true
        })
*/        
        
        ];
        
    let plugins = [
     new CleanWebpackPlugin(['dist']),
     new NoEmitOnErrorsPlugin(),
     new ProgressPlugin(),
     new HtmlWebpackPlugin({
       title: 'Production',
       template: "./source/index2.ejs",
       filename: "./indexgen.html",
       hash: false,
       minify: false,
       chunks: ["all"],
       "chunksSortMode": 'dependency',
 /*      "chunksSortMode": function sort(left,right) {
         let leftIndex = entryPoints.indexOf(left.names[0]);
         let rightIndex = entryPoints.indexOf(right.names[0]);
         if (leftIndex > rightIndex) {
             return 1;
         } else if (leftIndex < rightIndex) {
             return -1;
         } else {
            return 0;  
         }
       },
*/       
        isDev: isDev,
       xhtml: true,
       compile: true,
       cache: true,
       showErrors: true,
       inject: true
     }),
     new HtmlWebpackExternalPlugin({
         externals: thirdparty
     })
//     new BaseHrefWebpackPlugin({baseHref: '/app/'})
   ];

    let output = {
      filename: fileName + '.[name].js',
      "chunkFilename": "[id].[chunkhash:20].chunk.js",
      "crossOriginLoading": false,
      "publicPath": publicPath,
     path: path.resolve(__dirname, 'dist')
   };

    
    plugins = isDev ? plugins.concat(devPlugins) : plugins.concat(prodPlugins);

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
            ".ts", ".js", ".json"],
    "modules": ["./node_modules"],
    "symlinks": true,
    },
    "resolveLoader": {
        "modules": ["./node_modules"]
    },
   "entry": entries,
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
