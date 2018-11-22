'use strict';

import {plotStats} from '../data';
import * as Chart from 'chart.js';
import base, {verticalDefaults} from './base';

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
      if (!element._view.skip) {
        handler(element);
      }
    }
  }
}

function getIntersectItemIndex(element, position) {
  var _view = element._view;
  var plots = _view.plots;
  plots.currentItem = undefined;

  for (let i = 0; i < plots.items.length; i++) {
    let x, y;
    if (!_view.horizontal) {
      x = plots.itemsPos[i];
      y = plots.items[i];
    } else {
      x = plots.items[i];
      y = plots.itemsPos[i];
    }
    if (position.x - _view.itemRadius <= x && x <= position.x + _view.itemRadius &&
        position.y - _view.itemRadius <= y && y <= position.y + _view.itemRadius) {
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
        elements.push(element);
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
  if (!elements[0]._chart.tooltip._active.length) {
    return false;
  }

  return position;
};

const defaults = {
  tooltips: {
    mode: 'atPoint',
    position: 'atCurPos',
    callbacks: {
      label(item, data) {
        if (!this._chart.tooltip._active.length) {
          return;
        }

        var plots = this._chart.tooltip._active[0]._view.plots;
        var currentItem = plots.currentItem;
        if (currentItem === undefined) {
          return '';
        }

        const datasetLabel = data.datasets[item.datasetIndex].label || '';
        const value = data.datasets[item.datasetIndex].data[item.index];
        let label = `${datasetLabel}`;
        if (Array.isArray(data.datasets[item.datasetIndex].dataLabels) && data.datasets[item.datasetIndex].dataLabels.length > item.index) {
          label += ` ${data.datasets[item.datasetIndex].dataLabels[plots.currentItem]}`;
        }

        return `${label} ${value[currentItem]}`;
      }
    }
  }
};

Chart.defaults.plots = Chart.helpers.merge({}, [Chart.defaults.bar, verticalDefaults, defaults]);

const plots = Object.assign({}, base, {

  dataElementType: Chart.elements.Plots,

  _elementOptions() {
    return this.chart.options.elements.plots;
  },

  /**
   * @private
   */
  updateElementGeometry(elem, index, reset) {
    Chart.controllers.bar.prototype.updateElementGeometry.call(this, elem, index, reset);
    elem._model.plots = this._calculatePlotValuesPixels(this.index, index);
  },

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
});
/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
export const Plots = Chart.controllers.plots = Chart.controllers.bar.extend(plots);
