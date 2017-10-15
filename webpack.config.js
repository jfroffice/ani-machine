var UglifyJSPlugin = require('uglifyjs-webpack-plugin')
var webpack = require('webpack')
var pkg = require('./package.json');
var outputs = ['ani-machine.js', 'ani-machine.min.js'];

module.exports = outputs.map(function(filename) {
  var config = {
    entry: './js/index.js',
    output: {
      path: __dirname + '/dist/',
      filename: filename,
      library: 'am',
      libraryTarget: 'window'
    },
    resolve: {
      modules: [
        'node_modules',
        'js',
        '.'
      ]
    },
    module: {
      loaders: [{
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }]
    },
    plugins: [
      new webpack.BannerPlugin(`${pkg.name} - ${pkg.description}
@version v${pkg.version}
@link ${pkg.homepage}
@license ${pkg.license}`)
    ]
  };

  if (filename.indexOf('min.js') > 0) {
    config.plugins.push(new UglifyJSPlugin());
  }
  
  return config;
});
