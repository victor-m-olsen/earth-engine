/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #98ff00 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[44.388087436278326, 15.530787147215863],
          [44.388087436278326, 14.122278702764167],
          [45.887721225340826, 14.122278702764167],
          [45.887721225340826, 15.530787147215863]]], null, false),
    imageVisParam = {"opacity":1,"bands":["water"],"max":2,"palette":["ffffff","0a2aff"]},
    imageVisParam2 = {"opacity":1,"bands":["water"],"max":2,"palette":["ffffff","0a2aff"]},
    imageVisParam3 = {"opacity":1,"bands":["water"],"palette":["284dff"]},
    imageVisParam4 = {"opacity":1,"bands":["water"],"min":1,"max":3,"palette":["ffffff","0a2aff"]},
    table = ee.FeatureCollection("users/reachyemengis/Admin0"),
    geometry2 = /* color: #d63000 */ee.Geometry.MultiPoint(),
    aoi = ee.FeatureCollection("users/reachyemengis/water/nation_wide_aoi_v2");
/***** End of imports. If edited, may not auto-convert in the playground. *****/



var yem = aoi  

 
 
// table.first().geometry().buffer({
//   distance: -100,
//   maxError: 99
//   })

Map.addLayer(yem)
print(yem)


//Function for applying negative buffer around surface water
var buffer = function (image) {
  var mask = image.mask().reduce(ee.Reducer.min())
  var negative_buffer = mask
    .focal_min({radius: 30, units: 'meters'})
  return image.updateMask(negative_buffer)
}


//Function for for adding buffer to image as new class
var reclasser = function(image) {
  var JRC_water = image.mask(image.eq(2))
  var JRC_buffer = buffer(JRC_water)
  return image.where(JRC_buffer.eq(2), 3)}

// Original
var JRC = ee.ImageCollection('JRC/GSW1_2/MonthlyHistory').filterMetadata('year', 'equals', 2019)//.first()

// Reclassing base buffer
var JRC = JRC.map(function(image) {
  var JRC_water = image.mask(image.eq(2))
  var JRC_buffer = buffer(JRC_water)
  return image.where(JRC_buffer.eq(2), 3)})

var aoi =  yem//geometry

var visualization = {
  bands: ['water'],
  min: 0.0,
  max: 2.0,
  palette: ['ffffff', 'fffcb8', '0905ff']
};

// Stratified random sampling in water and land
var sampler = function(image) {
  var water_sample = image.stratifiedSample({
    numPoints:1, 
    classBand:'water', 
    region: aoi, 
    scale: 10, 
    projection: 'EPSG:4326', 
    classValues: [1,3],  //Land = 1, Water clost to land = 2, water far from land = 3
    classPoints: [800,200],  
    dropNulls: true, 
    geometries: true
  })
  .map(function(feature) {
  return feature.set('month', image.get('month'))})
  return water_sample}

//Apply sampler function to image and saves it to list
var sample_combiner = function(image, list) { 
  var sample = sampler(image)
  //Add sample (one month) to list
  return ee.FeatureCollection(list).merge(sample) //.toList(sample.size())) //ee.List(list).add(added);
};

// Iterates over image collection, applies sample function and saves output to featureCollection
var JRC_sample = JRC.iterate(sample_combiner, ee.FeatureCollection([]))



Export.table.toAsset(ee.FeatureCollection(JRC_sample), '2019_1000_yem', 'users/reachyemengis/point_samples/2019_1000_yem')
//Export.table.toAsset(ee.FeatureCollection(geometry), 'JRC_AOI', 'users/reachyemengis/water/JRC_AOI')










///////// Visualizing previous classifications in relation to sample points //////////////



//Map.addLayer(JRC.filterMetadata('month', 'equals', 5), imageVisParam4, 'JRC 5')
// Map.addLayer(JRC.filterMetadata('month', 'equals', 1), imageVisParam4, 'JRC 1')

// var previous_sample = ee.FeatureCollection('users/reachyemengis/water/JRC_sample_2019_test');
// Map.addLayer(previous_sample.filterMetadata('month', 'equals', 2), '', 'Sample 2')







//Map.addLayer(JRC.filterMetadata('month', 'equals', 7), imageVisParam4, 'JRC 7')


// var previous = ee.Image('users/reachyemengis/water_export6/water2019_7')
// //Map.addLayer(previous, '', 'previous')
// var mask = previous.eq(3);
// var output = previous.mask(mask);
// //Map.addLayer(previous, '', 'Classified Water 7')


//   Export.image.toAsset({
//   image: previous,
//   description: 'water_2019_test_v2',
//   assetId: 'water_2019_test_v2',
//   scale: 10,
//   region: yem,
//   maxPixels: 2000000000000
// }); 




// var previous = ee.FeatureCollection('users/reachyemengis/point_samples/2019_1000')
// //Export.table.toDrive(previous)


  
