const {resolve, join} = require('path');
const fs = require('fs');

const {
    ContextReplacementPlugin, ProgressPlugin,
    optimize: { UglifyJsPlugin }
} = require('webpack');

const production = process.env.NODE_ENV !== 'development';

const externals = fs.readdirSync('node_modules').reduce((acc, mod) => {
    if (mod === ".bin") {
        return acc
    }

    acc[mod] = "commonjs " + mod;
    return acc
}, {});

module.exports = {
    devtool: production ?
        'source-map' :
        'inline-source-map',
    target: 'node',
    entry: './src/server.ts',
    output: {
        filename: 'index.js',
        path: resolve(join(__dirname, 'dist')),
        libraryTarget: 'commonjs2'
    },
    externals: externals,
    plugins: [],
    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: [
                    'awesome-typescript-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.webpack.js', '.ts', '.js'],
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