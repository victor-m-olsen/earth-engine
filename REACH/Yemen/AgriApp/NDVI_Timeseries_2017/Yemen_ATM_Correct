/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var aoi = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[42.726386174660576, 16.40390837461534],
          [42.726386174660576, 16.265533306166123],
          [42.943366155129326, 16.265533306166123],
          [42.943366155129326, 16.40390837461534]]], null, false),
    imageVisParam = {"opacity":1,"bands":["red","green","blue"],"min":200.72,"max":2875.28,"gamma":1},
    imageVisParamNDVI = {"opacity":1,"bands":["NDVI"],"min":0,"max":0.9,"palette":["ffffff","0cc219"]},
    imageVisParamNDWI = {"opacity":1,"bands":["NDWI"],"min":0,"max":0.4,"palette":["ffffff","568bff"]},
    imageVisParamMNDWI = {"opacity":1,"bands":["MNDWI"],"min":0,"max":0.8,"palette":["ffffff","3d8cdc"]},
    imageVisParamMorph = {"opacity":1,"bands":["red_morphed","green_morphed","blue_morphed"],"min":-528.1104105493118,"max":3019.762900687379,"gamma":1},
    imageVisParamSlope = {"opacity":1,"bands":["slope"],"max":4.423187732696533,"gamma":1},
    imageVisParamElevation = {"opacity":1,"bands":["elevation"],"min":8.600000000000001,"max":85.4,"gamma":1},
    waPor17 = ee.Image("users/pedrovieirac/Yemen/WaPor_LULC_17");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
 
// Defining AOI
var clip_feature = aoi
 


var WaPor_LULC = ee.Image("users/pedrovieirac/WaPor_LULC_19")

var GLC10_LULC = ee.Image("users/pedrovieirac/Yemen/GLC10m_Yemen")





/////////////////////////// Loading Imagery //////////////////////////////////////////////

// Filters
var start = ee.Date('2017-01-01');
var end = ee.Date('2017-7-01');


// Loading and filtering imageCollections
var sentinel2 = ee.ImageCollection('COPERNICUS/S2')
                    .filterDate(start, end)
                    .filterBounds(clip_feature)

var dem = ee.Image('USGS/SRTMGL1_003');
var elevation = dem.select('elevation');
var slope = ee.Terrain.slope(elevation);

// Map.addLayer(elevation, imageVisParamElevation, 'elevation', false)
// Map.addLayer(slope, imageVisParamSlope, 'slope', false)




////Visualizing images in the Sentinel-2 imageCollection
print('original sentinel2', sentinel2)

var listOfImages = sentinel2.select(['B2','B3','B4'], ['blue', 'green', 'red']).toList(sentinel2.size());






/////////////////////////// Cloud Masking Sentinel 2  //////////////////////////////////////////////
// Original code: https://developers.google.com/earth-engine/tutorials/community/sentinel-2-s2cloudless

var AOI = clip_feature
var START_DATE = start
var END_DATE = end
var CLOUD_FILTER = 20         //Maximum image cloud cover percent allowed in image collection
var CLD_PRB_THRESH = 40       //Cloud probability (%); values greater than are considered cloud
var NIR_DRK_THRESH = 0.20     //Near-infrared reflectance; values less than are considered potential cloud shadow
var CLD_PRJ_DIST = 1          //Maximum distance (km) to search for cloud shadows from cloud edges
var BUFFER = 50               //Distance (m) to dilate the edge of cloud-identified objects



// Import and filter S2 SR.
// Loading s2cloudless collections based on predefined parameters
// Joining the two collections by adding a s2_cloudless_col image as a a property to the corresponding sen2 image

var s2_sr_col = sentinel2.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', CLOUD_FILTER))

var get_s2_sr_cld_col = function(aoi, start_date, end_date) {
    
    // Import and filter s2cloudless.
    var s2_cloudless_col = ee.ImageCollection('COPERNICUS/S2_CLOUD_PROBABILITY')
        .filterBounds(aoi)
        .filterDate(start_date, end_date)

    // Join the filtered s2cloudless collection to the SR collection by the 'system:index' property.
    return ee.ImageCollection(ee.Join.saveFirst('s2cloudless').apply({
        'primary': s2_sr_col,
        'secondary': s2_cloudless_col,
        'condition': ee.Filter.equals({
            'leftField': 'system:index',
            'rightField': 'system:index'
          })
    }))}



//Apply the get_s2_sr_cld_col function to build a collection according to the parameters defined above.


var s2_sr_cld_col = get_s2_sr_cld_col(AOI, START_DATE, END_DATE)

//var s2_sr_cld_col_eval = get_s2_sr_cld_col(AOI, START_DATE, END_DATE)



