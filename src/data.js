'use strict';

export function plotStats(arr) {
  // console.assert(Array.isArray(arr));
  if (arr.length === 0) {
    return {
      min: NaN,
      max: NaN,
      mean: NaN,
    };
  }

  const base = {
    min: arr[0],
    max: arr[0],
  };
  for (var i = 1; i < arr.length; i++) {
    if (base.min > arr[i]) {
      base.min = arr[i];
    } else if (base.max < arr[i]) {
      base.max = arr[i];
    }
  }
  base.median = (base.max + base.min) / 2;

  return base;
}

export function asValueStats(value, minStats, maxStats) {
  if (typeof value[minStats] === 'number' && typeof value[maxStats] === 'number') {
    return value;
  }
  if (!Array.isArray(value)) {
    value = [value];
  }
  if (value.__stats === undefined) {
    value.__stats = plotStats(value);
  }
  return value.__stats;
}

export function getRightValue(rawValue) {
  if (!rawValue) {
    return rawValue;
  }
  if (typeof rawValue === 'number' || typeof rawValue === 'string') {
    return Number(rawValue);
  }
  const b = plotStats(rawValue);
  return b ? b.median : rawValue;
}

export const commonScaleOptions = {
  ticks: {
    minStats: 'min',
    maxStats: 'max'
  }
};

export function commonDataLimits(extraCallback) {
  const chart = this.chart;
  const isHorizontal = this.isHorizontal();
  const tickOpts = this.options.ticks;
  const minStats = tickOpts.minStats;
  const maxStats = tickOpts.maxStats;

  const matchID = (meta) => isHorizontal ? meta.xAxisID === this.id : meta.yAxisID === this.id;

  // First Calculate the range
  this.min = null;
  this.max = null;

  // Regular charts use x, y values
  // For the boxplot chart we have rawValue.min and rawValue.max for each point
  chart.data.datasets.forEach((d, i) => {
    const meta = chart.getDatasetMeta(i);
    if (!chart.isDatasetVisible(i) || !matchID(meta)) {
      return;
    }
    d.data.forEach((value, j) => {
      if (!value || meta.data[j].hidden) {
        return;
      }
      const stats = asValueStats(value, minStats, maxStats);
      if (!stats) {
        return;
      }

      if (this.min === null || stats[minStats] < this.min) {
        this.min = stats[minStats];
      }

      if (this.max === null || stats[maxStats] > this.max) {
        this.max = stats[maxStats];
      }

      if (extraCallback) {
        extraCallback(stats);
      }
    });
  });
}

export function rnd(seed) {
  // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
  if (seed === undefined) {
    seed = Date.now();
  }
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}
