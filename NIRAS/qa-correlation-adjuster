/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var point = /* color: #98ff00 */ee.Geometry.Point([9.116051512958165, 56.58372582261321]),
    geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[8.90293509685796, 56.68799741260664],
          [8.90293509685796, 56.46408913872097],
          [9.472850868342334, 56.46408913872097],
          [9.472850868342334, 56.68799741260664]]], null, false),
    table = ee.FeatureCollection("users/victormackenhauer/nir/Marker18"),
    geometry2 = /* color: #98ff00 */ee.Geometry.MultiPoint(),
    subset = ee.FeatureCollection("users/victormackenhauer/nir/markpoly_subset"),
    geometry3 = /* color: #0b4a8b */ee.Geometry.Polygon(
        [[[9.10964254424664, 56.58436397363994],
          [9.109256306148495, 56.581905973644574],
          [9.110715427852597, 56.58122054130362],
          [9.114406147457089, 56.58282774237164],
          [9.116423168636288, 56.58202415037838],
          [9.120714703060116, 56.58504934898927],
          [9.115092792964901, 56.586987239629565],
          [9.113290348506894, 56.5859474082237],
          [9.110457935787167, 56.5841276344313]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/

Map.addLayer(subset)

var clip_feature = geometry


// Removing bad geometries  ---- Check how many are removed
//var WFP2017_checked = farmland.map(function(feature) {
//                                            return feature.set('geometry', feature.geometry().type());
//                                            })
//                                             .filterMetadata('geometry', 'equals', 'Polygon');





/////////////////////////// Loading Imagery //////////////////////////////////////////////

// Filters
var sen2_selection = clip_feature.buffer(40000);
var sen1_selection = clip_feature.buffer(60000);
var selection_bands = ['NDVI', 'blue', 'green', 'red', 'nir'];
var optical_bands = ['blue', 'green', 'red', 'nir'];
var start = ee.Date('2018-01-01');
var end = ee.Date('2019-01-30');

var data_clipper = function(image) {          // Currently not in use
    return image.clip(clip_feature)
}

var sentinel2 = ee.ImageCollection('COPERNICUS/S2')
                    .filterDate(start, end)
                    .filterBounds(sen2_selection)
                    .map(function(image) {
                    return image.addBands(image.normalizedDifference(['B8','B4']).select(['nd'], ['NDVI'])).addBands(image.metadata('system:time_start'))
                    })
                    .map(function(img) {
                    var t = img.select(['B1','B2','B3','B4', 'B8','B10', 'B11','B12']).divide(10000);//Rescale to 0-1
                    t = t.addBands(img.select(['QA60']))
                    t = t.addBands(img.select(['NDVI']))
                    var out = t.copyProperties(img).copyProperties(img,['system:time_start']);
                    return out;
                    })
                    .select(['NDVI', 'QA60', 'B1','B2','B3','B4', 'B8','B10', 'B11','B12'],
                            ['NDVI', 'QA60','cb', 'blue', 'green', 'red', 'nir', 'cirrus','swir1', 'swir2'])
                    //.map(data_clipper)
                    .sort('system:time_start');
var sentinel1 = ee.ImageCollection('COPERNICUS/S1_GRD')
                  .sort('system:time_start')
                  .filterBounds(sen1_selection)  //Geometry, not feature!!
                  .filterDate(start, end)
                  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
                  //.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
                  .filter(ee.Filter.eq('instrumentMode', 'IW'))
                  .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
                  .select('VV')
                  .map(function(image) {
                    return image.unitScale(-30, 30).copyProperties(image, ['system:time_start']);        //No clamping performed, may be a problem for outliers
                  });
var landsat = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
                  .filterDate(start, end)
                  .filterBounds(sen2_selection)
                  .select(['B2', 'B3', 'B4','B5','BQA'],['blue', 'green', 'red','nir','BQA']) // add for optical visualisation: 'B2','B3
                  .map(function(image) {
                  return image.addBands(image.normalizedDifference(['nir','red']).select(['nd'], ['NDVI']))
                  })
                  .sort('system:time_start');
var aqua = ee.ImageCollection('MODIS/006/MYD13Q1')
                  .filterDate(start, end)
                  .filterBounds(sen2_selection)
                  .select(['NDVI','sur_refl_b01','sur_refl_b02','sur_refl_b03', 'sur_refl_b07'], ['NDVI','blue','green','red', 'nir'])
                  .sort('system:time_start')
var terra = ee.ImageCollection('MODIS/006/MOD13Q1')
                  .filterDate(start, end)
                  .filterBounds(sen2_selection)
                  .select(['NDVI','sur_refl_b01','sur_refl_b02','sur_refl_b03', 'sur_refl_b07'], ['NDVI','blue','green','red', 'nir'])
                  .sort('system:time_start')
var dem = ee.Image('USGS/SRTMGL1_003');
var elevation = dem.select('elevation');
var slope = ee.Terrain.slope(elevation);

//Map.addLayer(slope, {min: 0, max: 60}, 'slope');
//Map.addLayer(elevation, '', 'elevation');












//////////////////Cloud masking Landsat //////////////////////////
//Output: landsat_masked

// Cloud masking
// Inspiration: https://gis.stackexchange.com/questions/292835/landsat-8-bqa-using-cloud-confidence-to-create-a-cloud-mask

var l8_cloud_remover = function(image) {
  
  var RADIX = 2;  // Radix for binary (base 2) data.
  
  // Extract the QA band.
  var image_qa = image.select('BQA');
  
  var extractQABits = function (qaBand, bitStart, bitEnd) {
    var numBits = bitEnd - bitStart + 1;
    var qaBits = qaBand.rightShift(bitStart).mod(Math.pow(RADIX, numBits));
    return qaBits;
  };
  
  // Create a mask for the dual QA bit "Cloud Confidence".
  var bitStartCloudConfidence = 5;
  var bitEndCloudConfidence = 6;
  var qaBitsCloudConfidence = extractQABits(image_qa, bitStartCloudConfidence, bitEndCloudConfidence);
  // Test for clouds, based on the Cloud Confidence value.
  var testCloudConfidence = qaBitsCloudConfidence.gte(2);
  
  // Create a mask for the dual QA bit "Cloud Shadow Confidence".
  var bitStartShadowConfidence = 7;
  var bitEndShadowConfidence = 8;
  var qaBitsShadowConfidence = extractQABits(image_qa, bitStartShadowConfidence, bitEndShadowConfidence);
  // Test for shadows, based on the Cloud Shadow Confidence value.
  var testShadowConfidence = qaBitsShadowConfidence.gte(2);
  
  // Calculate a composite mask and apply it to the image.   
  var maskComposite = (testCloudConfidence.or(testShadowConfidence)).not();
  
  return image.updateMask(maskComposite);
};

var landsat_masked = landsat.map(l8_cloud_remover).select(selection_bands);  ///Add optical bands if needed












////////////////// Mosaicing Landsat //////////////////////////
//Output: landsat_mosaics

// Inspiration: https://code.earthengine.google.com/20ad3c83a17ca27b28640fb922819208

// Date range
var diff = end.difference(start, 'day');
var temporalResolution = 30; // days
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


var landsat_mosaics = mosaic_maker(landsat_masked)













//////////////////////// Mosaicing MODIS ////////////////////////////////
//Output: modis_mosaics

var modis = terra.merge(aqua).sort('system:time_start');

// Mosaic maker
var day_mosaics = function(date, newlist) {
  date = ee.Date(date);
  newlist = ee.List(newlist);
  var filtered = modis.filterDate(date, date.advance(temporalResolution, 'day'));
  var image = ee.Image(filtered.mosaic()).set('system:time_start', date); //latest image on top
  return ee.List(ee.Algorithms.If(filtered.size(), newlist.add(image), newlist));
};

var modis_unfiltered = ee.ImageCollection(ee.List(range.iterate(day_mosaics, ee.List([]))));
var modis_list = modis_unfiltered.toList(range.size().subtract(1)); //removing last image
var modis_mosaics = ee.ImageCollection(modis_list.map(function(image) {
  var scale_factor = ee.Image(0.0001);
  var time_string = ee.Image(image).get('system:time_start');
  return ee.Image(image).multiply(scale_factor).set('system:time_start', time_string).clip(clip_feature);
}));

//var inspectImage = 5;
//print('modis_mosaics', '', modis_mosaics);
//Map.addLayer(ee.Image(modis_mosaics.toList(modis_mosaics.size()).get(inspectImage)), VisParamNDVI, 'modis_mosaics');







 
 


//////////////////////////// Cloud Masking Sentinel 2///////////////////////////////////
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
var sentinel2_masked = simpleTDOM2(sentinel2.map(bustClouds)).map(maskS2clouds).select(selection_bands);












//////////////////////////// Mosaicking Sentinel 2/////////////////////////////////////////////////////////
//Output: sentinel2_mosaics

var sentinel2_mosaics = mosaic_maker(sentinel2_masked);

//Map.addLayer(sentinel2_mosaics.first())



/*


var clip_feature = geometry3



//var visParam = imageVisParam3

Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(0)).select('NDVI').clip(clip_feature), '', '0', false);
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(1)).select('NDVI').clip(clip_feature), '', '1', false);
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(2)).select('NDVI').clip(clip_feature), '', '2', false);
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(3)).select('NDVI').clip(clip_feature), '', '3', false);
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(4)).select('NDVI').clip(clip_feature), '', '4', false);
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(5)).select('NDVI').clip(clip_feature), '', '5', false);
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(6)).select('NDVI').clip(clip_feature), '', '6', false);
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(7)).select('NDVI').clip(clip_feature), '', '7', false);
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(8)).select('NDVI').clip(clip_feature), '', '8', false);
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(9)).select('NDVI').clip(clip_feature), '', '9', false);
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(10)).select('NDVI').clip(clip_feature), '', '10', false);
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(11)).select('NDVI').clip(clip_feature), '', '11', false);


print(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(3)).select('NDVI'))



Map.addLayer(subset.filterMetadata('id', 'equals', '00007c74a1d08cda9f1f'))








Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(1)), visParam, '1');
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(2)), visParam, '2');
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(3)), visParam, '3');
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(4)), visParam, '4');
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(5)), visParam, '5');
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(6)), visParam, '6');
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(7)), visParam, '7');
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(8)), visParam, '8');
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(9)), visParam, '9');
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(10)), visParam, '10');
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(11)), visParam, '11');
Map.addLayer(ee.Image(sentinel2_mosaics.toList(sentinel2_mosaics.size()).get(12)), visParam, '12');

*/













//////////////////////////////////// Correlating and adjusting values ///////////////////////
//beware of potential problem if no overlapping pixels exist for sen2 and landsat/modis


//Output: adjusted_landsat_mosaics
//Output: adjusted_modis_mosaics

var correlation_adjuster = function(image) {
  var time = image.get('system:time_start')
  var sen2_image = sentinel2_mosaics.filterMetadata('system:time_start', 'not_less_than', time).first()
  
  //get sen2_mean where sen2 overlaps with filler
  var sen2_mean = sen2_image.select(selection_bands).updateMask(image.select(selection_bands)).reduceRegion({
  reducer: ee.Reducer.median(),     ///Consider mean instead of median
  geometry: clip_feature,
  scale: 1000,
  tileScale: 16,
  bestEffort: true
  //maxPixels: 1e9
  });
  
  //get filler_mean where filler overlaps with sen2
  var filler_mean = image.select(selection_bands).updateMask(sen2_image.select(selection_bands)).reduceRegion({
  reducer: ee.Reducer.median(),
  geometry: clip_feature,
  scale: 1000,
  tileScale: 16,
  //maxPixels: 1e9
  bestEffort: true
  });

  var multiplication_factor_NDVI = ee.Number(sen2_mean.get('NDVI')).divide(ee.Number(filler_mean.get('NDVI')))
  var multiplication_factor_red = ee.Number(sen2_mean.get('red')).divide(ee.Number(filler_mean.get('red')))
  var multiplication_factor_green = ee.Number(sen2_mean.get('green')).divide(ee.Number(filler_mean.get('green')))
  var multiplication_factor_blue = ee.Number(sen2_mean.get('blue')).divide(ee.Number(filler_mean.get('blue')))
  var multiplication_factor_nir = ee.Number(sen2_mean.get('nir')).divide(ee.Number(filler_mean.get('nir')))
  
  var ndvi = image.select('NDVI').multiply(ee.Image(multiplication_factor_NDVI)).set('system:time_start', time)
  var red = image.select('red').multiply(ee.Image(multiplication_factor_red))
  var green = image.select('green').multiply(ee.Image(multiplication_factor_green))
  var blue = image.select('blue').multiply(ee.Image(multiplication_factor_blue))
  var nir = image.select('nir').multiply(ee.Image(multiplication_factor_nir))
  
  //var ndvi = ee.Algorithms.If(filler_mean.get('NDVI'), image.select('NDVI').multiply(ee.Image(multiplication_factor_NDVI)).set('system:time_start', time), image.select('NDVI').set('system:time_start', time))
  //var red = ee.Algorithms.If(filler_mean.get('NDVI'), image.select('red').multiply(ee.Image(multiplication_factor_red)), image.select('red')) 
  //var green = ee.Algorithms.If(filler_mean.get('NDVI'), image.select('green').multiply(ee.Image(multiplication_factor_green)), image.select('green')) 
  //var blue = ee.Algorithms.If(filler_mean.get('NDVI'), image.select('blue').multiply(ee.Image(multiplication_factor_blue)), image.select('blue')) 
  //var nir = ee.Algorithms.If(filler_mean.get('NDVI'), image.select('nir').multiply(ee.Image(multiplication_factor_nir)), image.select('nir')) 
  
  return  ee.Algorithms.If(filler_mean.get('NDVI'), ee.Image(ndvi).addBands(ee.Image(red)).addBands(ee.Image(green)).addBands(ee.Image(blue)).addBands(ee.Image(nir)), null)
};



var adjusted_landsat_mosaics = landsat_mosaics.map(correlation_adjuster, true);
var adjusted_modis_mosaics = modis_mosaics.map(correlation_adjuster, true);









////////////////////////////////// Gap filling Sentinel 2  //////////////////////////////////
//Output: sentinel2_optical_filled
//Output: sentinel2_NDVI_filled

// Filling gaps with Landsat     //Consider selecting by matching time_start, not closest layer to time_start
var sentinel2_mosaics_landsatFill = sentinel2_mosaics.map(function(image) {
  var time_stamp = ee.Date(image.get('system:time_start'));
  return ee.Algorithms.If(adjusted_landsat_mosaics.filterDate(time_stamp, end).first(), image.select(selection_bands).unmask(adjusted_landsat_mosaics.filterDate(time_stamp, end).first()), null);
}, true);



// Filling gaps with MODIS
var sentinel2_modisFill = sentinel2_mosaics_landsatFill.map(function(image) {
  var time_stamp = ee.Date(image.get('system:time_start'));
  return image.select(selection_bands).unmask(adjusted_modis_mosaics.filterDate(time_stamp, end).first()).toFloat();
}, true)

//print('sentinel2_mosaics_landsatFill', sentinel2_mosaics_landsatFill)
//print('adjusted_landsat_mosaics', adjusted_landsat_mosaics)


//Map.addLayer(sentinel2_modisFill.first(), '', 'sen2')
//print(sentinel2_modisFill.first())



print('sentinel2_mosaics')
// Create an image time series chart for NDVI
var chart1 = ui.Chart.image.series({
  imageCollection: sentinel2_mosaics.select('NDVI'),
  region: point,
  //reducer: ee.Reducer.mean(),
  scale: 10
});
print(chart1);



print('l8')
// Create an image time series chart for NDVI
var chart5 = ui.Chart.image.series({
  imageCollection: adjusted_landsat_mosaics.select('NDVI'),
  region: point,
  //reducer: ee.Reducer.mean(),
  scale: 10
});
print(chart5)



print('sen2 filled - L8')
// Create an image time series chart for NDVI
var chart2 = ui.Chart.image.series({
  imageCollection: sentinel2_mosaics_landsatFill.select('NDVI'),
  region: point,
  //reducer: ee.Reducer.mean(),
  scale: 10
});
print(chart2);



print('MODIS')
// Create an image time series chart for NDVI
var chart6 = ui.Chart.image.series({
  imageCollection: adjusted_modis_mosaics.select('NDVI'),
  region: point,
  //reducer: ee.Reducer.mean(),
  scale: 10
});
print(chart6);



print('sen2 filled - L8 + MODIS')
// Create an image time series chart for NDVI
var chart7 = ui.Chart.image.series({
  imageCollection: sentinel2_modisFill.select('NDVI'),
  region: point,
  //reducer: ee.Reducer.mean(),
  scale: 10
});
print(chart7);








print('uncorrected datasets')
print('uncorrected datasets')
print('uncorrected datasets')
print('uncorrected datasets')
print('uncorrected datasets')
// Filling gaps with Landsat
var sentinel2_mosaics_landsatFill = sentinel2_mosaics.map(function(image) {
  var time_stamp = ee.Date(image.get('system:time_start'));
  return ee.Algorithms.If(landsat_mosaics.filterDate(time_stamp, end).first(), image.select(selection_bands).unmask(landsat_mosaics.select(selection_bands).filterDate(time_stamp, end).first()), null);
}, true);



// Filling gaps with MODIS
var sentinel2_modisFill = sentinel2_mosaics_landsatFill.map(function(image) {
  var time_stamp = ee.Date(image.get('system:time_start'));
  return image.select(selection_bands).unmask(modis_mosaics.select(selection_bands).filterDate(time_stamp, end).first()).toFloat();
}, true)




print('l8')
// Create an image time series chart for NDVI
var chart5 = ui.Chart.image.series({
  imageCollection: adjusted_landsat_mosaics.select('NDVI'),
  region: point,
  //reducer: ee.Reducer.mean(),
  scale: 10
});
print(chart5)



print('sen2 filled - L8')
// Create an image time series chart for NDVI
var chart2 = ui.Chart.image.series({
  imageCollection: sentinel2_mosaics_landsatFill.select('NDVI'),
  region: point,
  //reducer: ee.Reducer.mean(),
  scale: 10
});
print(chart2);



print('MODIS')
// Create an image time series chart for NDVI
var chart6 = ui.Chart.image.series({
  imageCollection: adjusted_modis_mosaics.select('NDVI'),
  region: point,
  //reducer: ee.Reducer.mean(),
  scale: 10
});
print(chart6);



print('sen2 filled - L8 + MODIS')
// Create an image time series chart for NDVI
var chart7 = ui.Chart.image.series({
  imageCollection: sentinel2_modisFill.select('NDVI'),
  region: point,
  //reducer: ee.Reducer.mean(),
  scale: 10
});
print(chart7);




/*



//////////////////////////// Processing Sentinel 1 /////////////////////////////////////////////////////////
//Output: sentinel1_mosaics

// Composites
var months = ee.List.sequence(1, 331, 30);
var sentinel1_mosaics_unfiltered = ee.ImageCollection(months.map(function(m) {
  var time_period = sentinel1.filter(ee.Filter.calendarRange({
    start: m,
    end: ee.Number(m).add(30),
    field: 'day_of_year'
  }));
  var composite = ee.Image(time_period.mean());
  return composite.set('system:time_start', m);
}));

//Filters out images outside of current temporal scope
var sentinel1_mosaics = sentinel1_mosaics_unfiltered.map(function(image) {
  return ee.Algorithms.If(ee.Number(image.bandNames().size().gt(0)), image.set('approved','true'), image.set('approved','false'));
}).filterMetadata('approved', 'equals', 'true');











//////////////////////////////////////// Seasonality metrics /////////////////////////////////////////
//output: metrics

// Amplitude NDVI
var max = ee.Image(sentinel2_modisFill.select('NDVI').reduce(ee.Reducer.max()));
var min = ee.Image(sentinel2_modisFill.select('NDVI').reduce(ee.Reducer.min()));
var amp = max.subtract(min);

// Amplitude SAR
var vv_max = ee.Image(sentinel1.reduce(ee.Reducer.max()));
var vv_min = ee.Image(sentinel1.reduce(ee.Reducer.min()));
var vv_amp = vv_max.subtract(vv_min);

var metrics = ee.Image.cat([max, min, amp, vv_amp]).select(['NDVI_max', 'NDVI_min', 'NDVI_max_1', 'VV_max'],['max', 'min', 'amp', 'vv_amp']);












/////////////////////////////// Layer Stacking ////////////////////////////////////////////
//Output: layer_stack

//Datasets to be combined:
//sentinel1_mosaics
//sentinel2_modisFill
//metrics

var image_collection = sentinel1_mosaics.merge(sentinel2_modisFill).merge(metrics);

// Layer stack maker
var stackCollection = function(image_collection) {
  var first = ee.Image(image_collection.first()).select([]);
  var appendBands = function(image, previous) {   //Previous = result of previous iteration, NOT previous image
    return ee.Image(previous).addBands(image);
  };
  return ee.Image(image_collection.iterate(appendBands, first));   //First is the starting image to be used as starting point for adding onto for each interation
};

var layer_stack = stackCollection(image_collection).clip(clip_feature);








/*


///////////////////////////////////// Sampling //////////////////////////////////////
//Output: training_sample

var training_sample = layer_stack.sampleRegions({
  collection: training_points,
  properties: ['class'],
  scale: 10,
  tileScale: 16
});


var training_sample = training_points.map(function(feature) {
                            return layer_stack.sample({
                            region: ee.Feature(feature).geometry(),
                            scale: 10,
                            tileScale: 16,
                            geometries: true
                            }).first().set('class', feature.get('class'))})





Export.table.toDrive(training_points.map(function(feature) {
                            return layer_stack.sample({
                            region: ee.Feature(feature).geometry(),
                            scale: 10,
                            tileScale: 16,
                            geometries: true
                            }).first().set('class', feature.get('class'))}))




 



///////////////////////////////////// CLASSIFICATION /////////////////////////////////

var classifier = ee.Classifier.randomForest(500);

var trained_classifier = classifier.train(full_area_sample, 'class', full_area_sample.first().propertyNames().remove('system:index'));  //full_area_sample

// Classify the layer_stack.
var classified = layer_stack.classify(trained_classifier).clip(geometry14);



// Create a palette to display the classes.
var palette =['6a2325', '32CD32', 'cdb33b',
              '8B4513', '98FB98', '00FA9A',
              '90EE90', '00008B', 'FF8C00',
              'ADFF2F', '808080', '152106', 
              '225129', '369b47', '30eb5b',
              '387242', '6a2325', 'c3aa69',
              'b76031', 'd9903d', '91af40',
              '111149', 'cdb33b', 'cc0013',
              '33280d', 'd7cdcc', 'f7e084'];

// Display the classification result and the input image.
//print(classified)
//Map.addLayer(classified, {min: 1, max: 35, palette: palette}, 'Classification Result');






Export.image.toDrive({
  image: classified,
  description: 'classification_export14',
  scale: 10,
  region: geometry14,
  maxPixels: 2000000000000
});







/*




//////////////////// Accuracy Assessment //////////////////////////

// Training Accracy
var trainAccuracy = trained_classifier.confusionMatrix();
print('Resubstitution error matrix: ', trainAccuracy);
print('Training overall accuracy: ', trainAccuracy.accuracy());


// Get validation sample
var validation = layer_stack_appended
    .stratifiedSample({
      numPoints: 10,
      classBand: 'class',
      scale: 10,
      region: training_polygons.filterBounds(valid_area).geometry()     //change to training_points
    })
    
var training_sample = layer_stack.sampleRegions({
  collection: training_points,
  properties: ['class'],
  scale: 10,        ///add tileScale
  geometries: true
}); 

    





// Classify the validation data.
var validated = validation.classify(trained_classifier);

// Overall Accuracy
var testAccuracy = validated.errorMatrix('class', 'classification');
print('Validation error matrix: ', testAccuracy);
print('Validation overall accuracy: ', testAccuracy.accuracy());





Map.addLayer(collected_training_polygons_unfiltered.filterBounds(geometry3), '', 'training_data')

print(collected_training_polygons_unfiltered.filterBounds(geometry3).filterMetadata('class', 'equals', 1))
print(collected_training_polygons_unfiltered.filterBounds(geometry3).filterMetadata('class', 'equals', 2))
print(collected_training_polygons_unfiltered.filterBounds(geometry3).filterMetadata('class', 'equals', 3))
print(collected_training_polygons_unfiltered.filterBounds(geometry3).filterMetadata('class', 'equals', 4))
print(collected_training_polygons_unfiltered.filterBounds(geometry3).filterMetadata('class', 'greater_than', 4))


var colours = ['006400', '32CD32', 'EEE8AA', '8B4513']
Map.addLayer(collected_training_polygons_unfiltered, {palette:colours}, 'training_data')//.filterMetadata('class', 'equals', 2),'','class2')


var palette = ['006400', '32CD32', 'EEE8AA', '8B4513']

var empty = ee.Image().byte();

var fills = empty.paint({
  featureCollection: collected_training_polygons_unfiltered,
  color: 'G200_NUM',
});

Map.addLayer(fills, {palette: palette}, 'colored fills');
Map.addLayer(training_polygons.filterMetadata('class', 'equals', 'forest'), {color:'8B4513'}, 'forest')
Map.addLayer(training_polygons.filterMetadata('class', 'equals', 'non_agri'))

print(training_polygons)





Map.addLayer(farmland, '', 'Farmland')


*/