//Define cloud mask component functions
// adding cloud propability and is_cloud to each sen2 image

var add_cloud_bands = function(img) {

    // Get s2cloudless image, subset the probability band.
    var cld_prb = ee.Image(img.get('s2cloudless')).select('probability')

    // Condition s2cloudless by the probability threshold value
    var is_cloud = cld_prb.gt(CLD_PRB_THRESH).rename('clouds')

    // Add the cloud probability layer and cloud mask as image bands.
    return img.addBands(ee.Image([cld_prb, is_cloud]))
}



//Cloud shadow components

var add_shadow_bands = function(img) {
    
    // Identify water pixels from the SCL band.
    // var not_water = img.select('SCL').neq(6) 
    
    var not_water = GLC10_LULC.neq(60)
    // Map.addLayer(not_water, {min: 10, max: 90, palette: discrete_colors}, 'NotWater', false)

    // Identify dark NIR pixels that are not water (potential cloud shadow pixels).
    var SR_BAND_SCALE = 1e4
    var dark_pixels = img.select('B8').lt(NIR_DRK_THRESH*SR_BAND_SCALE).multiply(not_water).rename('dark_pixels')

    // Determine the direction to project cloud shadow from clouds (assumes UTM projection).
    var shadow_azimuth = ee.Number(90).subtract(ee.Number(img.get('MEAN_SOLAR_AZIMUTH_ANGLE')));

    // Project shadows from clouds for the distance specified by the CLD_PRJ_DIST input.
    var cld_proj = (img.select('clouds').directionalDistanceTransform(shadow_azimuth, CLD_PRJ_DIST*10)
        .reproject({'crs': img.select(0).projection(), 'scale': 100})
        .select('distance')
        .mask()
        .rename('cloud_transform'))

    // Identify the intersection of dark pixels with cloud shadow projection.
    var shadows = cld_proj.multiply(dark_pixels).rename('shadows')

    // Add dark pixels, cloud projection, and identified shadows as image bands.
    return img.addBands(ee.Image([dark_pixels, cld_proj, shadows]))}



//Final cloud-shadow mask

var add_cld_shdw_mask = function(img) {
    // Add cloud component bands.
    var img_cloud = add_cloud_bands(img)

    // Add cloud shadow component bands.
    var img_cloud_shadow = add_shadow_bands(img_cloud)

    // Combine cloud and shadow mask, set cloud and shadow as value 1, else 0.
    var is_cld_shdw = img_cloud_shadow.select('clouds').add(img_cloud_shadow.select('shadows')).gt(0)

    // Remove small cloud-shadow patches and dilate remaining pixels by BUFFER input.
    // 20 m scale is for speed, and assumes clouds don't require 10 m precision.
    var is_cld_shdw = (is_cld_shdw.focal_min(2).focal_max(BUFFER*2/20)
        .reproject({'crs': img.select([0]).projection(), 'scale': 20})
        .rename('cloudmask'))

    // Add the final cloud-shadow mask to the image.
    return img_cloud_shadow.addBands(is_cld_shdw)
}




// Apply cloud and cloud shadow mask
//Define cloud mask application function

var apply_cld_shdw_mask = function(img) {
    // Subset the cloudmask band and invert it so clouds/shadow are 0, else 1.
    var not_cld_shdw = img.select('cloudmask').not()

    // Subset reflectance bands and update their masks, return the result.
    return img.select('B.*').updateMask(not_cld_shdw)
}

//Process the collection
var s2_cloudless = s2_sr_cld_col.map(add_cld_shdw_mask)
                            .map(apply_cld_shdw_mask)

var s2_cloudless = s2_cloudless.map(function(image){    // Necessary only for TOA image collections 
  return image.toFloat();
});

print('s2_cloudless', s2_cloudless)










////////////////// Mosaicing //////////////////////////

// Inspiration: https://code.earthengine.google.com/20ad3c83a17ca27b28640fb922819208


// Mosaic maker function (same code used for Sentinel 2)  - Inspiration: https://code.earthengine.google.com/20ad3c83a17ca27b28640fb922819208
var mosaick_maker = function(imageCollection, diff, temporalResolution, range, clip_feature){
  var temporal_composites = function(date, newlist) {
    date = ee.Date(date);
    newlist = ee.List(newlist);
    var filtered = imageCollection.filterDate(date, date.advance(temporalResolution, 'day'));
    var filtered_addedQA = filtered.map(function(image) {return image.addBands(image.metadata('system:time_start'))});
    var image = ee.Image(filtered_addedQA.median()).set('system:time_start', date)//.clip(clip_feature); //filtered_addedQA.first().get('system:time_start')); // date);      qualityMosaic('system:time_start'))                  //Change to qualityMosaic()
    return ee.List(ee.Algorithms.If(filtered.size(), newlist.add(image), newlist));
};
  var imageCollection_unfiltered = ee.ImageCollection(ee.List(range.iterate(temporal_composites, ee.List([]))));
  return imageCollection_unfiltered.limit(range.size().subtract(1), 'system:time_start');
}

