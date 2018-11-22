'use strict';

import * as Chart from 'chart.js';
import {rnd} from '../data';

export const defaults = Object.assign({}, Chart.defaults.global.elements.rectangle, {
  borderWidth: 1,
  itemRadius: 2,
  itemStyle: 'circle',
  hitPadding: 2
});

const ArrayElementBase = Chart.Element.extend({
  isVertical() {
    return this._view.width !== undefined;
  },
  draw() {
    // abstract
  },
  _drawItems(vm, container, ctx, vert) {
    if (vm.itemRadius <= 0 || !container.items || container.items.length <= 0) {
      return;
    }

    ctx.save();
    ctx.strokeStle = vm.borderColor;
    ctx.fillStyle = vm.backgroundColor;
    // jitter based on random data
    // use the median to initialize the random number generator
    const random = rnd(container.median);

    // Save item radius and each position
    container.itemRadius = vm.itemRadius;
    container.itemsPos = [];

    if (vert) {
      for (let i = 0; i < container.items.length; i++) {
        container.itemsPos[i] = vm.x - vm.width / 2 + random() * vm.width;
        Chart.canvasHelpers.drawPoint(ctx, vm.itemStyle, vm.itemRadius, container.itemsPos[i], container.items[i]);
      }
    } else {
      for (let i = 0; i < container.items.length; i++) {
        container.itemsPos[i] = vm.y - vm.height / 2 + random() * vm.height;
        Chart.canvasHelpers.drawPoint(ctx, vm.itemStyle, vm.itemRadius, container.items[i], container.itemsPos[i]);
      }
    }
    ctx.restore();
  },

  _getBounds() {
    // abstract
    return {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };
  },
  _getHitBounds() {
    const padding = this._view.hitPadding;
    const b = this._getBounds();
    return {
      left: b.left - padding,
      top: b.top - padding,
      right: b.right + padding,
      bottom: b.bottom + padding
    };
  },
  height() {
    return 0; // abstract
  },
  inRange(mouseX, mouseY) {
    if (!this._view) {
      return false;
    }
    const bounds = this._getHitBounds();
    return mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
  },
  inLabelRange(mouseX, mouseY) {
    if (!this._view) {
      return false;
    }
    const bounds = this._getHitBounds();
    if (this.isVertical()) {
      return mouseX >= bounds.left && mouseX <= bounds.right;
    }
    return mouseY >= bounds.top && mouseY <= bounds.bottom;
  },
  inXRange(mouseX) {
    const bounds = this._getHitBounds();
    return mouseX >= bounds.left && mouseX <= bounds.right;
  },
  inYRange(mouseY) {
    const bounds = this._getHitBounds();
    return mouseY >= bounds.top && mouseY <= bounds.bottom;
  },
  getCenterPoint() {
    const {x, y} = this._view;
    return {x, y};
  },
  getArea() {
    return 0; // abstract
  },
  tooltipPosition_() {
    return this.getCenterPoint();
  }
});

export default ArrayElementBase;
