/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var aoi = 
    /* color: #d63000 */
    /* shown: false */
    /* locked: true */
    ee.Geometry.Polygon(
        [[[42.924140080910576, 16.819755315621983],
          [42.924140080910576, 13.291504414325763],
          [51.606085881691826, 13.291504414325763],
          [51.606085881691826, 16.819755315621983]]], null, false),
    imageVisParam = {"opacity":1,"bands":["red","green","blue"],"min":200.72,"max":2875.28,"gamma":1},
    imageVisParamMNDWI = {"opacity":1,"bands":["MNDWI"],"min":0,"max":0.8,"palette":["ffffff","3d8cdc"]},
    table = ee.FeatureCollection("users/pedrovieirac/yem_adm3_polygons"),
    imageVisParamNDVI = {"opacity":1,"bands":["NDVI"],"min":0,"max":0.9,"palette":["ffffff","0cc219"]};
/***** End of imports. If edited, may not auto-convert in the playground. *****/
 
// CONSTANTES
var clip_feature = aoi  ///SELECT AOI
 
var yem_adm3  = ee.FeatureCollection("users/pedrovieirac/yem_adm3_polygons");

var yem_adm1  = ee.FeatureCollection("users/pedrovieirac/yem_adm1_polygons");


var WaPor_LULC17 = ee.Image("users/pedrovieirac/WaPor_LULC_17");

var WaPor_LULC18 = ee.Image("users/pedrovieirac/WaPor_LULC_18");

var WaPor_LULC19 = ee.Image("users/pedrovieirac/WaPor_LULC_19");

var WaPor_LULC20 = ee.Image("users/pedrovieirac/WaPor_LULC_20");


var GLC10_LULC = ee.Image("users/pedrovieirac/GLC10m_Yemen");


// Map.addLayer(WaPor_LULC,{min: 10, max: 90, palette: discrete_colors}, 'Wapor Map', false)


/////////////////////////////// LOADING IMAGE COLLECTIONS

var start = ee.Date('2021-01-01');
var end = ee.Date('2021-8-01');

// Loading and filtering imageCollections
var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR')
                    .filterDate(start, end)
                    .filterBounds(clip_feature)



//Visualizing images in the Sentinel-2 imageCollection
var listOfImages = sentinel2.select(['B2','B3','B4'], ['blue', 'green', 'red']).toList(sentinel2.size());

print('original sentinel2', sentinel2)

// Map.addLayer(ee.Image(listOfImages.get(0)), imageVisParam, 'img1', false)




/////////////////////////////// Cloud Masking Sentinel 2
// Original code: https://developers.google.com/earth-engine/tutorials/community/sentinel-2-s2cloudless

var AOI = clip_feature
var START_DATE = start
var END_DATE = end
var CLOUD_FILTER = 20         //Maximum image cloud cover percent allowed in image collection
var CLD_PRB_THRESH = 40       //Cloud probability (%); values greater than are considered cloud
var NIR_DRK_THRESH = 0.20     //Near-infrared reflectance; values less than are considered potential cloud shadow
var CLD_PRJ_DIST = 1          //Maximum distance (km) to search for cloud shadows from cloud edges
var BUFFER = 50               //Distance (m) to dilate the edge of cloud-identified objects


// Import and filter S2 SR. Loading s2cloudless collections based on predefined parameters
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
    var not_water = img.select('SCL').neq(6) 
    
    // var not_water = GLC10_LULC.neq(60)                                                                     ///Necessary for TOA imagery
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


// Apply cloud and cloud shadow mask. Define cloud mask application function
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

var cloudless_list = s2_cloudless.select(['B2','B3','B4'], ['blue', 'green', 'red']).toList(s2_cloudless.size());

// Map.addLayer(ee.Image(listOfImages.get(16)), imageVisParam, 'Img 15', false)

// Map.addLayer(ee.Image(cloudless_list.get(16)), imageVisParam, 'Cloud Masked 15', false)



/////////////////////////////// Calculating Indices on Sentinel 2

var sentinel2 = s2_cloudless
                    .map(function(image) {
                    return image.addBands(image.normalizedDifference(['B8','B4']).select(['nd'], ['NDVI']));    //.addBands(image.metadata('system:time_start'))
                    })
                    .map(function(image) {
                    return image.addBands(image.normalizedDifference(['B3','B11']).select(['nd'], ['MNDWI']));
                    })
                    .select(['MNDWI','NDVI','B2','B3','B4', 'B8', 'B11','B12'],
                            ['MNDWI', 'NDVI', 'blue', 'green', 'red', 'nir', 'swir1', 'swir2'])


