'use strict';

import {plotStats} from '../data';
import * as Chart from 'chart.js';
import base, {verticalDefaults} from './base';

const defaults = {
  tooltips: {
    callbacks: {
      label(item, data) {
        const datasetLabel = data.datasets[item.datasetIndex].label || '';
        const value = data.datasets[item.datasetIndex].data[item.index];
        let label = `${datasetLabel} ${typeof item.xLabel === 'string' ? item.xLabel : item.yLabel}`;
        return `${label} ${value}`;
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
      if (key !== 'outliers') {
        r[key] = scale.getPixelForValue(Number(v[key]));
      }
    });
    this._calculateCommonModel(r, data, v, scale);
    return r;
  }
});
/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
export const Plots = Chart.controllers.plots = Chart.controllers.bar.extend(plots);
