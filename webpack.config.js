var webpack = require('webpack');  
module.exports = {  
  entry: [
    "./js/app.js"
  ],
  output: {
    path: __dirname + '/server/flask_app/static',
    filename: "bundle.js"
  },
  watchOptions: {
    poll: 15000
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
  ]
};
