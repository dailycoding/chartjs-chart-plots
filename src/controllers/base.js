'use strict';

import * as Chart from 'chart.js';

export const verticalDefaults = {
  scales: {
    y: {
      type: 'arrayLinear'
    }
  }
};

export default class ArrayControllerBase extends Chart.BarController {
  _elementOptions() {
    return {};
  }
  updateElement(element, index, properties, mode) {
    const dataset = this.getDataset();
    const custom = element.custom || {};
    const options = this._elementOptions();

    Chart.controllers.bar.prototype.updateElement.call(this, element, index, properties, mode);
    ['borderWidth', 'outlierRadius', 'outlierColor', 'itemRadius', 'itemStyle', 'hitPadding'].forEach((item) => {
      properties[item] = custom[item] !== undefined ? custom[item] : Chart.helpers.valueAtIndexOrDefault(dataset[item], index, options[item]);
    });
  }
  _calculateCommonModel(r, data, container, scale) {
    if (container.outliers) {
      r.outliers = container.outliers.map((d) => scale.getPixelForValue(Number(d)));
    }

    if (!Array.isArray(data)) {
      data = [data];
    }
    r.items = data.map((d) => scale.getPixelForValue(Number(d)));
  }
  getValueScale() {
    const {_cachedMeta: {vScale}} = this;
    return vScale;
  }
}
