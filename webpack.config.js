const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const ENVS = {
    mode:  (process.env && process.env.production) ? 'production' : 'development'
    ,sslkey: path.resolve(__dirname, 'src', 'ssl', 'dev.key')
    ,sslcrt: path.resolve(__dirname, 'src', 'ssl', 'dev.crt')
    ,sslpem: path.resolve(__dirname, 'src', 'ssl', 'dev.pem')
    ,host: '0.0.0.0'
    ,port: 8081
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
                        "@babel/preset-env"
                        ,"@babel/preset-react"
                    ]
                    ,"compact": false
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
                    'style-loader'
                    ,MiniCssExtractPlugin.loader
                    ,{
                        loader: 'sass-loader'
                        ,options: {
                            implementation: require('sass')
                            ,sassOptions: { fiber: require('fibers') }
                            ,includePaths: [ path.resolve(__dirname, ENVS.nodemodules) ]
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
        ,inline: true
        ,contentBase: ENVS.output
        ,watchContentBase: true
        ,hot: true
        ,open: false
        ,historyApiFallback: true
        // ,http2: true
        // ,https: {
        //     key: ENVS.sslkey,
        //     cert: ENVS.sslcrt,
        //     ca: ENVS.sslpem,
        // }
        ,proxy: {
            '**': {
              target: 'http://192.168.10.80:8084',
              secure: false
            }
        }
    },
    devtool: (ENVS.mode === 'development') ? 'source-map' : 'none'
    ,
    // 'inline-source-map',
    plugins: [
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