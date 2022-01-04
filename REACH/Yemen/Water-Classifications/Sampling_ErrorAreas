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
    aoi = ee.FeatureCollection("users/reachyemengis/water/nation_wide_aoi_v2"),
    class1 = ee.Image("users/reachyemengis/water_export7/water2020_1"),
    class2 = ee.Image("users/reachyemengis/water_export7/water2020_8"),
    certain_comission_errors = ee.FeatureCollection("users/reachyemengis/water_error_areas/certain_comission_errors"),
    agri_water_errors = ee.FeatureCollection("users/reachyemengis/water_error_areas/agri_water_errors"),
    costal_land = ee.FeatureCollection("users/reachyemengis/water_error_areas/costal_land"),
    imageVisParam5 = {"opacity":1,"bands":["classification"],"min":1,"max":3,"gamma":1};
/***** End of imports. If edited, may not auto-convert in the playground. *****/

//var error_areas = ee.FeatureCollection(certain_comission_errors)
var error_areas = ee.FeatureCollection(agri_water_errors)
//var error_areas = ee.FeatureCol lection(costal_land)


 
// var error_areas = ee.FeatureCollection(certain_comission_errors)
//               .merge(ee.FeatureCollection(agri_water_errors))
//               //.merge(ee.FeatureCollection(costal_land))
              
var imgCol = ee.ImageCollection([
  // ee.Image('users/reachyemengis/water_export7/water2020_1').set('month', 1),
  // ee.Image('users/reachyemengis/water_export7/water2020_2').set('month', 2),
  // ee.Image('users/reachyemengis/water_export7/water2020_3').set('month', 3),
  // ee.Image('users/reachyemengis/water_export7/water2020_4').set('month', 4),
  // ee.Image('users/reachyemengis/water_export7/water2020_5').set('month', 5),
  // ee.Image('users/reachyemengis/water_export7/water2020_6').set('month', 6),
  ee.Image('users/reachyemengis/water_export7/water2020_7').set('month', 7),
  ee.Image('users/reachyemengis/water_export7/water2020_8').set('month', 8),
  // ee.Image('users/reachyemengis/water_export7/water2020_9').set('month', 9),
  // ee.Image('users/reachyemengis/water_export7/water2020_10').set('month', 10),
  // ee.Image('users/reachyemengis/water_export7/water2020_11').set('month', 11),
  // ee.Image('users/reachyemengis/water_export7/water2020_12').set('month', 12),
                
  
  // 'users/reachyemengis/water_export7/water2020_2',
  // 'users/reachyemengis/water_export7/water2020_3',
  // 'users/reachyemengis/water_export7/water2020_4',
  // 'users/reachyemengis/water_export7/water2020_5',
  // 'users/reachyemengis/water_export7/water2020_6',
  // 'users/reachyemengis/water_export7/water2020_7',
  // 'users/reachyemengis/water_export7/water2020_8',
  // 'users/reachyemengis/water_export7/water2020_9',
  // 'users/reachyemengis/water_export7/water2020_10',
  // 'users/reachyemengis/water_export7/water2020_11',
  // 'users/reachyemengis/water_export7/water2020_12',
  ])

print(imgCol)
print(error_areas)
//Map.addLayer(imgCol.first())
Map.addLayer(error_areas)
Map.addLayer(imgCol.first(), imageVisParam5, 'img')

// //Function for applying negative buffer around surface water
// var buffer = function (image) {
//   var mask = image.mask().reduce(ee.Reducer.min())
//   var negative_buffer = mask
//     .focal_min({radius: 30, units: 'meters'})
//   return image.updateMask(negative_buffer)
// }


// //Function for for adding buffer to image as new class
// var reclasser = function(image) {
//   var JRC_water = image.mask(image.eq(2))
//   var JRC_buffer = buffer(JRC_water)
//   return image.where(JRC_buffer.eq(2), 3)}



// // Original
// var JRC = ee.ImageCollection('JRC/GSW1_2/MonthlyHistory').filterMetadata('year', 'equals', 2019)//.first()

// // Reclassing base buffer
// var JRC = JRC.map(function(image) {
//   var JRC_water = image.mask(image.eq(2))
//   var JRC_buffer = buffer(JRC_water)
//   return image.where(JRC_buffer.eq(2), 3)})

//var aoi = error_areas yem//geometry

// var visualization = {
//   bands: ['water'],
//   min: 0.0,
//   max: 2.0,
//   palette: ['ffffff', 'fffcb8', '0905ff']
// };

// Stratified random sampling in water and land
var sampler = function(image) {
  var water_sample = image.stratifiedSample({
    numPoints:1, 
    classBand:'classification', 
    region: error_areas, 
    scale: 10, 
    projection: 'EPSG:4326', 
    classValues: [1,3],
    classPoints: [0,20],  
    dropNulls: true, 
    geometries: true
  })
  .map(function(feature) {
  return feature.set('month', image.get('month')).set('class', 1) })  //Setting month to month number and class to land 
  return water_sample}

//Apply sampler function to image and saves it to list
var sample_combiner = function(image, list) { 
  var sample = sampler(image)
  //Add sample (one month) to list
  return ee.FeatureCollection(list).merge(sample) //.toList(sample.size())) //ee.List(list).add(added);
};

// Iterates over image collection, applies sample function and saves output to featureCollection
var error_sample = imgCol.iterate(sample_combiner, ee.FeatureCollection([]))

print(error_sample)
Map.addLayer(ee.FeatureCollection(error_sample))



Export.table.toAsset(ee.FeatureCollection(error_sample), 'agri_water_errors', 'users/reachyemengis/point_samples/agri_water_errors')
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


  
