'use strict';

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {

    mode: 'development',

    entry: {
        'main': [
            './src/static/ts/main.ts',
        ]
    },

    externals: {
        three: 'THREE',
        Ammo: 'Ammo'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'static/js/[name].js'
    },

    devtool: 'cheap-module-source-map',

    stats: 'minimal',

    devServer: {
        port: 8080,
        host: '0.0.0.0',
        historyApiFallback: true,
        open: true,
        static: {
            directory: path.join(__dirname, 'static'),
            publicPath: '/static'
        }
    },

    resolve: {
        extensions: ['.ts', '.js', '.scss']
    },

    module: {
        rules: [{
            test: /\.js$/,
            enforce: 'pre',
            loader: 'source-map-loader',
            exclude: /node_modules/
        }, {
            test: /\.ts$/,
            include: path.resolve(__dirname, 'src/static/ts'),
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime']
                }
            }, {
                loader: 'ts-loader',
                options: {
                    onlyCompileBundledFiles: true
                }
            }]
        }, {
            test: /\.scss$/,
            include: path.resolve(__dirname, 'src/static/scss'),
            use: [{
                loader: MiniCssExtractPlugin.loader,
            }, {
                loader: 'css-loader'
            }, {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        ident: 'postcss',
                        plugins: [
                            autoprefixer()
                        ]
                    }
                }
            }, {
                loader: 'sass-loader'
            }]
        }, {
            test: /\.(eot|otf|ttf|woff|woff2)$/,
            include: path.resolve(__dirname, 'src/static/fonts'),
            type: 'asset/resource',
            generator: {
                filename: 'static/fonts/[name][ext]'
            }
        }, {
            test: /\.(jpg|png|webp|gif|svg|ico)$/,
            include: path.resolve(__dirname, 'src/static/gfx'),
            type: 'asset/resource',
            generator: {
                filename: 'static/gfx/[name][ext]'
            }
        }, {
            test: /\.js$/,
            include: path.resolve(__dirname, 'src/static/js'),
            type: 'asset/resource',
            generator: {
                filename: 'static/js/[name][ext]'
            }
        }, {
            test: /\.json$/,
            include: path.resolve(__dirname, 'src/static/models'),
            type: 'asset/resource',
            generator: {
                filename: 'static/models/[name][ext]'
            }
        }, {
            test: /\.glsl$/,
            include: path.resolve(__dirname, 'src/static/shaders'),
            type: 'asset/source'
        }]
    },

    plugins: [

        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
            DEBUG: true
        }),

        new CopyWebpackPlugin({
            patterns: [
                {from: 'src/robots.txt', to: '.'},
                {from: 'src/sitemap.xml', to: '.'},
                {from: 'src/static/js/*', to: 'static/js/[name][ext]'},
                {from: 'src/static/gfx/*', to: 'static/gfx/[name][ext]'},
                {from: 'src/static/models/*', to: 'static/models/[name][ext]'},
                {from: 'node_modules/three/build/three.js', to: 'static/js/three.js'}
            ]
        }),

        new MiniCssExtractPlugin({
            filename: 'static/css/[name].css'
        }),

        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
            hash: false,
            inject: false,
            compile: true,
            cache: true,
            showErrors: true,
            minify: false,
            chunksSortMode: 'manual',
            chunks: ['main']
        })
    ],

    optimization: {
        minimize: false,
    },

    performance: {
        hints: false,
    },

    watchOptions: {
        ignored: /node_modules|dist/
    },
};
