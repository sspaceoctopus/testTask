const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let conf = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'main.js',
        publicPath: 'dist/'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "style.css",
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node-modules/'
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            }
        ]
    }
};

module.exports = (env, options) =>{
    let production = options.mode === 'production';
    conf.devtool = production ? 'source-map' : 'eval-sourcemap';
    return conf;

};