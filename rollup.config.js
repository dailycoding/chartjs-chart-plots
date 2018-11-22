// rollup.config.js

export default {
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
  ]
};
