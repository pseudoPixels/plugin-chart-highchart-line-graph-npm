/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import isTruthy from '../utils/isTruthy';
import { tokenizeToNumericArray, tokenizeToStringArray } from '../utils/tokenize';
import { formatLabel } from './utils';

const NOOP = () => {};

const grabD3Format = (datasource, targetMetric) => {
  let foundFormatter;
  const { metrics = [] } = datasource || {};
  metrics.forEach(metric => {
    if (metric.d3format && metric.metric_name === targetMetric) {
      foundFormatter = metric.d3format;
    }
  });

  return foundFormatter;
};

export default function transformProps(chartProps) {
  const { width, height, annotationData, datasource, formData, hooks, queriesData } = chartProps;

  const { onAddFilter = NOOP, onError = NOOP } = hooks;

  const {
    annotationLayers,
    barStacked,
    bottomMargin,
    colorPicker,
    colorScheme,
    comparisonType,
    contribution,
    donut,
    entity,
    labelsOutside,
    leftMargin,
    lineInterpolation,
    maxBubbleSize,
    metric,
    metric2,
    metrics = [],
    orderBars,
    pieLabelType,
    reduceXTicks,
    richTooltip,
    sendTimeRange,
    showBarValue,
    showBrush,
    showControls,
    showLabels,
    showLegend,
    showMarkers,
    size,
    stackedStyle,
    vizType,
    x,
    xAxisFormat,
    xAxisLabel,
    xAxisShowminmax,
    xLogScale,
    xTicksLayout,
    y,
    yAxisBounds,
    yAxis2Bounds,
    yAxisLabel,
    yAxisShowminmax,
    yAxis2Showminmax,
    yLogScale,
  } = formData;

  let {
    markerLabels,
    markerLines,
    markerLineLabels,
    markers,
    numberFormat,
    rangeLabels,
    ranges,
    yAxisFormat,
    yAxis2Format,
  } = formData;

  const rawData = queriesData[0].data || [];
  const data = Array.isArray(rawData)
    ? rawData.map(row => ({
        ...row,
        key: formatLabel(row.key, datasource.verboseMap),
      }))
    : rawData;

  function sortFunction(a, b) {
    if (a[0] === b[0]) {
      return 0;
    } else {
      return a[0] < b[0] ? -1 : 1;
    }
  }

  var keys = Object.keys(data[0]);
  const index = keys.indexOf('__timestamp');
  if (index > -1) {
    keys.splice(index, 1);
  }
  const index2 = keys.indexOf('key');
  if (index2 > -1) {
    keys.splice(index2, 1);
  }

  //console.log('NEW KEYS ', keys);
  var hc_metric = keys.pop();

  //console.log('hc_METRIC', hc_metric);

  var highchartData = {};

  // console.log(data);
  // highchartData['calc_type'] = [];

  //console.log("Keys After trimmed ", keys);
  var comb = '';
  keys.forEach(function (aKey) {
    comb = comb + aKey;
  });

  //console.log('Comb', comb);


  data.forEach(function (aDataPoint) {
    //var k = aDataPoint[keys[0]];
    var k = '';
    keys.forEach(function (aKey) {
      k = k + " " + aDataPoint[aKey] + " &";
    });
    k = k.substring(0, k.length - 1);

    highchartData[k] = highchartData[k] || [];
    highchartData[k].push([aDataPoint.__timestamp, aDataPoint[hc_metric]]);

    //console.log('a Data Point = ', aDataPoint[k], aDataPoint[hc_metric]);
  });



  var seriesData = [];

  //console.log(Object.keys(hd[0]));
  //console.log(highchartData);

  for (var aSeries in highchartData) {
    // console.log("Here ", aSeries);
    seriesData.push({
      name: aSeries,
      data: highchartData[aSeries].sort(sortFunction),
    });
  }

  //data = seriesData;


  return {
    width,
    height,
    data,
    seriesData,
    annotationData,
    annotationLayers,
    areaStackedStyle: stackedStyle,
    baseColor: colorPicker,
    bottomMargin,
    colorScheme,
    comparisonType,
    contribution,
    entity,
    isBarStacked: barStacked,
    isDonut: donut,
    isPieLabelOutside: labelsOutside,
    leftMargin,
    lineInterpolation,
    markerLabels,
    markerLines,
    markerLineLabels,
    markers,
    maxBubbleSize: parseInt(maxBubbleSize, 10),
    numberFormat,
    onBrushEnd: isTruthy(sendTimeRange)
      ? timeRange => {
          onAddFilter('__time_range', timeRange, false, true);
        }
      : undefined,
    onError,
    orderBars,
    pieLabelType,
    rangeLabels,
    ranges,
    reduceXTicks,
    showBarValue,
    showBrush,
    showControls,
    showLabels,
    showLegend,
    showMarkers,
    sizeField: size,
    useRichTooltip: richTooltip,
    vizType,
    xAxisFormat,
    xAxisLabel,
    xAxisShowMinMax: xAxisShowminmax,
    xField: x,
    xIsLogScale: xLogScale,
    xTicksLayout,
    yAxisFormat,
    yAxis2Format,
    yAxisBounds,
    yAxis2Bounds,
    yAxisLabel,
    yAxisShowMinMax: yAxisShowminmax,
    yAxis2ShowMinMax: yAxis2Showminmax,
    yField: y,
    yIsLogScale: yLogScale,
  };
}
