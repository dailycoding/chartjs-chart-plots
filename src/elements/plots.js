'use strict';

import * as Chart from 'chart.js';
import ArrayElementBase, {defaults} from './base';


Chart.defaults.global.elements.plots = Object.assign({}, defaults);

const Plots = Chart.elements.Plots = ArrayElementBase.extend({
  draw() {
    const ctx = this._chart.ctx;
    const vm = this._view;

    const plots = vm.plots;
    const vert = this.isVertical();

    this._drawItems(vm, plots, ctx, vert);
  },
  _getBounds() {
    const vm = this._view;

    const vert = this.isVertical();
    const plots = vm.plots;

    if (!plots) {
      return {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      };
    }

    if (vert) {
      const {x, width} = vm;
      const x0 = x - width / 2;
      return {
        left: x0,
        top: plots.max,
        right: x0 + width,
        bottom: plots.min
      };
    }
    const {y, height} = vm;
    const y0 = y - height / 2;
    return {
      left: plots.min,
      top: y0,
      right: plots.max,
      bottom: y0 + height
    };
  },
  height() {
    const vm = this._view;
    return vm.base - Math.min(vm.boxplot.q1, vm.boxplot.q3);
  },
  getArea() {
    const vm = this._view;
    const iqr = Math.abs(vm.boxplot.q3 - vm.boxplot.q1);
    if (this.isVertical()) {
      return iqr * vm.width;
    }
    return iqr * vm.height;
  }
});

export default Plots;
