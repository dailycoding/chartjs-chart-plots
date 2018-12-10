'use strict';

import * as Chart from 'chart.js';

export const verticalDefaults = {
  scales: {
    yAxes: [{
      type: 'arrayLinear'
    }]
  }
};

const array = {
  _elementOptions() {
    return {};
  },
  updateElement(elem, index, reset) {
    const dataset = this.getDataset();
    const custom = elem.custom || {};
    const options = this._elementOptions();

    Chart.controllers.bar.prototype.updateElement.call(this, elem, index, reset);
    ['borderWidth', 'outlierRadius', 'outlierColor', 'itemRadius', 'itemStyle', 'hitPadding'].forEach((item) => {
      elem._model[item] = custom[item] !== undefined ? custom[item] : Chart.helpers.valueAtIndexOrDefault(dataset[item], index, options[item]);
    });
  },
  _calculateCommonModel(r, data, container, scale) {
    if (container.outliers) {
      r.outliers = container.outliers.map((d) => scale.getPixelForValue(Number(d)));
    }

    if (!Array.isArray(data)) {
      data = [data];
    }
    r.items = data.map((d) => scale.getPixelForValue(Number(d)));
  }
};

export default array;
