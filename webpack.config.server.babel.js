import path from 'path';
import webpack from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';


export default (env) => {
    return {
        mode: 'development',
        entry: ['./server/index.js'],
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'app.bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: [
                        path.resolve(__dirname, 'node_modules/')
                    ],
                    // loader: "eslint-loader"
                },
            ],
        },
        resolve: {
            extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        },
        plugins: [
            new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }),
        ],
        target: 'node',
        devtool: false,
        watchOptions: {
            poll: true
        }
    }
};