print('Sentinel 2 - With Indices', sentinel2)


// var NDVI_list = sentinel2.select(['NDVI']).toList(sentinel2.size());

// Map.addLayer(sentinel2.first().select('NDVI'), imageVisParamNDVI, 'NDVI 1', false)
// Map.addLayer(ee.Image(NDVI_list.get(6)), imageVisParamNDVI, 'NDVI 5', false)



/////////////////////////////// COMPOSITING AND MOSAICKING
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
var sentinel2_mosaics = mosaick_maker(sentinel2, diff, temporalResolution, range, clip_feature)
// print("Range",range)
 
// Adding month to metadata
var sentinel2_mosaics = sentinel2_mosaics.map(function(image) {
  var number_of_month = ee.Number.parse(image.get('system:index')).add(ee.Number(1))
  var dataset_year = ee.Date(image.get('system:time_start')).get("year")
  return image.set('year', dataset_year).set('month', number_of_month)
})

// Gap filling with constant value
var sentinel2_mosaics = sentinel2_mosaics.map(function(image) {
  return image.unmask(0);     //OBS: Selection bands deactivated .select(selection_bands)
});


print('Sentinel 2 Mosaics', sentinel2_mosaics)


// Map.addLayer(sentinel2_mosaics.first(), imageVisParam, 'Comp 1', false)
// Map.addLayer(sentinel2_mosaics.filterMetadata('month', 'equals', 1), imageVisParamNDVI, 'Comp 1', false)
// Map.addLayer(sentinel2_mosaics.filterMetadata('month', 'equals', 4), imageVisParamNDVI, 'Comp 4', false)



var sentinel2_mosaics = sentinel2_mosaics.select("NDVI")

print('NDVI Mosaics', sentinel2_mosaics)


var listOfImages = sentinel2_mosaics.toList(sentinel2_mosaics.size());

// Export.image.toAsset({
//   image: ee.Image(listOfImages.get(6)),
//   description: 'Mosaic_2019_7_t3',
//   scale: 10,
//   region: clip_feature,
//   maxPixels: 2000000000000
// });



/////////////////////////////// APPLYING CROP MASKS AND FILTERING

// var crop_mask = GLC10_LULC.eq(10)
var crop_mask = WaPor_LULC19.eq(42).or(WaPor_LULC19.eq(41))

var clipped_mosaics = sentinel2_mosaics.map(function(image){    
  return image.updateMask(crop_mask)})
  
var filtered_mosaics = clipped_mosaics.map(function(image){    
  return image.updateMask(image.select("NDVI").gt(0))})


// print(filtered_mosaics, "Filtered")

var listOfImages = filtered_mosaics.toList(filtered_mosaics.size());

var comp7 = ee.Image(listOfImages.get(6));
var comp6 = ee.Image(listOfImages.get(5));


Map.addLayer(comp6, imageVisParamNDVI, 'Filtered 6', false)

Map.addLayer(comp7, imageVisParamNDVI, 'Filtered 7', false)


// Map.addLayer(comp6, imageVisParamNDVI, 'Filtered 7', false)





///////////////////////////////// EXPORTING RESULTS

var filtered_mosaics =filtered_mosaics.map(function(image){    
  return image.multiply(255).toByte()})

// Export.image.toAsset({
//   image: comp1,
//   description: 'Filtered_NDVI_2019_1_t2',
//   scale: 10,
//   // region: clip_feature,
//   maxPixels: 2000000000000
// });

var year = ee.Number(filtered_mosaics.first().get('year'))
var year = "2021"


var name_base = ee.String("Filtered_NDVI_").cat(ee.String(year)).cat(ee.String("_"))
var i;

for (i = 1; i < 8; i++) {
  var id  = i
  // var imageName = name_base.getInfo().concat(i)
  var image1 = ee.Image(listOfImages.get(i-1))
  
  // Export classification
  Export.image.toAsset({
  description:name_base.getInfo().concat(i),
  image:image1,
  // folder: 'Data/NDVI_Images_2020',
  scale: 10,
  region: WaPor_LULC18.geometry(),
  maxPixels: 2000000000000
})}


