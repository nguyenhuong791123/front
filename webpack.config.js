const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENVS = {
    mode:  'development'
    ,host: '0.0.0.0'
    ,port: 8080
    ,entry: path.resolve(__dirname, 'src', 'index.js')
    ,src: path.resolve(__dirname, 'src')
    ,output: path.resolve(__dirname, 'build')
    ,publicPath: '/'
    ,outfile: 'bundle.js'
    ,resolve: path.resolve(__dirname, 'src/js')
    ,extensions: [ '*' ,'.js', '.jsx', '.json' ]
    ,template: path.resolve(__dirname, 'public', 'index.html')
    ,favicon: path.resolve(__dirname, 'public', 'favicon.ico')
};

module.exports = {
    mode: ENVS.mode,
    context: ENVS.src,
    entry: ENVS.entry,
    output: {
        path: ENVS.output
        ,publicPath: ENVS.publicPath
        ,filename: ENVS.outfile
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/
                ,exclude: /node_modules/
                ,loader: 'babel-loader'
                // ,options: {
                //     presets: [
                //         "@babel/preset-env"
                //         ,"@babel/preset-react"
                //     ]
                // }
            },
            {
                test: /\.html?$/
                ,loader: 'html-loader'
            },
            {
                test: /\.css$/,
                exclude: [ /node_modules/ ],
                use: [ "style-loader", { loader: "css-loader", options: { url: false, modules: true } } ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader'
                    // ,'css-loader'
                    ,{
                        loader: 'sass-loader'
                        ,options: {
                            implementation: require('sass')
                            ,sassOptions: { fiber: require('fibers') }
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
        modules: [ 'node_modules', ENVS.src ],
        extensions: ENVS.extensions,
    },
    devServer: {
        host: ENVS.host
        ,port: ENVS.port
        ,inline: true
        ,contentBase: ENVS.output
        ,watchContentBase: true
        ,hot: true
        ,open: false
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin()
        ,new HtmlWebpackPlugin({ template: ENVS.template, favicon: ENVS.favicon })
    ]
}