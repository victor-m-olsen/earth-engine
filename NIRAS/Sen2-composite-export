/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry6 = /* color: #d63000 */ee.Geometry.Polygon(
        [[[33.88875539164155, 3.781527649613639],
          [32.33968312601655, 5.970705848732988],
          [31.828818868204053, 6.008948064596743],
          [31.087241719766553, 7.089480408520695],
          [29.900718282266553, 7.884638145096178],
          [29.312949727579053, 7.933606339949617],
          [28.423057149454053, 6.882289947856131],
          [26.143394063516553, 6.707743489485949],
          [26.280723165079053, 6.140043733444285],
          [27.06089794775562, 5.593461875730012],
          [27.31907665869312, 4.99179280649196],
          [27.67613232275562, 4.5921943330385195],
          [28.28587353369312, 4.170457717749562],
          [29.585241325608422, 4.347790919857543],
          [30.722326286545922, 3.454488985213427],
          [32.21646691154592, 3.4599721522155127]]]),
    sample21 = ee.FeatureCollection("users/victormackenhauer/sample21"),
    non_agri = ee.FeatureCollection("users/victormackenhauer/all_non_agri"),
    crop = ee.FeatureCollection("users/victormackenhauer/all_crop_2016"),
    cop_lc = ee.Image("users/victormackenhauer/Cop_LC"),
    geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[31.404894540258283, 5.058209335941707],
          [31.404894540258283, 4.718872560950311],
          [31.844347665258283, 4.718872560950311],
          [31.844347665258283, 5.058209335941707]]], null, false),
    training_points_cleaned_2 = ee.FeatureCollection("users/victormackenhauer/training_points_cleaned_2"),
    geometry2 = /* color: #d63000 */ee.Geometry.Point([27.20134752055867, 6.028350081728483]),
    geometry3 = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[31.043446054888022, 4.814898469769552],
          [31.043446054888022, 4.746472806371948],
          [31.117603769731772, 4.746472806371948],
          [31.117603769731772, 4.814898469769552]]], null, false),
    sample2016 = ee.FeatureCollection("users/victormackenhauer/sample2016"),
    new_A = ee.FeatureCollection("users/victormackenhauer/new_A"),
    new_B = ee.FeatureCollection("users/victormackenhauer/new_B"),
    new_C = ee.FeatureCollection("users/victormackenhauer/new_C"),
    new_D = ee.FeatureCollection("users/victormackenhauer/new_D"),
    geometry4 = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[11.723423324409055, 56.146235961622075],
          [11.723423324409055, 55.551085254883745],
          [12.800083480659055, 55.551085254883745],
          [12.800083480659055, 56.146235961622075]]], null, false),
    imageVisParam = {"opacity":1,"bands":["swir1"],"min":0.03358333148062229,"max":0.2617166493088007,"gamma":1},
    imageVisParam2 = {"opacity":1,"bands":["swir1"],"min":0.03358333148062229,"max":0.2617166493088007,"gamma":1};
/***** End of imports. If edited, may not auto-convert in the playground. *****/


var clip_feature = geometry4


/////////////////////////// Loading Imagery //////////////////////////////////////////////

// Filters
var sen2_selection = clip_feature.buffer(40000);

var selection_bands = ['NDVI', 'blue', 'red', 'nir', 'swir1', 'swir2'];
var selection_layers = ['NDVI', 'blue', 'red', 'nir', 'swir1', 'swir2'];

var start = ee.Date('2018-03-20');
var end = ee.Date('2018-05-10');


var sentinel2 = ee.ImageCollection('COPERNICUS/S2')
                    .filterDate(start, end)
                    .filterBounds(sen2_selection)
                    .map(function(image) {
                    return image.addBands(image.normalizedDifference(['B8','B4']).select(['nd'], ['NDVI'])).addBands(image.metadata('system:time_start'));
                    })
                    .map(function(img) {
                    var t = img.select(['B1','B2','B3','B4', 'B8','B10', 'B11','B12']).divide(10000);//Rescale to 0-1
                    t = t.addBands(img.select(['QA60']));
                    t = t.addBands(img.select(['NDVI']));
                    var out = t.copyProperties(img).copyProperties(img,['system:time_start']);
                    return out;
                    })
                    .select(['NDVI', 'QA60', 'B1','B2','B3','B4', 'B8','B10', 'B11','B12'],
                            ['NDVI', 'QA60','cb', 'blue', 'green', 'red', 'nir', 'cirrus','swir1', 'swir2'])
                    //.map(data_clipper)
                    .sort('system:time_start');









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




var sen2_mean_18 = sentinel2_masked.mean()


Map.addLayer(sen2_mean_18.clip(clip_feature), imageVisParam, '18')













/////////////////////////// Loading Imagery //////////////////////////////////////////////

// Filters
var sen2_selection = clip_feature.buffer(40000);

var selection_bands = ['NDVI', 'blue', 'red', 'nir', 'swir1', 'swir2'];
var selection_layers = ['NDVI', 'blue', 'red', 'nir', 'swir1', 'swir2'];

var start = ee.Date('2019-04-01');
var end = ee.Date('2019-05-01');


var sentinel2 = ee.ImageCollection('COPERNICUS/S2')
                    .filterDate(start, end)
                    .filterBounds(sen2_selection)
                    .map(function(image) {
                    return image.addBands(image.normalizedDifference(['B8','B4']).select(['nd'], ['NDVI'])).addBands(image.metadata('system:time_start'));
                    })
                    .map(function(img) {
                    var t = img.select(['B1','B2','B3','B4', 'B8','B10', 'B11','B12']).divide(10000);//Rescale to 0-1
                    t = t.addBands(img.select(['QA60']));
                    t = t.addBands(img.select(['NDVI']));
                    var out = t.copyProperties(img).copyProperties(img,['system:time_start']);
                    return out;
                    })
                    .select(['NDVI', 'QA60', 'B1','B2','B3','B4', 'B8','B10', 'B11','B12'],
                            ['NDVI', 'QA60','cb', 'blue', 'green', 'red', 'nir', 'cirrus','swir1', 'swir2'])
                    //.map(data_clipper)
                    .sort('system:time_start');









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


var sen2_mean_19 = sentinel2_masked.mean()


Map.addLayer(sen2_mean_19.clip(clip_feature), imageVisParam, '19')





var diff = sen2_mean_19.subtract(sen2_mean_18).clip(clip_feature)

Map.addLayer(diff, '', 'diff')




var combined_diff = diff.select(['swir1']).add(diff.select(['swir2']));

Map.addLayer(combined_diff, '', 'combined_diff')


Export.image.toDrive({
  image: combined_diff,
  description: 'combined_diff',
  scale: 10,
  maxPixels: 2000000000000
});






/*


Export.image.toDrive({
  image: diff.select(['swir1']),
  description: 'diff_B11',
  scale: 10,
  maxPixels: 2000000000000
});

Export.image.toDrive({
  image: diff.select(['swir2']),
  description: 'diff_B12',
  scale: 10,
  maxPixels: 2000000000000
});

*/
