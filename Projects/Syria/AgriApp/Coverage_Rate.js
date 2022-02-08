/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var aoi = 
    /* color: #d63000 */
    /* shown: false */
    /* locked: true */
    ee.Geometry.Polygon(
        [[[35.684149846535576, 37.31291707686042],
          [35.684149846535576, 32.322619959759066],
          [42.432501897316826, 32.322619959759066],
          [42.432501897316826, 37.31291707686042]]], null, false),
    WaPor_LULC19 = ee.Image("users/pedrovieirac/Syria/L2_SYR_LCC_19"),
    syrAdm3 = ee.FeatureCollection("users/pedrovieirac/Syria/syr_adm3");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
 
var imageVisParamNDVI = {"opacity":1,"bands":["NDVI"],"min":0,"max":10,"palette":["ffffff","006600"]};

var clipFeature = aoi  ///SELECT AOI

var Preprocess = require('users/pedrovieirac/temp:Modules/Preprocess')


var start = ee.Date('2019-01-01');
var end = ee.Date('2019-01-15');

// Loading and filtering imageCollections
var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR')
                    .filterDate(start, end)
                    .filterBounds(clipFeature)





/////////////////////////////// CLOUD MASKING

var sentinel2Cloudless = Preprocess.filterCloudsAndShadows(sentinel2,clipFeature,start,end,false, 80)

var cloudlessList = sentinel2Cloudless.select(['B2','B3','B4'], ['blue', 'green', 'red']).toList(sentinel2Cloudless.size());

print('S2_Cloudless', sentinel2Cloudless)



/////////////////////////////// CALCULATING INDICES 
var sentinel2Indices = Preprocess.calculateIndices(sentinel2Cloudless)

var NDVI_list = sentinel2Indices.select(['NDVI']).toList(sentinel2.size());

print('Sentinel 2 - With Indices', sentinel2Indices)



// var estimateCoverage = function(imageCollection) {
var reducedImage =   sentinel2Indices.count()

var image =   sentinel2Indices.median()


// print(reducedImage)

// Map.addLayer(reducedImage, imageVisParamNDVI, 'img1', true)


reducedImage = reducedImage.select(['NDVI'])

print(reducedImage)

var crop_mask = WaPor_LULC19.eq(42).or(WaPor_LULC19.eq(41))

var clipped = reducedImage.updateMask(crop_mask)

var nonZeroMask = clipped.gt(0)



var cropMask = crop_mask.updateMask(crop_mask).toByte()

var nonZeroMask = nonZeroMask.updateMask(nonZeroMask).toByte()


Map.addLayer(crop_mask ,{pallete:"ffffff"} ,  'WaPor', false)

Map.addLayer(nonZeroMask, imageVisParamNDVI, 'nonZeroMask', true)

// Map.addLayer(clipped, imageVisParamNDVI, 'img1', true)
// Map.addLayer(coverageArea ,{pallete:"ffffff"} , 'Sum', false)

// var area = ee.Image.pixelArea();
// var coverageArea = nonZeroMask.multiply(area).rename('CoverageArea');

print("T1", nonZeroMask)

print("T2", cropMask)





var syria = syrAdm3.geometry()

//count reducer
var stats = nonZeroMask.reduceRegions({
    reducer: ee.Reducer.sum(), 
    collection: syrAdm3,
    scale: 100,
    // bestEffort: true,
    // maxPixels: 1E13,
    tileScale: 16
  });
  
  print(stats)


stats = stats.reduceColumns({
    reducer: ee.Reducer.sum(), 
    selectors: ["sum"]
  }) 
  
print(stats)


// print(ee.Number(stats.get("NDVI")))






// ATTEMPTS


// var vectors = nonZeroMask.reduceToVectors({
//   geometry: syria,
//   scale: 10000,
//   geometryType: 'polygon',
//   eightConnected: false,
//   labelProperty: 'zone'
//   // reducer: ee.Reducer.mean()
// });


// print(ui.Chart.image.histogram({
//   image: clipped,
// //   region: clipped.geometry(),
// //   minBucketWidth: 2,
// //   scale: 10000000,
// //   // maxPixels: 446564545
// // }))


// var results = clipped.reduceRegions({
//   collection: crop_mask.geometry(),
//   reducer: ee.Reducer.histogram(4, 1),
//   scale: 1000000,
// });

// print(results)

// //  This should work
// function resultsHisto(feature) {
//   var histprops = ee.Dictionary(feature.get('histogram'));
//   // return histprops
//   return  ee.Feature(feature)
//               .set('counts', histprops.get('histogram'), 'means', histprops.get(1));
// }

// // correctly done
// var histprops = ee.Dictionary(results.get('histogram'))
// print(histprops, "histprops");
// // var resultsFinal = results.map(resultsHisto);
// // print(resultsFinal, "resultsFinal");

// // Map.addLayer(reduced, imageVisParamNDVI, 'NDVI 5', false)















