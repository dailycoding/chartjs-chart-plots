'use strict';

import * as Chart from 'chart.js';
import {getRightValue, commonDataLimits, commonScaleOptions} from '../data';

export default class ArrayLogarithmicScale extends Chart.Scale {
  getRightValue(rawValue) {
    return Chart.Scale.LinearScaleBase.prototype.getRightValue.call(this, getRightValue(rawValue));
  }

  determineDataLimits() {
    // Add whitespace around bars. Axis shouldn't go exactly from min to max
    const tickOpts = this.options.ticks;
    this.minNotZero = null;
    commonDataLimits.call(this, (boxPlot) => {
      const value = boxPlot[tickOpts.minStats];
      if (value !== 0 && (this.minNotZero === null || value < this.minNotZero)) {
        this.minNotZero = value;
      }
    });

    this.min = Chart.helpers.valueOrDefault(tickOpts.min, this.min - this.min * 0.05);
    this.max = Chart.helpers.valueOrDefault(tickOpts.max, this.max + this.max * 0.05);

    if (this.min === this.max) {
      if (this.min !== 0 && this.min !== null) {
        this.min = Math.pow(10, Math.floor(Chart.helpers.log10(this.min)) - 1);
        this.max = Math.pow(10, Math.floor(Chart.helpers.log10(this.max)) + 1);
      } else {
        this.min = 1;
        this.max = 10;
      }
    }
  }
}

ArrayLogarithmicScale.id = 'arrayLogarithmic';

/**
 * @type {any}
 */
ArrayLogarithmicScale.defaults = Chart.helpers.merge({}, [commonScaleOptions, Chart.LogarithmicScale.defaults]);
