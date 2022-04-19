import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
const StyleLintPlugin = require('stylelint-webpack-plugin');

export default {
    mode: 'development',
    entry: [
        './client/app/index.js',
        './client/styles/style.scss'
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                options: {
                    presets:
                        [
                            '@babel/preset-react',
                            [
                                '@babel/preset-env',
                                {
                                    targets: {
                                        "ie": "11",
                                        'firefox': '60',
                                        'chrome': '49',
                                        'safari': '13',
                                        'edge': '79',
                                        'opera': '42',
                                    }
                                }
                            ]
                        ],
                    plugins: ['@babel/plugin-proposal-class-properties']
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader'
            },
            {
                test: /\.(js|jsx)$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules/')
                ],
                loader: "eslint-loader"
            },
        ],
    },
    output: {
        path: path.join(__dirname, 'dist', 'public'),
        filename: 'client.bundle.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "styles.css"
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'client', 'app', 'index.template.html'),
            filename: 'index.html'
        }),
        new StyleLintPlugin(),
    ],
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx'],
    },
    devtool: false,
    watchOptions: {
        poll: true
    }
};
