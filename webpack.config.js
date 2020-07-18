const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/** MESSENGERS */
// var SysMsg = require('./src/msg/system.json');
// if(process.env && process.env.production) {
//     SysMsg = require('./src/msg/system_production.json');
// }

const ENVS = {
    mode:  (process.env && process.env.production) ? 'production' : 'development'
    ,sourceMap: (process.env && process.env.production) ? false : true
    ,sslkey: path.resolve(__dirname, 'src', 'ssl', 'sc.key')
    ,sslcrt: path.resolve(__dirname, 'src', 'ssl', 'sc.crt')
    ,sslpem: path.resolve(__dirname, 'src', 'ssl', 'sc.pem')
    ,host: '0.0.0.0'
    ,port: 8083
    // ,port: 443
    ,entry: path.resolve(__dirname, 'src', 'index.js')
    ,src: path.resolve(__dirname, 'src')
    ,output: path.resolve(__dirname, 'build')
    ,publicPath: '/'
    ,outfileJs: 'bundle-[hash].js'
    ,outfileCss: 'bundle-[hash].css'
    ,resolve: path.resolve(__dirname, 'src/js')
    ,extensions: [ '*' ,'.js', '.jsx', '.json', '.css', '.scss' ]
    ,public: path.resolve(__dirname, 'public')
    ,template: path.resolve(__dirname, 'public', 'index.html')
    ,favicon: 'favicon.ico'
    ,publicsrc: 'src'
    ,publiccss: 'dist'
    ,publicsounds: 'sounds'
    ,dailer: 'dailer.html'
    ,dailercss: 'WebRTC.css'
    ,nodemodules: 'node_modules'
    ,origin: '*'//SysMsg['sys']['app_dailer_host']
    // ,origin: 'http://192.168.56.53:8082/'
};
// let cookie;
module.exports = {
    mode: ENVS.mode,
    context: ENVS.src,
    entry: ENVS.entry,
    output: {
        path: ENVS.output
        ,publicPath: ENVS.publicPath
        ,filename: ENVS.outfileJs
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/
                ,exclude: '/' + ENVS.nodemodules + '/'
                // ,use: [ 'babel-loader', 'eslint-loader' ]
                ,loader: 'babel-loader'
                ,options: {
                    presets: [
                        '@babel/preset-env'
                        ,'@babel/preset-react'
                    ]
                    ,'compact': false
                }
            },
            {
                test: /\.html?$/
                ,loader: 'html-loader'
            },
            {
                test: /\.css$/
                ,exclude: [ '/' + ENVS.nodemodules + '/' ]
                ,use: [ 'style-loader'
                    ,MiniCssExtractPlugin.loader
                    ,{ loader: 'css-loader' }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // linkタグに出力する機能
                    "style-loader",
                    // CSSをバンドルするための機能
                    {
                      loader: "css-loader",
                      options: {
                        // オプションでCSS内のurl()メソッドの取り込みを禁止する
                        url: false,
                        // ソースマップの利用有無
                        sourceMap: ENVS.sourceMap,
          
                        // 0 => no loaders (default);
                        // 1 => postcss-loader;
                        // 2 => postcss-loader, sass-loader
                        importLoaders: 2
                      }
                    },
                    {
                      loader: "sass-loader",
                      options: {
                        // ソースマップの利用有無
                        sourceMap: ENVS.sourceMap
                      }
                    }
                  ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico)$/i,
                use: [ { loader: 'file-loader' } ]
            }
        ]
    },
    resolve: {
        modules: [ ENVS.nodemodules, ENVS.src ],
        extensions: ENVS.extensions,
    },

    devServer: {
        host: ENVS.host
        ,port: ENVS.port
        ,compress: true
        ,inline: false
        ,contentBase: ENVS.output
        ,watchContentBase: true
        ,hot: true
        ,open: false
        ,historyApiFallback: true
        ,disableHostCheck: true
        ,watchOptions: { aggregateTimeout: 300, poll: 1000 }
        // ,http2: true
        // ,https: {
        //     key: ENVS.sslkey,
        //     cert: ENVS.sslcrt,
        //     ca: ENVS.sslpem,
        // }
        ,headers: {
            'Access-Control-Allow-Origin': ENVS.origin
            // 'Access-Control-Allow-Headers': '*'
            // ,'Access-Control-Allow-Credentials': 'true'
            // ,"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS"
            // ,"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"        
        }
        // ,proxy: {
        //     '**': {
        //       target: 'http://192.168.56.53:8083'
        //       ,secure: false
        //       ,changeOrigin: true
        //     }
        // }
    }
    ,devtool: (ENVS.mode === 'development') ? 'cheap-module-source-map' : 'none'
    //'source-map'
    // 'inline-source-map',
    ,plugins: [
        new CleanWebpackPlugin()
        ,new webpack.HotModuleReplacementPlugin()
        ,new MiniCssExtractPlugin({ filename: ENVS.outfileCss })
        ,new HtmlWebpackPlugin({
            template: ENVS.template
            // ,favicon: ENVS.public + ENVS.publicPath + ENVS.favicon
        })
        ,new CopyWebpackPlugin([
            { from: ENVS.public + ENVS.publicPath + ENVS.favicon, to: ENVS.favicon },
            { from: ENVS.public + ENVS.publicPath + ENVS.dailer, to: ENVS.dailer },
            { from: ENVS.public + ENVS.publicPath + ENVS.dailercss, to: ENVS.dailercss },
            { from: ENVS.public + ENVS.publicPath + ENVS.publicsrc, to: ENVS.publicsrc },
            { from: ENVS.public + ENVS.publicPath + ENVS.publiccss, to: ENVS.publiccss },
            { from: ENVS.public + ENVS.publicPath + ENVS.publicsounds, to: ENVS.publicsounds },
        ]),
    ]
}