// S2 L1C TOA. L2 should be ingested soon, update script when it is
// L8 Surface reflectance product. Typically will have higher values than S2 until atmos correction.
// consider using the ee.ImageCollection.formaTrend function??
 
var initialPoint = ee.Geometry.Point(-86.80, 14.85);
var honduras = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017").filter(ee.Filter.eq('country_co', 'HO'));
print (Date.now())

var createTimeBand = function(image) {
  return image.addBands(image.metadata('system:time_start')
            .divide(1000 * 60 * 60 * 24)); 
};

function maskS2clouds(image) {
  var qa = image.select('QA60');
  var cloudBitMask = ee.Number(2).pow(10).int();  // clouds
  var cirrusBitMask = ee.Number(2).pow(11).int(); // cirrus
  var date = image.get('system:time_start')
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
             qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask).divide(10000).set('system:time_start', date);
}

function maskL8clouds(image) {
  var cloudShadowBitMask = 1 << 3; // cloud shadow
  var cloudsBitMask = 1 << 5; // cloud
  var qa = image.select('pixel_qa');
  var date = image.get('system:time_start')
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
      .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
  return image.updateMask(mask).divide(10000).set('system:time_start', date);
}


var s2NDVIndwi = function (image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']); //nir - red
  var ndwi = image.normalizedDifference(['B8', 'B11']); //nir - swir
  image = image.addBands([ndvi.rename('NDVI'), ndwi.rename('NDWI')]).float();
  return image.set('sensor', 'S2');
  };

var l8NDVIndwi = function (image) {
  var ndvi = image.normalizedDifference(['B5', 'B4']);
  var ndwi = image.normalizedDifference(['B5', 'B6']); //nir - swir
  image = image.addBands([ndvi.rename('NDVI'), ndwi.rename('NDWI')]).float();
  return image.set('sensor', 'L8');
  };

var threshold = function (image) {
  var ndvi = image.select(['NDVI']);
  var mask = ndvi.gt(0.4);
  return image.updateMask(mask);
  };

var mergedCollection = function (endDate) {
  var startDate = endDate.advance(-3, 'month')

  var L8collection =  ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')  
                     .filterDate(startDate, endDate)
                     .filterBounds(honduras)
                     .filter(ee.Filter.lt('CLOUD_COVER', 20))
                     .map(createTimeBand)
                     .map(maskL8clouds)
                    .map(l8NDVIndwi)
                    .map(threshold)
                    .select(['NDVI', 'NDWI', 'system:time_start', 'B4', 'B3', 'B2']);
  var S2collection = ee.ImageCollection('COPERNICUS/S2')
                     .filterDate(startDate, endDate)
                     .filterBounds(honduras)
                     .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                    .map(createTimeBand)
                    .map(maskS2clouds)
                    .map(s2NDVIndwi)                  
                    .map(threshold)
                    .select(['NDVI', 'NDWI', 'system:time_start', 'B4', 'B3', 'B2']);

  var mergedCollection = S2collection.merge(L8collection);
  return mergedCollection};

var linearFitMask = function (image, threshold5) {
  var scale = image.select(['scale']);
  var mask = scale.lt(threshold5);
  return image.updateMask(mask);
  };

var mapPanel = ui.Map();
var layers = mapPanel.layers();
var inspectorPanel = ui.Panel({style: {width: '30%'}});

var vis = {min: [-100], max: [100], bands: ['scale'], palette:['red', 'black', 'green']}

var collection = function () {
  var endDate = ee.Date(date_field.getValue())
  return mergedCollection(endDate) 
}

var compositeLayer = function() {
  var index = constraint.getValue()
  var reduced = collection().select(['system:time_start', index]).reduce(ee.Reducer.linearFit());
  var threshold1 = ee.Number.parse(threshold_field.getValue())
  var linearFit = linearFitMask(reduced, threshold1)
  var composite = linearFit.visualize(vis);
  var layer = ui.Map.Layer(composite).setName('Linear Fit')
  return layer;
}

var dateLabel = ui.Label ('Enter todays date: ')
var date_field = ui.Textbox({placeholder: 'YYYY-mm-dd',
                  value: '2019-02-27',
                  onChange: function(text) {
                  var jsDate = new Date(text);
                  layers.set(0, compositeLayer())
                  generateChart({
                        lon: initialPoint.coordinates().get(0).getInfo(),
                        lat: initialPoint.coordinates().get(1).getInfo()
                  });
                  return jsDate
                  }})
                  
var thresholdLabel = ui.Label('Enter a threshold value between -100 to 100 to filter the NDVI results')
var threshold_field = ui.Textbox({placeholder: 'XXX',
                  value: '-10',
                  onChange: function(text) {
                  var threshold = text;
                  layers.set(0, compositeLayer())
                  return threshold
                  }})

var rgb_field = ui.Label()


var NDWI = 'NDWI'
var NDVI = 'NDVI'
var constrain_label = ui.Label('Choose vegetation index: ')
var constraint = ui.Select({
  items: [NDVI, NDWI],
  value: NDVI,
  placeholder: '[Choose a Variable...]',
  onChange: function(text) {
              var index = text;
              layers.set(0, compositeLayer())
              generateChart({
                        lon: initialPoint.coordinates().get(0).getInfo(),
                        lat: initialPoint.coordinates().get(1).getInfo()
                  });
              return index
              }})

