// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  output: {
    file: 'build/Chart.Plots.js',
    name: 'ChartPlots',
    format: 'umd',
    globals: {
      'chart.js': 'Chart'
    }
  },
  external: ['chart.js'],
  plugins: [
    babel({
      presets: [
        [
          "@babel/preset-env",
          {
            'targets': {
              'browsers': ['ie 11']
            }
          }
        ]
      ],
      babelrc: false,
      comments: true,
      runtimeHelpers: true,
    }),
    resolve(),
    commonjs(),
  ]
};
