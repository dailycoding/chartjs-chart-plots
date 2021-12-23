'use strict';

import * as Chart from 'chart.js';
import {rnd} from '../data';

const defaults = {
  borderWidth: 1,
  outlierRadius: 2,
  outlierColor: Chart.defaults.elements.bar.backgroundColor,
  itemRadius: 2,
  itemStyle: 'circle',
  hitPadding: 2
};

export default class ArrayElementBase extends Chart.BarElement {
  isVertical() {
    return this.width !== undefined;
  }
  draw() {
    // abstract
  }
  _drawItems(container, ctx, vert) {
    if (this.options.itemRadius <= 0 || !container || !container.items || container.items.length <= 0) {
      return;
    }

    ctx.save();
    ctx.strokeStyle = this.options.borderColor;
    ctx.fillStyle = this.options.backgroundColor;
    // jitter based on random data
    // use the median to initialize the random number generator
    const random = rnd(container.median);

    // Save item radius and each position
    container.itemRadius = this.options.itemRadius;
    container.itemsPos = [];
    this.options.radius = this.options.itemRadius;

    if (vert) {
      for (let i = 0; i < container.items.length; i++) {
        container.itemsPos[i] = this.x - this.width / 2 + random() * this.width;
        Chart.helpers.drawPoint(ctx, this.options, container.itemsPos[i], container.items[i]);
      }
    } else {
      for (let i = 0; i < container.items.length; i++) {
        container.itemsPos[i] = this.y - this.height / 2 + random() * this.height;
        Chart.helpers.drawPoint(ctx, this.options, container.items[i], container.itemsPos[i]);
      }
    }
    ctx.restore();
  }
  _drawOutliers(container, ctx, vert) {
    if (!container || !container.outliers || !this.boxplot.itemsPos) {
      return;
    }
    ctx.fillStyle = this.options.outlierColor;
    ctx.beginPath();
    if (vert) {
      container.outliers.forEach((v) => {
        let idx = this.boxplot.items.indexOf(v);
        if (idx >= 0) {
          ctx.arc(this.boxplot.itemsPos[idx], v, this.options.outlierRadius, 0, Math.PI * 2);
        }
      });
    } else {
      container.outliers.forEach((v) => {
        let idx = this.boxplot.items.indexOf(v);
        if (idx >= 0) {
          ctx.arc(v, this.boxplot.itemsPos[idx], this.options.outlierRadius, 0, Math.PI * 2);
        }
      });
    }
    ctx.fill();
    ctx.closePath();
  }

  _getBounds() {
    // abstract
    return {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };
  }
  _getHitBounds() {
    const padding = this._view.hitPadding;
    const b = this._getBounds();
    return {
      left: b.left - padding,
      top: b.top - padding,
      right: b.right + padding,
      bottom: b.bottom + padding
    };
  }
  height() {
    return 0; // abstract
  }
  inRange(mouseX, mouseY) {
    if (!this._view) {
      return false;
    }
    const bounds = this._getHitBounds();
    return mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
  }
  inLabelRange(mouseX, mouseY) {
    if (!this._view) {
      return false;
    }
    const bounds = this._getHitBounds();
    if (this.isVertical()) {
      return mouseX >= bounds.left && mouseX <= bounds.right;
    }
    return mouseY >= bounds.top && mouseY <= bounds.bottom;
  }
  inXRange(mouseX) {
    const bounds = this._getHitBounds();
    return mouseX >= bounds.left && mouseX <= bounds.right;
  }
  inYRange(mouseY) {
    const bounds = this._getHitBounds();
    return mouseY >= bounds.top && mouseY <= bounds.bottom;
  }
  getCenterPoint() {
    const {x, y} = this._view;
    return {x, y};
  }
  getArea() {
    return 0; // abstract
  }
  tooltipPosition_() {
    return this.getCenterPoint();
  }
}

ArrayElementBase.defaults = Object.assign({}, Chart.defaults.elements.bar, defaults);
