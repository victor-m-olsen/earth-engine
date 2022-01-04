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
        [[[15.694289778182187, 61.45537558292738],
          [15.694289778182187, 61.34756993930996],
          [16.089797590682185, 61.34756993930996],
          [16.089797590682185, 61.45537558292738]]], null, false),
    imageVisParam = {"opacity":1,"bands":["red","green","blue"],"min":196.3,"max":1118.7,"gamma":1};
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var clip_feature = geometry


//// Reference modules
var Preprocess = require('users/victormackenhauer/REACH-BackUps:Modules/Preprocess (copy)')
var mosaick_maker_optical = require('users/victormackenhauer/REACH-BackUps:Modules/mosaick_maker_optical')



//// Loading Imagery

// Filters
var start = ee.Date('2020-01-01');
var end = ee.Date('2020-12-30');


// Data
var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR')
                    .filterDate(start, end)
                    .filterBounds(clip_feature);


//// Processing Sentinel 2

// Cloud masking
var sentinel2Cloudless = Preprocess.filterCloudsAndShadows(sentinel2,clip_feature,start,end,false, 32)

// Indices
var sentinel2Cloudless_indices = sentinel2Cloudless
                    .map(function(image) {
                    return image.addBands(image.normalizedDifference(['B8','B4']).select(['nd'], ['NDVI']));    //.addBands(image.metadata('system:time_start'))
                    })
                    .map(function(image) {
                    return image.addBands(image.normalizedDifference(['B3','B11']).select(['nd'], ['MNDWI']));
                    })
                    .select(['MNDWI','NDVI','B2','B3','B4', 'B8', 'B11','B12'],
                            ['MNDWI', 'NDVI', 'blue', 'green', 'red', 'nir', 'swir1', 'swir2']);

// Mosaicking
var diff = end.difference(start, 'day');
var temporalResolution = 30;
var range = ee.List.sequence(0, diff.subtract(1), temporalResolution).map(function(day){return start.advance(day,'day')});
var sentinel2_mosaics = mosaick_maker_optical.mosaick_maker(sentinel2Cloudless_indices, temporalResolution, range, clip_feature)

// Gap filling
var sentinel2_mosaics = sentinel2_mosaics.map(function(image) {
  return image.unmask(sentinel2_mosaics.median());   //sentinel2_mosaics.median()  //OBS: Selection bands deactivated .select(selection_bands) 
});


Map.addLayer(ee.Image(sentinel2_mosaics.toList(12).get(5)), imageVisParam, 'may')
Map.addLayer(ee.Image(sentinel2_mosaics.toList(12).get(6)), imageVisParam, 'june')
Map.addLayer(ee.Image(sentinel2_mosaics.toList(12).get(7)), imageVisParam, 'july')
Map.addLayer(ee.Image(sentinel2_mosaics.toList(12).get(8)), imageVisParam, 'aug')