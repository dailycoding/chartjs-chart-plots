'use strict';

import ArrayElementBase from './base';


export default class Plots extends ArrayElementBase {
  draw(ctx) {
    const plots = this.plots;
    const vert = this.isVertical();

    this._drawItems(plots, ctx, vert);
  }
  _getBounds() {
    const vert = this.isVertical();
    const plots = this.plots;

    if (!plots) {
      return {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      };
    }

    if (vert) {
      const {x, width} = this;
      const x0 = x - width / 2;
      return {
        left: x0,
        top: plots.max,
        right: x0 + width,
        bottom: plots.min
      };
    }
    const {y, height} = this;
    const y0 = y - height / 2;
    return {
      left: plots.min,
      top: y0,
      right: plots.max,
      bottom: y0 + height
    };
  }
  height() {
    return this.base - Math.min(this.boxplot.q1, this.boxplot.q3);
  }
  getArea() {
    const iqr = Math.abs(this.plots.q3 - this.plots.q1);
    if (this.isVertical()) {
      return iqr * this.width;
    }
    return iqr * this.height;
  }
}

Plots.id = 'plots';
