'use strict';

import {plotStats} from '../data';
import * as Chart from 'chart.js';
import ArrayControllerBase, {verticalDefaults} from './base';

function getRelativePosition(e, chart) {
  if (e.native) {
    return {
      x: e.x,
      y: e.y
    };
  }

  return Chart.helpers.getRelativePosition(e, chart);
}

function parseVisibleItems(chart, handler) {
  var datasets = chart.data.datasets;
  var meta, i, j, ilen, jlen;

  for (i = 0, ilen = datasets.length; i < ilen; ++i) {
    if (!chart.isDatasetVisible(i)) {
      continue;
    }

    meta = chart.getDatasetMeta(i);
    for (j = 0, jlen = meta.data.length; j < jlen; ++j) {
      var element = meta.data[j];
      if (!element.skip) {
        handler(element);
      }
    }
  }
}

function getIntersectItemIndex(element, position) {
  var plots = 'boxplot' in element ? element.boxplot : element.plots;
  plots.currentItem = undefined;

  if (!plots.itemsPos) {
    return;
  }

  for (let i = 0; i < plots.items.length; i++) {
    let x, y;
    if (!element.horizontal) {
      x = plots.itemsPos[i];
      y = plots.items[i];
    } else {
      x = plots.items[i];
      y = plots.itemsPos[i];
    }
    if (position.x - element.options.itemRadius <= x && x <= position.x + element.options.itemRadius &&
        position.y - element.options.itemRadius <= y && y <= position.y + element.options.itemRadius) {
      plots.currentItem = i;
      return i;
    }
  }
}

function getIntersectItems(chart, position) {
  var elements = [];

  parseVisibleItems(chart, function(element) {
    if (element.inRange(position.x, position.y)) {
      if (getIntersectItemIndex(element, position) !== undefined) {
        elements.push(element.$context);
      }
    }
  });

  return elements;
}

Chart.Interaction.modes.atPoint = function(chart, e) {
  var position = getRelativePosition(e, chart);
  return getIntersectItems(chart, position);
};

Chart.Tooltip.positioners.atCurPos = function(elements, position) {
  if (!elements.length) {
    return false;
  }
  // if (!elements[0]._chart.tooltip._active.length) {
  //   return false;
  // }

  return position;
};

const defaults = {
  dataElementType: 'plots',
};

const tooltipOverrides = {
  interaction: {
    mode: 'point'
  },
  plugins: {
    tooltip: {
      mode: 'atPoint',
      position: 'atCurPos',
      callbacks: {
        label(item, data) {
          if (!this._chart.tooltip._active.length) {
            return;
          }

          let plots = this._chart.tooltip._active[0].element.plots;
          let currentItem = plots.currentItem;
          if (currentItem === undefined) {
            return '';
          }

          if (!data) {
            data = this._chart.data;
          }
          const datasetLabel = data.datasets[item.datasetIndex].label || '';
          const value = data.datasets[item.datasetIndex].data[item.dataIndex];
          let label = `${datasetLabel}`;
          if (Array.isArray(data.datasets[item.datasetIndex].dataLabels) && data.datasets[item.datasetIndex].dataLabels.length > item.dataIndex) {
            label += ` ${data.datasets[item.datasetIndex].dataLabels[plots.currentItem]}`;
          }

          return `${label} ${value[currentItem]}`;
        }
      }
    }
  }
};

export default class PlotsController extends ArrayControllerBase {
  _elementOptions() {
    return this.chart.options.elements.plots;
  }

  /**
   * @private
   */
  updateElement(element, index, properties, mode) {
    Chart.BarController.prototype.updateElement.call(this, element, index, properties, mode);
    element.plots = this._calculatePlotValuesPixels(this.index, index);
  }

  /**
   * @private
   */
  _calculatePlotValuesPixels(datasetIndex, index) {
    const scale = this.getValueScale();
    const data = this.chart.data.datasets[datasetIndex].data[index];
    if (!data) {
      return null;
    }
    const v = plotStats(data);

    const r = {};
    Object.keys(v).forEach((key) => {
      r[key] = scale.getPixelForValue(Number(v[key]));
    });
    this._calculateCommonModel(r, data, v, scale);
    return r;
  }
}

PlotsController.id = 'plots';

/**
 * @type {any}
 */
PlotsController.defaults = Chart.helpers.merge({}, [Chart.BarController.defaults, defaults]);

/**
 * @type {any}
 */
PlotsController.overrides = Chart.helpers.merge({}, [Chart.BarController.overrides, verticalDefaults, tooltipOverrides]);
