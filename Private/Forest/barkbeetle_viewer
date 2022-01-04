/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var VisSen1 = {"opacity":1,"bands":["VV"],"min":0.13246244490146636,"max":0.340378013253212,"gamma":0.21500000000000002},
    imageVisParam = {"opacity":1,"bands":["B4","B3","B2"],"max":3000,"gamma":1.2520000000000002},
    barkbiller = ee.FeatureCollection("users/victormackenhauer/barkbiller"),
    study_area = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[14.702748003153769, 56.47839754121445],
          [14.702748003153769, 56.41957587683763],
          [14.778279009013144, 56.41957587683763],
          [14.778279009013144, 56.47839754121445]]], null, false),
    imageVisParam2 = {"opacity":1,"bands":["red","green","blue"],"min":0.0674,"max":1.2049,"gamma":3.2270000000000003};
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var clip_feature = study_area





/////////////////////////// Loading Imagery //////////////////////////////////////////////



// Filters
var sen2_selection = clip_feature.buffer(40000);
var sen1_selection = clip_feature.buffer(60000);
//var selection_bands = ['NDVI', 'blue', 'green', 'red', 'nir', 'swir2'];


var start = ee.Date('2018-06-01');
var end = ee.Date('2018-12-30');



var sentinel2 = ee.ImageCollection('COPERNICUS/S2')
                    .filterDate(start, end)
                    .filterBounds(sen2_selection)
                    .map(function(image) {
                    return image.addBands(image.normalizedDifference(['B8','B4']).select(['nd'], ['NDVI'])).addBands(image.metadata('system:time_start'));
                    })
                    .map(function(img) {
                      return img.divide(10000)
                    })
                    //.map(function(img) {
                    //var t = img.select(['B1','B2','B3','B4', 'B8','B10', 'B11','B12']).divide(10000);//Rescale to 0-1
                    //t = t.addBands(img.select(['QA60']));
                    //t = t.addBands(img.select(['NDVI']));
                  //  var out = t.copyProperties(img).copyProperties(img,['system:time_start']);
                    //return out;
                    //})
                    //.select(['NDVI', 'QA60', 'B1','B2','B3','B4', 'B8','B10', 'B11','B12'],
                    //        ['NDVI', 'QA60','cb', 'blue', 'green', 'red', 'nir', 'cirrus','swir1', 'swir2'])
                    //.sort('system:time_start');


print(sentinel2)

//Map.addLayer(sentinel2.first(), '', "Sen2")





/**
 * Function to mask clouds using the Sentinel-2 QA band
 * @param {ee.Image} image Sentinel-2 image
 * @return {ee.Image} cloud masked Sentinel-2 image
 */
function maskS2clouds(image) {
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}


var masked = sentinel2.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)).map(maskS2clouds);



var rgbVis = {
  min: 0.0,
  max: 0.3,
  bands: ['B4', 'B3', 'B2'],
};

//Map.setCenter(-9.1695, 38.6917, 12);
Map.addLayer(sentinel2.first().clip(clip_feature), rgbVis, 'RGB');



// Create an empty image into which to paint the features, cast to byte.
var empty = ee.Image().byte();

// Paint all the polygon edges with the same number and width, display.
var outline = empty.paint({
  featureCollection: barkbiller,
  color: 1,
  width: 1
});

Map.addLayer(outline, {palette: 'FF0000'}, 'biller');








