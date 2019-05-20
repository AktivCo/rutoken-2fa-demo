import path from 'path';
import webpack from 'webpack';

export default {
    mode: 'development',
    entry: ['./server/index.js'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    plugins: [
        new webpack.IgnorePlugin(/^pg-native$/),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules/')
                ],
                loader: "eslint-loader"
            },
        ],
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    },
    target: 'node',
    devtool: false,
    watchOptions: {
        poll: true
    }
};
