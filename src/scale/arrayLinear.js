'use strict';

import * as Chart from 'chart.js';
import {getRightValue, commonDataLimits, commonScaleOptions} from '../data';

export default class ArrayLinearScale extends Chart.LinearScale {
  getRightValue(rawValue) {
    return Chart.LinearScaleBase.prototype.getRightValue.call(this, getRightValue(rawValue));
  }
  determineDataLimits() {
    commonDataLimits.call(this);
    // Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
    this.handleTickRangeOptions();
  }
}

ArrayLinearScale.id = 'arrayLinear';

ArrayLinearScale.defaults = Chart.helpers.merge({}, [commonScaleOptions, Chart.LinearScale.defaults]);