/*









////////////////// Mosaicing  //////////////////////////


// Date range
var diff = end.difference(start, 'day');
var temporalResolution = 60; // days
var range = ee.List.sequence(0, diff.subtract(1), temporalResolution).map(function(day){return start.advance(day,'day')});



// Mosaic maker function (same code used for Sentinel 2)  - Inspiration: https://code.earthengine.google.com/20ad3c83a17ca27b28640fb922819208
function mosaic_maker(imageCollection){
  var temporal_composites = function(date, newlist) {
    date = ee.Date(date);
    newlist = ee.List(newlist);
    var filtered = imageCollection.filterDate(date, date.advance(temporalResolution, 'day'));
    var filtered_addedQA = filtered.map(function(image) {return image.addBands(image.metadata('system:time_start'))});
    var image = ee.Image(filtered_addedQA.qualityMosaic('NDVI')).set('system:time_start', date).clip(clip_feature); //filtered_addedQA.first().get('system:time_start')); // date);      qualityMosaic('system:time_start'))                  //Change to qualityMosaic()
    return ee.List(ee.Algorithms.If(filtered.size(), newlist.add(image), newlist));
};
  var imageCollection_unfiltered = ee.ImageCollection(ee.List(range.iterate(temporal_composites, ee.List([]))));
  return imageCollection_unfiltered.limit(range.size().subtract(1), 'system:time_start');
}

//var inspectImage = 0
//print('sentinel2_mosaics', '', sentinel2_mosaics)
//Map.addLayer(ee.Image(landsat_mosaics.toList(landsat_mosaics.size()).get(inspectImage)), VisParamNDVI, 'landsat_mosaic')







//////////////////////////// Cloud Masking Sentinel 2 ///////////////////////////////////
//Output: sentinel2_masked

//User Params
var cloudThresh =5;//Ranges from 1-100.Lower value will mask more pixels out. Generally 10-30 works well with 20 being used most commonly 
var cloudHeights = ee.List.sequence(200,10000,250);//Height of clouds to use to project cloud shadows
var irSumThresh =0.35;//Sum of IR bands to include as shadows within TDOM and the shadow shift method (lower number masks out less)
var dilatePixels = 2; //Pixels to dilate around clouds
var contractPixels = 1;//Pixels to reduce cloud mask and dark shadows by to reduce inclusion of single-pixel comission errors

var rescale = function(img, exp, thresholds) {
    return img.expression(exp, {img: img})
        .subtract(thresholds[0]).divide(thresholds[1] - thresholds[0]);
  };

//Cloud masking algorithm for Sentinel2
function sentinelCloudScore(img) {

  // Compute several indicators of cloudyness and take the minimum of them.
  var score = ee.Image(1);

  // Clouds are reasonably bright in the blue and cirrus bands.
  score = score.min(rescale(img, 'img.blue', [0.1, 0.5]));
  score = score.min(rescale(img, 'img.cb', [0.1, 0.3]));
  score = score.min(rescale(img, 'img.cb + img.cirrus', [0.15, 0.2]));
  
  // Clouds are reasonably bright in all visible bands.
  score = score.min(rescale(img, 'img.red + img.green + img.blue', [0.2, 0.8])); //[0.2, 0.8]

  
  //Clouds are moist
  var ndmi = img.normalizedDifference(['nir','swir1']);
  score=score.min(rescale(ndmi, 'img', [-0.1, 0.1]));
  
  // However, clouds are not snow.
  //var ndsi = img.normalizedDifference(['green', 'swir1']);
  //score=score.min(rescale(ndsi, 'img', [0.8, 0.6]));
  
  score = score.multiply(100).byte();
 
  return img.addBands(score.rename('cloudScore'));
}



//Function to bust clouds from S2 image
function bustClouds(img){
  img = sentinelCloudScore(img);
  img = img.updateMask(img.select(['cloudScore']).gt(cloudThresh).focal_min(contractPixels).focal_max(dilatePixels).not());
  return img;
}

// QA60 cloud masking (additional cloud mask)
 function maskS2clouds(image) {
  var qa = image.select('QA60');
  var cloudBitMask = ee.Number(2).pow(10).int();  // clouds
  var cirrusBitMask = ee.Number(2).pow(11).int(); // cirrus
  var date = image.get('system:time_start');
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
             qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask).set('system:time_start', date);   //.divide(10000)
}



// simpleTDOM2
function simpleTDOM2(c){
  var shadowSumBands = ['nir','swir1'];
  var irSumThresh = 0.4;
  var zShadowThresh = -1.2;
  
  //Get some pixel-wise stats for the time series
  //Extracts stdDev and mean for image in NIR and SWIR1
  var irStdDev = c.select(shadowSumBands).reduce(ee.Reducer.stdDev());
  var irMean = c.select(shadowSumBands).mean();
  var bandNames = ee.Image(c.first()).bandNames();
  //Mask out dark dark outliers
  c = c.map(function(img){
    //For each image, subtracts mean from NIR and SWIR1, then divides by stdDev
    var z = img.select(shadowSumBands).subtract(irMean).divide(irStdDev);
    //Gets sum of NIR and SWIR1
    var irSum = img.select(shadowSumBands).reduce(ee.Reducer.sum());
    //Gets area where z ???? 
    var m = z.lt(zShadowThresh).reduce(ee.Reducer.sum()).eq(2).and(irSum.lt(irSumThresh)).not();
    
    return img.updateMask(img.mask().and(m));
  });
  
  return c.select(bandNames);
}

// Applying the cloud mask to dataset
// Cloud masking with simpleTDOM2 and cloudScore and QA60band
//var sentinel2_masked = simpleTDOM2(sentinel2.map(maskS2clouds)).select(selection_bands);
//var sentinel2_masked = simpleTDOM2(sentinel2.map(bustClouds)).map(maskS2clouds).select(selection_bands);


var sentinel2_masked = sentinel2.map(maskS2clouds)





//////////////////////////// Mosaicking Sentinel 2/////////////////////////////////////////////////////////
//Output: sentinel2_mosaics

var sentinel2_mosaics = mosaic_maker(sentinel2_masked).select(selection_bands);

print(sentinel2_mosaics)










/////////////////////////////// Layer Stacking ////////////////////////////////////////////
//Output: layer_stack





var image_collection = sentinel2_mosaics



// Layer stack maker
var stackCollection = function(image_collection) {
  var first = ee.Image(image_collection.first()).select([]);
  var appendBands = function(image, previous) {   //Previous = result of previous iteration, NOT previous image
    return ee.Image(previous).addBands(image);
  };
  return ee.Image(image_collection.iterate(appendBands, first));   //First is the starting image to be used as starting point for adding onto for each interation
};

var layer_stack = stackCollection(image_collection).clip(clip_feature);     //.select(layer_selection)



print(layer_stack)







///////////////////////////////////// Sampling //////////////////////////////////////
//Output: training_sample




var land_sample = land.map(function(feature) {
    return feature.set('class', 1)})

print(land_sample)

var water_sample = water.map(function(feature) {
    return feature.set('class', 2)})

print(land_sample)


var training_points = land_sample.merge(water_sample)

print("training_points", training_points)

//test_samp = layer_stacks training_points.first()


var training_sample = training_points.map(function(feature) {
                            return layer_stack.sample({
                            region: ee.Feature(feature).geometry(),
                            scale: 10,
                            tileScale: 16,
                            geometries: true, //add geometries prior to exporting sample
                            dropNulls: true
                            }).first().set('class', feature.get('class'))})
                            
                            //.first().set('class', feature.get('class'))});

print("training_sample", training_sample)







///////////////////////////////////// CLASSIFICATION /////////////////////////////////

var classifier = ee.Classifier.randomForest(5);

var trained_classifier = classifier.train(training_sample, 'class', training_sample.first().propertyNames().remove('system:index'));

// Classify the layer_stack.
var classified = layer_stack.classify(trained_classifier).clip(clip_feature);



print(classified)
Map.addLayer(classified)

*/