var intro = ui.Panel([
  ui.Label({
    value: 'Landsat & Sentinel NDVI/NDWI - Time Series Inspector',
    style: {fontSize: '20px', fontWeight: 'bold'}
  }),
  ui.Panel([constrain_label, constraint], ui.Panel.Layout.flow('horizontal')),
  thresholdLabel,
  threshold_field,
  ui.Panel([dateLabel, date_field], ui.Panel.Layout.flow('horizontal')),
  ui.Label('Click a location on the map to see its time series of NDVI.'),
  ui.Label('Click a point on the chart to show the image for that date.'),
  rgb_field
]);
inspectorPanel.add(intro);

var lon = ui.Label();
var lat = ui.Label();
inspectorPanel.add(ui.Panel([lon, lat], ui.Panel.Layout.flow('horizontal')));
inspectorPanel.add(ui.Label('[Chart]'));
inspectorPanel.add(ui.Label('[Legend]'));

inspectorPanel.add(ui.Button({
  label: 'Export current view',
  onClick: function() {
    var date = ee.Date(Date.now()).format('YYYY-MM-dd');
    var index = constraint.getValue()
    var threshold1 = ee.Number.parse(threshold_field.getValue())
    var threshold2 = threshold_field.getValue()
    var a = '_';
    var reduced = collection().select(['system:time_start', index]).reduce(ee.Reducer.linearFit());
    var linearFit = linearFitMask(reduced, threshold1)
    // dot.buffer()
    // increase max pixels for 10m export
    Export.image.toDrive({
          image: linearFit.select('scale').clip(honduras),
          description: index +a+ threshold2 +a+ date.getInfo() +a+ 'LinearFit',
          region: honduras.geometry().bounds(),
          maxPixels: 1e9
        });
  }}));

var generateChart = function (coords) {
  lon.setValue('lon: ' + coords.lon.toFixed(2));
  lat.setValue('lat: ' + coords.lat.toFixed(2));

  var point = ee.Geometry.Point(coords.lon, coords.lat);
  var dot = ui.Map.Layer(point, {color: '#FF00FF'}, 'clicked location');
  var index = constraint.getValue()

  layers.set(0, compositeLayer())
  layers.set(1)
  layers.set(2, dot);
  
  var chart = ui.Chart.image.series(collection().select(index), point, ee.Reducer.mean(), 500);
  chart.setOptions({
    title: index + ': time series',
    vAxis: {title: index},
    hAxis: {title: 'Date', format: 'MMM-dd', gridlines: {count: 7}},
    series: {
      0: {
        color: 'blue',
        lineWidth: 0,
        pointsVisible: true,
        pointSize: 2,
      },
    },
    legend: {position: 'right'},
  });
  
  
  chart.onClick(function(xValue, yValue, seriesName) {
    if (!xValue) return;
    var equalDate = ee.Filter.equals('system:time_start', xValue);
    var image = collection().filterBounds(point)
                          .filter(equalDate)
                          .first();
    var RGBlayer = ui.Map.Layer(image, {
      gamma: 1.3,
      min: 0,
      max: 0.3,
      bands: ['B4', 'B3', 'B2']
    }, 'RGB layer');
    layers.set(1, RGBlayer);
    rgb_field.setValue(["RGB image: " + new Date(xValue).toUTCString()])
  });
   
     inspectorPanel.widgets().set(2, chart);
};

function makeColorBarParams(palette) {
  return {
    bbox: [0, 0, 1, 0.1],
    dimensions: '100x10',
    format: 'png',
    min: 0,
    max: 1,
    palette: palette,
  };
}

var colorBar = ui.Thumbnail({
  image: ee.Image.pixelLonLat().select(0),
  params: makeColorBarParams(vis.palette),
  style: {stretch: 'horizontal', margin: '0px 8px', maxHeight: '24px'},
});

var legendLabels = ui.Panel({
  widgets: [
    ui.Label(vis.min, {margin: '4px 8px'}),
    ui.Label(
        (vis.max -  ((vis.max - vis.min) / 2)),
        {margin: '4px 8px', textAlign: 'center', stretch: 'horizontal'}),
    ui.Label(vis.max, {margin: '4px 8px'})
  ],
  layout: ui.Panel.Layout.flow('horizontal')
});

var legendTitle = ui.Label({
  value: 'Map Legend: NDVI coefficient',
  style: {fontWeight: 'bold'}
});

var legendPanel = ui.Panel([legendTitle, colorBar, legendLabels]);
inspectorPanel.widgets().set(3, legendPanel);

mapPanel.onClick(generateChart);
mapPanel.style().set('cursor', 'crosshair');
mapPanel.centerObject(initialPoint, 10);

ui.root.clear();
ui.root.add(ui.SplitPanel(inspectorPanel, mapPanel));

generateChart({
  lon: initialPoint.coordinates().get(0).getInfo(),
  lat: initialPoint.coordinates().get(1).getInfo()
});
