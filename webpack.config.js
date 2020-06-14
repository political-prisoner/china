const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    output: {
        path: __dirname + '/docs',
        filename: 'dist/[name].[contenthash:6].js'
    },
    mode: "production",

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".js", ".ts"]
    },

    plugins: [
        new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ['dist/*'],}),
        new HtmlWebpackPlugin({
            filename: 'en/index.html',
            template: 'src/templates/en/index.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'zh/index.html',
            template: 'src/templates/zh/index.html'
        })
    ],

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ]
    }
};
