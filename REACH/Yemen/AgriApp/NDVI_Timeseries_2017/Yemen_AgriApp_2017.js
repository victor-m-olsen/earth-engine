/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var sand = /* color: #ffc82d */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([42.810000254861855, 16.30370712222573]),
            {
              "class": 1,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([42.83725269441765, 16.31240929481154]),
            {
              "class": 1,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([42.83218868379753, 16.328142388572406]),
            {
              "class": 1,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([42.80635364656609, 16.330613440162377]),
            {
              "class": 1,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([42.803950387288744, 16.31957583470135]),
            {
              "class": 1,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([42.80620273239273, 16.272979489009295]),
            {
              "class": 1,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([42.802254520722805, 16.282619128009074]),
            {
              "class": 1,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Point([42.797791324922024, 16.296624596857814]),
            {
              "class": 1,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Point([42.79813464767593, 16.308322515503296]),
            {
              "class": 1,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Point([42.80259784347671, 16.310381935898285]),
            {
              "class": 1,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Point([42.80062262424078, 16.33106399382271]),
            {
              "class": 1,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Point([42.80950744008998, 16.270903161555843]),
            {
              "class": 1,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Point([42.807619164943496, 16.27007923010621]),
            {
              "class": 1,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Point([42.811910699367324, 16.269090507802076]),
            {
              "class": 1,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Point([42.80332763051967, 16.27749448864577]),
            {
              "class": 1,
              "system:index": "14"
            })]),
    water = /* color: #00ffff */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([42.78238769558022, 16.30492859343583]),
            {
              "class": 2,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([42.78489597444695, 16.31702227011943]),
            {
              "class": 2,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([42.78352268343132, 16.325424195763432]),
            {
              "class": 2,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([42.78461062144867, 16.297006622493377]),
            {
              "class": 2,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([42.791992060657655, 16.2914045659275]),
            {
              "class": 2,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([42.782035700794374, 16.28950971644453]),
            {
              "class": 2,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([42.777921746730605, 16.30558753620827]),
            {
              "class": 2,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Point([42.776205132961074, 16.297514286719124]),
            {
              "class": 2,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Point([42.787706445216934, 16.304928507904695]),
            {
              "class": 2,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Point([42.78907973623256, 16.312507199503667]),
            {
              "class": 2,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Point([42.79182631826381, 16.32222726579176]),
            {
              "class": 2,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Point([42.79131133413295, 16.28416798175285]),
            {
              "class": 2,
              "system:index": "11"
            })]),
    urban = /* color: #98ff00 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([42.81250547161985, 16.320593877507207]),
            {
              "class": 3,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([42.81430791607786, 16.31989371353149]),
            {
              "class": 3,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([42.81572412243772, 16.32203538368602]),
            {
              "class": 3,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([42.80995200863767, 16.32343569380459]),
            {
              "class": 3,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([42.80857871762205, 16.323023838927753]),
            {
              "class": 3,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([42.813900220307595, 16.316639977480552]),
            {
              "class": 3,
              "system:index": "5"
            })]),
    vegetation = /* color: #0b4a8b */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([42.82818001787397, 16.302861354592846]),
            {
              "class": 4,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([42.827804508611884, 16.303196021212056]),
            {
              "class": 4,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([42.82466632406446, 16.302719422605534]),
            {
              "class": 4,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([42.82514912168714, 16.301766906100756]),
            {
              "class": 4,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([42.82212317353557, 16.301451638170068]),
            {
              "class": 4,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([42.82086253529857, 16.302069488235706]),
            {
              "class": 4,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([42.823077687403156, 16.305618546162943]),
            {
              "class": 4,
              "system:index": "6"
            })]),
    aoi = 
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
    imageVisParamElevation = {"opacity":1,"bands":["elevation"],"min":8.600000000000001,"max":85.4,"gamma":1};
/***** End of imports. If edited, may not auto-convert in the playground. *****/
 
// Defining AOI
var clip_feature = aoi  ///SELECT AOI
 
// Defining reference data 
var training_points = sand.merge(water).merge(urban).merge(vegetation)
print(training_points)



var WaPor_LULC = ee.Image("users/pedrovieirac/WaPor_LULC_17")

var GLC10_LULC = ee.Image("users/pedrovieirac/GLC10m_Yemen")


// Map.addLayer(WaPor_LULC,{min: 10, max: 90, palette: discrete_colors}, 'Wapor Map', false)

// Map.addLayer(GLC10_LULC,{min: 10, max: 90, palette: discrete_colors}, 'GLC Map', false)

 


/////////////////////////// Loading Imagery

// Filters
var start = ee.Date('2017-01-01');
var end = ee.Date('2017-12-31');


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

// Map.addLayer(ee.Image(listOfImages.get(0)), imageVisParam, 'img1', false)
// Map.addLayer(ee.Image(listOfImages.get(1)), imageVisParam, 'img2', false)
// Map.addLayer(ee.Image(listOfImages.get(2)), imageVisParam, 'img3', false)
// Map.addLayer(ee.Image(listOfImages.get(3)), imageVisParam, 'img4', false)
// Map.addLayer(ee.Image(listOfImages.get(4)), imageVisParam, 'img5', false)
// Map.addLayer(ee.Image(listOfImages.get(5)), imageVisParam, 'img6', false)
// Map.addLayer(ee.Image(listOfImages.get(6)), imageVisParam, 'img7', false)
// Map.addLayer(ee.Image(listOfImages.get(7)), imageVisParam, 'img8', false)
// Map.addLayer(ee.Image(listOfImages.get(8)), imageVisParam, 'img9', false)
// Map.addLayer(ee.Image(listOfImages.get(9)), imageVisParam, 'img10', false)




/////////////////////////// Cloud Masking Sentinel 2
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




/////////////////////////// Comparing before and after cloud mask on Sentinel 2




// Map.addLayer(s2_cloudless.select(['B2','B3','B4'], ['blue', 'green', 'red']).first(), imageVisParam, 'Cloud Masked', false)

// Map.addLayer(sentinel2.select(['B2','B3','B4'], ['blue', 'green', 'red']).first(), imageVisParam, 'Original', false)


var cloudless_list = s2_cloudless.select(['B2','B3','B4'], ['blue', 'green', 'red']).toList(s2_cloudless.size());
// var cloudless_list = ee.Image(s2_cloudless.toList(s2_cloudless.size()));

// Map.addLayer(ee.Image(listOfImages.get(16)), imageVisParam, 'Img 15', false)

// Map.addLayer(ee.Image(cloudless_list.get(16)), imageVisParam, 'Cloud Masked 15', false)





/////////////////////////// Calculating Indices on Sentinel 2


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


// Map.addLayer(sentinel2.first().select('MNDWI'), imageVisParamMNDWI, 'MNDWI', false)
// Map.addLayer(sentinel2.first().select('NDVI'), imageVisParamNDVI, 'NDVI', false)

// var NDVI_list = sentinel2.select(['NDVI'], ['NDVI']).toList(sentinel2.size());
// Map.addLayer(ee.Image(NDVI_list.get(6)), imageVisParamNDVI, 'NDVI 5', false)




////////////////// Mosaicing

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
 print("Range",range)
 
// Adding month to metadata
var sentinel2_mosaics = sentinel2_mosaics.map(function(image) {
  var number_of_month = ee.Number.parse(image.get('system:index')).add(ee.Number(1))
  return image.set('month', number_of_month)
})

// Gap filling with constant value
var sentinel2_mosaics = sentinel2_mosaics.map(function(image) {
  return image.unmask(0);     //OBS: Selection bands deactivated .select(selection_bands)
});

print('sentinel2_mosaics', sentinel2_mosaics)


// Map.addLayer(sentinel2_mosaics.first(), imageVisParam, 'Comp 1', false)



// Visualizing composites

// Map.addLayer(sentinel2_mosaics.filterMetadata('month', 'equals', 1), imageVisParam, 'Comp 1', false)
// Map.addLayer(sentinel2_mosaics.filterMetadata('month', 'equals', 2), imageVisParam, 'Comp 2', false)
// Map.addLayer(sentinel2_mosaics.filterMetadata('month', 'equals', 3), imageVisParam, 'Comp 3', false)
Map.addLayer(sentinel2_mosaics.filterMetadata('month', 'equals', 4), imageVisParamNDVI, 'Comp 4', false)
// Map.addLayer(sentinel2_mosaics.filterMetadata('month', 'equals', 5), imageVisParam, 'Comp 5', false)
// Map.addLayer(sentinel2_mosaics.filterMetadata('month', 'equals', 6), imageVisParam, 'Comp 6', false)
// Map.addLayer(sentinel2_mosaics.filterMetadata('month', 'equals', 7), imageVisParam, 'Comp 7', false)
// Map.addLayer(sentinel2_mosaics.filterMetadata('month', 'equals', 8), imageVisParam, 'Comp 8', false)
// Map.addLayer(sentinel2_mosaics.filterMetadata('month', 'equals', 9), imageVisParam, 'Comp 9', false)
Map.addLayer(sentinel2_mosaics.filterMetadata('month', 'equals', 10), imageVisParamNDVI, 'Comp 10', false)
// Map.addLayer(sentinel2_mosaics.filterMetadata('month', 'equals', 11), imageVisParam, 'Comp 11', false)
// Map.addLayer(sentinel2_mosaics.filterMetadata('month', 'equals', 12), imageVisParam, 'Comp 12', false)




/////////////////////////////////// Making morphed Sentinel 2 time-series

// // Erosion followed by a dilation
// var kernel = ee.Kernel.circle({radius: 3});

// var sentinel2_mosaics_morphed_ndvi = sentinel2_mosaics.select(['NDVI'], ['NDVI_morphed']).map(function(image) {
//   var opened = image.focal_min({kernel: kernel, iterations: 2}).focal_max({kernel: kernel, iterations: 2});
//   var open_closed = image.focal_min({kernel: kernel, iterations: 2}).focal_max({kernel: kernel, iterations: 2});
//   return open_closed.copyProperties(image, ['system:time_start']).copyProperties(image)
// })

// var sentinel2_mosaics_morphed_optical = sentinel2_mosaics.select(['red', 'green', 'blue'], ['red_morphed', 'green_morphed', 'blue_morphed']).map(function(image) {
//   var opened = image.focal_min({kernel: kernel, iterations: 2}).focal_max({kernel: kernel, iterations: 2});
//   var open_closed = image.focal_min({kernel: kernel, iterations: 2}).focal_max({kernel: kernel, iterations: 2});
//   return open_closed.copyProperties(image, ['system:time_start']).copyProperties(image)
// })


// var optical_visparam_morph = {"opacity":1,"bands":["red_morphed","green_morphed","blue_morphed"],"min":-0.05753451829640069,"max":0.37524966967861584,"gamma":1}

// Map.addLayer(sentinel2_mosaics_morphed_optical.first(), imageVisParamMorph, 'Morph', false)





/////////////////////////////////// ANALYZING PIXELS WITHIN CROP MASKS

var crop_mask = GLC10_LULC.eq(10)

var clipped_mosaics = sentinel2_mosaics.map(function(image){    
  return image.updateMask(crop_mask)})

print(clipped_mosaics, "Clipped")

// Map.addLayer(crop_mask, imageVisParamNDVI, 'Crop Mask', false)

Map.addLayer(clipped_mosaics.first(), imageVisParamNDVI, 'Clipped 1', false)

Map.addLayer(clipped_mosaics.filterMetadata('month', 'equals', 4), imageVisParamNDVI, 'Clipped 4', false)


/////////////////////////////////// PLOTTING NDVI VALUES

 var filtered_mosaic = clipped_mosaics.first().select("NDVI").neq(0)
 
 var filtered_mosaic = filtered_mosaic.updateMask(filtered_mosaic)

  var ROI2 = filtered_mosaic.reduceToVectors(
  {scale: 100,
  bestEffort: true,
  maxPixels: 1e8
  });
  
  
//   var ROI_final = featureCol.map(function(feature) {
//   return feature.simplify({maxError: 100});
// })
  
  

// Create a chart.
var chart = ui.Chart.image.series({
  imageCollection: clipped_mosaics.select('NDVI'),
  region: ROI2,
  reducer: ee.Reducer.mean(),
  scale: 30,
}).setOptions({title: 'NDVI over time'});



Map.addLayer(ROI2, {palette: '000000'}, 'ROI2', false)


print(ROI2, "ROI2");

print(chart);







// /////////////////////////////// Layer Stacking ////////////////////////////////////////////

// Combine all image collections
var image_collection = sentinel2_mosaics
//.merge(sentinel2_mosaics_morphed_optical)
.merge(elevation)
.merge(slope)

print('combined image collection', image_collection)



// Layer stack maker
var layer_stacker = function(image_collection) {
  var first = ee.Image(image_collection.first()).select([]);
  var appendBands = function(image, previous) {   //Previous = result of previous iteration, NOT previous image
    return ee.Image(previous).addBands(image);
  };
  return ee.Image(image_collection.iterate(appendBands, first));   //First is the starting image to be used as starting point for adding onto for each interation
};

// Convert image collection to layer stack
var layer_stack = layer_stacker(image_collection) //.select(feature_selection)


print('layer_stack', layer_stack)







print(training_points)

// /////////////////////////////// Sampling ////////////////////////////////////////////
// OBS: Used feature subset if feature selection has been conducted by adding selection to layer_stack: .select(feature_selection)

var training_sample = training_points.map(function(feature) {
                            return layer_stack.sample({
                            region: ee.Feature(feature).geometry(),
                            scale: 10,
                            tileScale: 16,
                            geometries: true
                            }).first().set('class', feature.get('class'))});


print(training_sample)

 




// /////////////////////////////// Training and Classification ////////////////////////////////////////////

var classifier = ee.Classifier.smileRandomForest(500)

var trained_classifier = classifier.train(training_sample, 'class', training_sample.first().propertyNames().remove('system:index'));

var classified_image = layer_stack.classify(trained_classifier).clip(clip_feature);




// Define a palette for the 4 distinct land cover classes.
var discrete_colors = [
  'ffd588', //sand
  '92c1fd', // water
  'bec5cd', // urban
  '469b58', // shrub, grass
];

Map.addLayer(classified_image, {min: 1, max: 4, palette: discrete_colors}, 'Classified Map', false)








// Export classification
Export.image.toDrive({
  image: classified_image,
  description: 'classification_result_test',
  scale: 10,
  region: clip_feature,
  maxPixels: 2000000000000
});




var comp4 = ee.Image(sentinel2_mosaics.filterMetadata('month', 'equals', 4).select());

var comp1 = sentinel2_mosaics.first().toFloat();

Export.image.toDrive({
  image: comp1,
  description: 'Comp1',
  scale: 10,
  // region: clip_feature,
  maxPixels: 2000000000000
});

var clipped1 = clipped_mosaics.first().toFloat();

Export.image.toDrive({
  image: clipped1,
  description: 'clipped1',
  scale: 10,
  // region: clip_feature,
  maxPixels: 2000000000000
});