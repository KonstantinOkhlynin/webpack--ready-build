const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

console.log('isProd', isProd)
console.log('isDev', isDev)

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`


module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: ['@babel/polyfill','./index.js'],
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@core': path.resolve(__dirname, 'src/core')
        }
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
        port: 3000
    },
    target: process.env.NODE_ENV === "development" ? "web" : "browserslist", // Решил проблему перезагрузки при изменении файлов css/scss/sass, html и js. 23.06.21
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template:'index.html',
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd
            }
        }),
        new CopyPlugin({
            patterns: [
              { from: path.resolve(__dirname, 'src/favicon.ico'), 
              to: path.resolve(__dirname, 'dist') 
            },
            ],
          }),
          new MiniCssExtractPlugin({
            
            filename: filename('css'),
          })
    ],
    module: {
        rules: [
          {
            test: /\.(sa|sc|c)ss$/i,
            use: [
              (isDev ? 'style-loader' : MiniCssExtractPlugin.loader),
              "css-loader",
              "postcss-loader",
              "sass-loader"
            ],
          },
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: [{
              loader: "babel-loader",
              options: {
                presets: ['@babel/preset-env']
              },
            },
              'astroturf/loader' 
          ]
          },
          {
            test: /\.(eot|ttf|woff|woff2)$/,
            loader: 'file-loader',
            options: {
              name: './fonts/[name].[ext]',
          }
        },

        {
            test: /\.(png|jpe?g|svg|gif|ico)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: './images/[name].[ext]',
                        esModule: false
                    }
                },
                {
                    loader: 'image-webpack-loader',
                    options: {
                        bypassOnDebug: true,
                        disable: true,
                    },
                },
            ]
        },
        ],
      },
      
}