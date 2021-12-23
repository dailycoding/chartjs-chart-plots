'use strict';

import {Chart} from 'chart.js';
import {default as Plots} from './elements/plots';
import {default as BoxAndWhiskers} from './elements/boxandwhiskers';
import {default as PlotsController} from './controllers/plots';
import {default as BoxPlotController} from './controllers/boxplot';
import {default as ArrayLinearScale} from './scale/arrayLinear';
import {default as ArrayLogarithmicScale} from './scale/arrayLogarithmic';

// Register built-ins
Chart.register(Plots, BoxAndWhiskers, PlotsController, BoxPlotController, ArrayLinearScale, ArrayLogarithmicScale);

export {Plots, BoxAndWhiskers, PlotsController, BoxPlotController, ArrayLinearScale, ArrayLogarithmicScale};
