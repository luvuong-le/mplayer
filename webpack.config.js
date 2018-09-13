const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = {
    entry: [
        './src/js/main.js',
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/js')
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: "css-loader",
                    options: {
                        minimize: true,
                    }
                },
                {
                    loader: "postcss-loader",
                },
                {
                    loader: "sass-loader",
                }
            ]
        },
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ['env']
                }
            }
        },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "../css/main.css",
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 8000,
            files: ['./*/**'],
            server: {
                baseDir: ["./dist/"]
            }
        })
    ]
};