var wallabyWebpack = require('wallaby-webpack');
var webpack = require('webpack');
var path = require('path');

module.exports = function (wallaby) {
    var wallabyPostprocessor = wallabyWebpack({
        plugins: [
            new webpack.ResolverPlugin(
              new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
            )
        ],

        resolve: {
            modulesDirectories: [
                path.join(wallaby.projectCacheDir, 'src'),
                path.join(__dirname, 'bower_components')
            ]
        }
    });

    return {
        // set `load: false` to all of source files and tests processed by webpack
        // (except external files),
        // as they should not be loaded in browser,
        // their wrapped versions will be loaded instead
        files: [
            { pattern: 'src/**/*.js', load: false }
        ],

        tests: [
            { pattern: 'tests/specs/**/*.js', load: false }
        ],

        postprocessor: wallabyPostprocessor,

        bootstrap: function () {
            window.__moduleBundler.loadTests();
        }
    };
};