//*********************************************************************************
//**   NAME: S2_Classify_Tunisia
//**   Author: Sunita Yadav
//**   Description:  This script selects a composite image within a date range, and
//**                classifies that image based on define feature classes
//*********************************************************************************

// set date window
var date1 = ee.Date.fromYMD(2017,04,14); 
var date2 = ee.Date.fromYMD(2017,04,15); 

// select country boundary
var region = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw')
                .filterMetadata('Country', 'equals', 'Tunisia');

//display country boundary
Map.centerObject(region, 9); 
var region_nopaint = ee.Image().paint(region, 0, 2);
Map.addLayer(region_nopaint,  {color: '000000'}, "Tunisia");

//*********************************************************************************
//   CLOUD MASKING
//*********************************************************************************
function sentinel2toa(img) {
  var toa = img.select(['B1','B2','B3','B4','B5','B6','B7','B8','B8A','B9','B10', 'B11','B12'],  
                       ['aerosol', 'blue', 'green', 'red', 're1','re2','re3', 'nir','nir2', 'h2o', 'cirrus','swir1', 'swir2'])
                       .divide(10000)
                       .addBands(img.select(['QA60']))
                       .set('solar_azimuth',img.get('MEAN_SOLAR_AZIMUTH_ANGLE'))
                       .set('solar_zenith',img.get('MEAN_SOLAR_ZENITH_ANGLE'))
    return toa;
}


// author: Nick Clinton
function ESAcloud(toa) {
  var qa = toa.select('QA60');
  
  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = Math.pow(2, 10);
  var cirrusBitMask = Math.pow(2, 11);
  
  // clear if both flags set to zero.
  var clear = qa.bitwiseAnd(cloudBitMask).eq(0);
  // var clear = qa.bitwiseAnd(cloudBitMask).eq(0).and(
  //           qa.bitwiseAnd(cirrusBitMask).eq(0));
  
  var cloud = clear.eq(0);
  return cloud;
}


// Author: Gennadii Donchyts
// License: Apache 2.0
function shadowMask(toa,cloud){

  // solar geometry (radians)
  var azimuth =ee.Number(toa.get('solar_azimuth')).multiply(Math.PI).divide(180.0).add(ee.Number(0.5).multiply(Math.PI));
  var zenith  =ee.Number(0.5).multiply(Math.PI ).subtract(ee.Number(toa.get('solar_zenith')).multiply(Math.PI).divide(180.0));

  // find where cloud shadows should be based on solar geometry
  var nominalScale = cloud.projection().nominalScale();
  var cloudHeights = ee.List.sequence(200,10000,500);
  var shadows = cloudHeights.map(function(cloudHeight){
    cloudHeight = ee.Number(cloudHeight);
    var shadowVector = zenith.tan().multiply(cloudHeight);
    var x = azimuth.cos().multiply(shadowVector).divide(nominalScale).round();
    var y = azimuth.sin().multiply(shadowVector).divide(nominalScale).round();
    return cloud.changeProj(cloud.projection(), cloud.projection().translate(x, y));
  });
  var potentialShadow = ee.ImageCollection.fromImages(shadows).max();
  
  // shadows are not clouds
  var potentialShadow = potentialShadow.and(cloud.not());
  
  // (modified by Sam Murphy) dark pixel detection 
  var darkPixels = toa.normalizedDifference(['green', 'swir2']).gt(0.25).rename(['dark_pixels']);
  
  // shadows are dark
  var shadow = potentialShadow.and(darkPixels).rename('shadows');
  
  return shadow;
}


// Run the cloud masking code
function cloud_and_shadow_mask(img) {
  var toa = sentinel2toa(img);
  var cloud = ESAcloud(toa);
  var shadow = shadowMask(toa,cloud);
  var mask = cloud.or(shadow).eq(0);
  
  return toa.updateMask(mask);
}


//***********************************************************************************
// obtain SENTINEL-2 image and display
//***********************************************************************************

//set vizualization parameters
var vizParams = {'min': 0.05,'max': [0.3, 0.3, 0.35], 'bands':['B4', 'B3', 'B2'] };   //B4, B3, B2


//obtain the S2 image
var S2 = ee.ImageCollection('COPERNICUS/S2')
 .filterDate(date1, date2) 
 .filterBounds(region);

print("S2 tunisia: ", S2);
//Map.addLayer(S2, vizParams,'S2 initial image');

// check most cloudy image
var most_cloudy = ee.Image(S2.sort('CLOUDY_PIXEL_PERCENTAGE', false).first());
// print(most_cloudy);
Map.centerObject(most_cloudy); 
Map.addLayer(most_cloudy.clip(region), {'min': 230,'max': 2400, 'bands':['B4','B3','B2']}, 'most cloudy image', false);
Map.addLayer(most_cloudy.clip(region).select('QA60'), {min:0, max:2048}, 'most cloudy image (QA)', false);

//call the cloud masking functions
var masked_images = S2.map(cloud_and_shadow_mask);

//composite with median
var median = masked_images.median();
print("median: ", median);

// Select the red, green and blue bands
var S2final = median.select('red', 'green', 'blue');

var vizParams = {'min': 0.05,'max': [0.3, 0.3, 0.35], 'bands':['red', 'green', 'blue'] };   //B4, B3, B2

var S2_clip = S2final.clip(region);   //clipped to country boundary
// Map.centerObject(region, 7); 
Map.addLayer(S2_clip, vizParams,'S2 final image', true);
//Map.addLayer(S2final,{bands:['red','green','blue'],min:0, max:0.3},'S2 final image');


// Select the QA band
var qaBand = median.select('QA60');
var qaBand_clip = qaBand.clip(region);   //clipped to country boundary
// Map.centerObject(region, 7); 
Map.addLayer(qaBand_clip, {gain: '0.1', scale:20}, 'QA band', false);


/******************************************************************************************************/ 






