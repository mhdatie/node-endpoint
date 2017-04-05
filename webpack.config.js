const {resolve, join} = require('path');
const fs = require('fs');

const {
    ContextReplacementPlugin, ProgressPlugin,
    optimize: { UglifyJsPlugin }
} = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const production = process.env.NODE_ENV !== 'development';

const externals = fs.readdirSync('node_modules').reduce((acc, mod) => {
    if (mod === ".bin") {
        return acc
    }

    acc[mod] = "commonjs " + mod;
    return acc
}, {});

module.exports = {
    devtool: "source-map",
    target: 'node',
    entry: {
        'app': './src/server.ts'
    },
    output: {
        filename: '[name].bundle.js',
        path: resolve(join(__dirname, 'dist')),
        libraryTarget: 'commonjs2'
    },
    externals: externals,
    node: {
        console: false,
        global: true,
        process: true,
        Buffer: true,
        __filename: true,
        __dirname: true,
    },
    plugins: [
        new ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
                join(__dirname, 'src'),
                {}),
        new ProgressPlugin(),
        new ExtractTextPlugin({
            "filename": production ? "[name].[hash].bundle.css" : "[name].bundle.css",
            "disable": true
        }),
        new UglifyJsPlugin({
            mangle: {
                keep_fnames: true
            }
        })
    ],
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
                exclude: [
                    /\/node_modules\//
                ]
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.html$/,
                loader: "raw-loader"
            },
            {
                test: /\.ts$/,
                loaders: 'awesome-typescript-loader'
            }
        ]
    },
    resolve: {
        extensions: [
            ".ts",
            ".js"
        ],
        modules: [
            "./node_modules"
        ]
    },
    resolveLoader: {
        "modules": [
            "./node_modules"
        ]
    }
};