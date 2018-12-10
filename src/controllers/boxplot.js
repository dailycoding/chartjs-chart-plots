'use strict';

import {asBoxPlotStats} from '../data';
import * as Chart from 'chart.js';
import base, {verticalDefaults} from './base';

const defaults = {
  tooltips: {
    mode: 'atPoint',
    position: 'atCurPos',
    callbacks: {
      label(item, data) {
        if (!this._chart.tooltip._active.length) {
          return;
        }

        var plots = this._chart.tooltip._active[0]._view.boxplot;
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

Chart.defaults.boxplot = Chart.helpers.merge({}, [Chart.defaults.bar, verticalDefaults, defaults]);

const boxplot = Object.assign({}, base, {

  dataElementType: Chart.elements.BoxAndWhiskers,

  _elementOptions() {
    return this.chart.options.elements.boxandwhiskers;
  },
  /**
   * @private
   */
  updateElementGeometry(elem, index, reset) {
    Chart.controllers.bar.prototype.updateElementGeometry.call(this, elem, index, reset);
    elem._model.boxplot = this._calculateBoxPlotValuesPixels(this.index, index);
  },

  /**
   * @private
   */

  _calculateBoxPlotValuesPixels(datasetIndex, index) {
    const scale = this.getValueScale();
    const data = this.chart.data.datasets[datasetIndex].data[index];
    if (!data) {
      return null;
    }
    const v = asBoxPlotStats(data);

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
export const BoxPlot = Chart.controllers.boxplot = Chart.controllers.bar.extend(boxplot);
