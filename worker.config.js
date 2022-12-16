const path = require('path');

module.exports = {
  entry: {
      "workers/mainworker": "./src/scripts/workers/mainWorker.ts",
            "workers/childworker": "./src/scripts/workers/childWorker.ts",
  },
 devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public'),
  },
};