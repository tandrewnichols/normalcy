module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },

    browsers: [ 'ChromeHeadless' ],
    preprocessors: {
      'test/**/*.js': ['webpack']
    },

    files: [ 'test/**/*.js' ],

    client: {
      mocha: {
        color: true,
        diff: true
      }
    },

    webpack: {
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            }
          }
        ]
      }
    },

    logLevel: config.LOG_ERROR,

    plugins: [
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-webpack')
    ],
  });
};
