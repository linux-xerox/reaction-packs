var ExtractTextPlugin = require("extract-text-webpack-plugin");

browser = process.env.BROWSER ||
    console.log('Use `npm run build` instead.') || process.exit(1);
console.log('Building', browser, 'extension');

var script_entry = 'reactionpacks.js';
var style_entry = 'reactionpacks.css';

// Firefox expects included scripts to be under the 'data' directory
if (browser === 'firefox') {
    script_entry = 'data/' + script_entry;
    style_entry = 'data/' + style_entry;
}

module.exports = {
    context: __dirname + '/src',
    entry: './reactionpacks.js',
    resolve: {
        alias: {
            '--browser': __dirname + '/browsers/' + browser + '.js'
        }
    },
    output: {
        path: __dirname + '/build/' + browser,
        filename: script_entry
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin(style_entry)
    ]
};