// Mosaicking
var diff = end.difference(start, 'day');
var temporalResolution = 30; // days
var range = ee.List.sequence(0, diff.subtract(1), temporalResolution).map(function(day){return start.advance(day,'day')});
var sentinel2_mosaics = mosaick_maker(s2_cloudless, diff, temporalResolution, range, clip_feature)
 print("Range - Months",range)
 
// Adding month to metadata
var sentinel2_mosaics = sentinel2_mosaics.map(function(image) {
  var number_of_month = ee.Number.parse(image.get('system:index')).add(ee.Number(1))
  return image.set('month', number_of_month)
})

// Gap filling with constant value
// var sentinel2_mosaics = sentinel2_mosaics.map(function(image) {
//   return image.unmask(0);     //OBS: Selection bands deactivated .select(selection_bands)
// });

print('sentinel2_mosaics', sentinel2_mosaics)


// Map.addLayer(sentinel2_mosaics.first(), imageVisParam, 'Comp 1', false)






/////////////////////////// ATM CORRECTION SIAC


var siac = require('users/marcyinfeng/utils:SIAC');

var S2_boa = siac.get_sur(s2_cloudless.first()); 

var s2_cloudless = s2_cloudless.map(function(image){
  return siac.get_sur(image);
})

// var sentinel2_corrected = sentinel2_mosaics.map(function(image){
//   return siac.get_sur(image);
// })


// print("SIAC", S2_boa)

print("correct", sentinel2_corrected)


// Map.addLayer(sentinel2_corrected.filterMetadata('month', 'equals', 10), imageVisParamNDVI, 'Corrected Comp 10', false)

// Map.addLayer(S2_boa, imageVisParamNDVI, 'Corrected Comp 10', false)








/////////////////////////// Calculating Indices on Sentinel 2  //////////////////////////////////////////////

var sentinel2_mosaics = sentinel2_mosaics
                    .map(function(image) {
                    return image.addBands(image.normalizedDifference(['B8','B4']).select(['nd'], ['NDVI']));    //.addBands(image.metadata('system:time_start'))
                    })
                    .map(function(image) {
                    return image.addBands(image.normalizedDifference(['B3','B11']).select(['nd'], ['MNDWI']));
                    })
                    .select(['MNDWI','NDVI','B2','B3','B4', 'B8', 'B11','B12'],
                            ['MNDWI', 'NDVI', 'blue', 'green', 'red', 'nir', 'swir1', 'swir2'])


print('Sentinel 2 - With Indices', sentinel2)





// Map.addLayer(sentinel2.first().select('NDVI'), imageVisParamNDVI, 'NDVI', false)

// var NDVI_list = sentinel2.select(['NDVI'], ['NDVI']).toList(sentinel2.size());
// Map.addLayer(ee.Image(NDVI_list.get(6)), imageVisParamNDVI, 'NDVI 5', false)



//// ANALYZING PIXELS WITHIN CROP MASKS


var crop_mask = waPor17.eq(42).or(waPor17.eq(41))


var clipped_mosaics = sentinel2_mosaics.map(function(image){    
  return image.updateMask(crop_mask)})

print(clipped_mosaics, "Clipped")

// Map.addLayer(crop_mask, imageVisParamNDVI, 'Crop Mask', false)

Map.addLayer(clipped_mosaics.first(), imageVisParamNDVI, 'Clipped 1', false)

Map.addLayer(clipped_mosaics.filterMetadata('month', 'equals', 4), imageVisParamNDVI, 'Clipped 4', false)




/// PLOTTING NDVI VALUES

 var filtered_mosaic = clipped_mosaics.first().select("NDVI").neq(0)
 
 var filtered_mosaic = filtered_mosaic.updateMask(filtered_mosaic)

  
  


// Create a chart.
var chart = ui.Chart.image.series({
  imageCollection: clipped_mosaics.select('NDVI'),
  region: filtered_mosaic.geometry(),
  reducer: ee.Reducer.mean(),
  scale: 300,
}).setOptions({title: 'NDVI over time'});





// print(chart);





// Export.image.toDrive({
//   image: comp1,
//   description: 'Comp1',
//   scale: 10,
//   // region: clip_feature,
//   maxPixels: 2000000000000
// });

// var clipped1 = clipped_mosaics.first().toFloat();

// Export.image.toDrive({
//   image: clipped1,
//   description: 'clipped1',
//   scale: 10,
//   // region: clip_feature,
//   maxPixels: 2000000000000
// });