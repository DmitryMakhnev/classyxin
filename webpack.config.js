var path = require('path');
var webpack = require('webpack');
var bowerConfig = require('./bower');

module.exports = {

    entry: path.resolve(bowerConfig.main),

    output: {
        path: path.resolve(bowerConfig.dist),
        filename: 'classyxin.js',
        libraryTarget: 'umd',
        library: 'classyxin'
    },

    externals: {
        defaultLib: 'classyxin'
    },

    resolve: {
        root: [path.join(__dirname, 'bower_components')]
    },

    module: {
        loaders: [
            //loader removes code for testing
            {
                test: /^.*$/,
                loader: 'regexp',
                rules: [
                    {
                        //TODO: [dmitry.makhnev] modify this regexp
                        'for': /\/\*@defaultTesting.exports\*\/[\w\.=+\-<>,'"/%/\[\];:(){}\s]*\*@\/defaultTesting.exports\*\//g,
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