'use strict';

import ArrayElementBase from './base';


export default class BoxAndWiskers extends ArrayElementBase {
  draw(ctx) {
    const boxplot = this.boxplot;
    const vert = this.isVertical();

    this._drawItems(boxplot, ctx, vert);

    ctx.save();

    ctx.fillStyle = this.options.backgroundColor;
    ctx.strokeStyle = this.options.borderColor;
    ctx.lineWidth = this.options.borderWidth;

    this._drawBoxPlot(boxplot, ctx, vert);
    this._drawOutliers(boxplot, ctx, vert);

    ctx.restore();
  }
  _drawBoxPlot(boxplot, ctx, vert) {
    if (!boxplot.items || boxplot.items.length <= 1) {
      return;
    }

    ctx.beginPath();
    if (vert) {
      const x = this.x;
      const width = this.width;
      const x0 = x - width / 2;
      ctx.fillRect(x0, boxplot.q1, width, boxplot.q3 - boxplot.q1);
      ctx.strokeRect(x0, boxplot.q1, width, boxplot.q3 - boxplot.q1);
      ctx.moveTo(x0, boxplot.whiskerMin);
      ctx.lineTo(x0 + width, boxplot.whiskerMin);
      ctx.moveTo(x, boxplot.whiskerMin);
      ctx.lineTo(x, boxplot.q1);
      ctx.moveTo(x0, boxplot.whiskerMax);
      ctx.lineTo(x0 + width, boxplot.whiskerMax);
      ctx.moveTo(x, boxplot.whiskerMax);
      ctx.lineTo(x, boxplot.q3);
      ctx.moveTo(x0, boxplot.median);
      ctx.lineTo(x0 + width, boxplot.median);
    } else {
      const y = this.y;
      const height = this.height;
      const y0 = y - height / 2;
      ctx.fillRect(boxplot.q1, y0, boxplot.q3 - boxplot.q1, height);
      ctx.strokeRect(boxplot.q1, y0, boxplot.q3 - boxplot.q1, height);

      ctx.moveTo(boxplot.whiskerMin, y0);
      ctx.lineTo(boxplot.whiskerMin, y0 + height);
      ctx.moveTo(boxplot.whiskerMin, y);
      ctx.lineTo(boxplot.q1, y);
      ctx.moveTo(boxplot.whiskerMax, y0);
      ctx.lineTo(boxplot.whiskerMax, y0 + height);
      ctx.moveTo(boxplot.whiskerMax, y);
      ctx.lineTo(boxplot.q3, y);
      ctx.moveTo(boxplot.median, y0);
      ctx.lineTo(boxplot.median, y0 + height);
    }
    ctx.stroke();
    ctx.closePath();
  }
  _getBounds() {
    const vert = this.isVertical();
    const boxplot = this.boxplot;

    if (!boxplot) {
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
        top: boxplot.max,
        right: x0 + width,
        bottom: boxplot.min
      };
    }
    const {y, height} = this;
    const y0 = y - height / 2;
    return {
      left: boxplot.min,
      top: y0,
      right: boxplot.max,
      bottom: y0 + height
    };
  }
  height() {
    return this.base - Math.min(this.boxplot.q1, this.boxplot.q3);
  }
  getArea() {
    const iqr = Math.abs(this.boxplot.q3 - this.boxplot.q1);
    if (this.isVertical()) {
      return iqr * this.width;
    }
    return iqr * this.height;
  }
}

BoxAndWiskers.id = 'boxandwhiskers';
