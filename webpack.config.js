var path = require('path');
var webpack = require('webpack');
var bowerConfig = require('./bower');

module.exports = {

    entry: path.resolve(bowerConfig.main),

    output: {
        path: path.resolve(bowerConfig.dist),
        filename: bowerConfig.umdName + '.js',
        libraryTarget: 'umd',
        library: bowerConfig.umdName
    },

    resolve: {
        root: [path.join(__dirname, 'bower_components')]
    },

    module: {
        loaders: [
            //loader removes code for testing
            {
                test: /^.*$/,
                loader: 'annotation',
                annotations: [
                    {
                        'for': 'DTesting.exports',
                        'do': ''
                    }
                ]
            }
        ]
    },

    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        ),
        new webpack.optimize.UglifyJsPlugin()
    ]
};