/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geom_display = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[35.743866431156846, 33.01397320531795],
          [35.743866431156846, 32.71897162150306],
          [36.23241470996544, 32.71897162150306],
          [36.23241470996544, 33.01397320531795]]], null, false),
    dam_Tishrin = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Point([38.17848300813228, 36.380737152690656]),
    snow_areas = 
    /* color: #00ff00 */
    /* shown: false */
    ee.Geometry.MultiPolygon(
        [[[[35.83039035468869, 33.412768865868905],
           [35.74352969795041, 33.36661721020825],
           [35.752799412305876, 33.356294233901394],
           [35.714347263868376, 33.343962407446995],
           [35.72396030097775, 33.280267989082944],
           [35.801551243360564, 33.278832894373785],
           [35.91620995302133, 33.361861083177324],
           [36.01476169205263, 33.45953168055826],
           [36.04889395731692, 33.53468535840401],
           [36.22658312023561, 33.643145220682136],
           [37.04174071175111, 34.03831283394539],
           [37.07298191930285, 34.217018361191265],
           [36.9887694119792, 34.34801654232825],
           [36.53148791028133, 34.484629716716704],
           [36.537252499530034, 34.156698082804986],
           [35.96310626599739, 33.75157308656312]]],
         [[[38.80346271378933, 35.1424901094253],
           [37.89709064347683, 35.1245205784653],
           [37.39721271378933, 34.8499944302163],
           [37.45763751847683, 34.74850261632863],
           [37.53179523332058, 34.67851338666922],
           [38.13878986222683, 34.637847307993916],
           [38.58373615128933, 34.75075934712711],
           [38.84740802628933, 34.97161955512773]]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var palette = ["white", "red", "yellow", "blue"]

// Defining AOI
var aoi_name = 'AOI_WoS'
var aoi_fc = ee.FeatureCollection('users/estherbarvels/SY_Water/AOIs/'+aoi_name)
var clip_feature = aoi_fc.geometry()

// Export.table.toAsset(ee.FeatureCollection(error_wetlands), 'error_wetlands', 'users/estherbarvels/SY_Water/error_areas/error_wetlands')


var aoi_syria = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017").filterMetadata('country_na', 'equals', 'Syria')


var elevation = ee.Image('USGS/SRTMGL1_003').select('elevation').clip(clip_feature);
var slope = ee.Terrain.slope(elevation);
Map.setOptions("hybrid")
Map.centerObject(aoi_fc, 10)
Map.addLayer(aoi_syria, {}, "Syria borders",false)
Map.addLayer(elevation, {min:150,max:1200}, "Elevation",false)
Map.addLayer(slope, {min:0,max:7}, "slope",false)



/////////////////////////// Loading Imagery //////////////////////////////////////////////

// Filters
var start = ee.Date('2020-01-01');
var end = ee.Date('2020-12-31');

// Loading and filtering imageCollections
var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR')
                    .filterDate(start, end)
                    .filterBounds(clip_feature);
var dem = ee.Image('USGS/SRTMGL1_003');
var elevation = dem.select('elevation');
var slope = ee.Terrain.slope(elevation);
var HAND = ee.Image("MERIT/Hydro/v1_0_1").select('hnd');

var sentinel1 = ee.ImageCollection('COPERNICUS/S1_GRD')
                  .sort('system:time_start')
                  .filterBounds(clip_feature.buffer(4000))  //Geometry, not feature!!   sen1_selection
                  .filterDate(start, end)
                  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
                  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
                  .filter(ee.Filter.eq('instrumentMode', 'IW'))
                  .select(['VV', 'VH']);
                  // .map(function(image) {
                  //   return image.unitScale(-30, 30).copyProperties(image, ['system:time_start']);        //No clamping performed, may be a problem for outliers
                  // });

var sentinel1_DES = sentinel1.filterMetadata('orbitProperties_pass', 'equals', 'DESCENDING');
var sentinel1_AS = sentinel1.filterMetadata('orbitProperties_pass', 'equals', 'ASCENDING');



//////////////////////////// Processing sentinel1_AS /////////////////////////////////////////////////////////

// Composites
var months = ee.List.sequence(1, 331, 30);
// print("months", months)
var sentinel1_mosaics_unfiltered = ee.ImageCollection(months.map(function(m) {
  var time_period = sentinel1_AS.filter(ee.Filter.calendarRange({ 
    start: m,
    end: ee.Number(m).add(30),
    field: 'day_of_year'
  }));
  var composite = ee.Image(time_period.mean());
  return composite.set('system:time_start', m).clip(clip_feature);
}));
// print('sentinel1_mosaics_unfiltered', sentinel1_mosaics_unfiltered)

//Filters out images outside of current temporal scope
var sentinel1_AS_mosaics = sentinel1_mosaics_unfiltered.map(function(image) {
  return ee.Algorithms.If(ee.Number(image.bandNames().size().gt(0)), image.set('approved','true'), image.set('approved','false'));
}).filterMetadata('approved', 'equals', 'true').select(['VV', 'VH'], ['VV_AS', 'VH_AS']);
// print('sentinel1_AS_mosaics', sentinel1_AS_mosaics)


// Adding month to metadata
var sentinel1_AS_mosaics = sentinel1_AS_mosaics.map(function(image) {
  var number_of_month = ee.Number.parse(image.get('system:index')).add(ee.Number(1));
  return image.set('month', number_of_month);
});
print('sentinel1_AS_mosaics', sentinel1_AS_mosaics)


//////////////////////////// Processing sentinel1_DES /////////////////////////////////////////////////////////

// Composites
var months = ee.List.sequence(1, 331, 30);
var sentinel1_mosaics_unfiltered = ee.ImageCollection(months.map(function(m) {
  var time_period = sentinel1_DES.filter(ee.Filter.calendarRange({ 
    start: m,
    end: ee.Number(m).add(30),
    field: 'day_of_year'
  }));
  var composite = ee.Image(time_period.mean());
  return composite.set('system:time_start', m).clip(clip_feature);
}));

//Filters out images outside of current temporal scope
var sentinel1_DES_mosaics = sentinel1_mosaics_unfiltered.map(function(image) {
  return ee.Algorithms.If(ee.Number(image.bandNames().size().gt(0)), image.set('approved','true'), image.set('approved','false'));
}).filterMetadata('approved', 'equals', 'true').select(['VV', 'VH'], ['VV_DES', 'VH_DES']);

// Adding month to metadata
var sentinel1_DES_mosaics = sentinel1_DES_mosaics.map(function(image) {
  var number_of_month = ee.Number.parse(image.get('system:index')).add(ee.Number(1));
  return image.set('month', number_of_month);
});

// Adding copying the April sentinel1_Des to fill in time-series gap for Jan-March
var sentinel1_DES_mosaics = sentinel1_DES_mosaics.merge(ee.ImageCollection([
  sentinel1_DES_mosaics.first().set('month', 1),
  sentinel1_DES_mosaics.first().set('month', 2),
  sentinel1_DES_mosaics.first().set('month', 3),
  sentinel1_DES_mosaics.first().set('month', 4)])) // OBS: Some areas might have April coverage



//Map.addLayer(sentinel1_DES_mosaics.filterMetadata('month', 'equals', 8), '', 'month 8')


/////////////////////////// Cloud Masking Sentinel 2  //////////////////////////////////////////////
// Original code: https://developers.google.com/earth-engine/tutorials/community/sentinel-2-s2cloudless

//adjust the parameters 
// find images with clouds -> visualise ->  keep CLD_PROB_THRESH as low as possible, will otherwise exclude steep terrain

var AOI = clip_feature;
var START_DATE = start;
var END_DATE = end;
var CLOUD_FILTER = 32;         //Maximum image cloud cover percent allowed in image collection
var CLD_PRB_THRESH = 45;        //Cloud probability (%); values greater than are considered cloud (the lower, the more pixels are considered clouds)
var NIR_DRK_THRESH = 0.19;      //Near-infrared reflectance; values less than are considered potential cloud shadow (the higher the th, the more pixels are considered as shadows)
var CLD_PRJ_DIST = 3.3;          //Maximum distance (km) to search for cloud shadows from cloud edges
var BUFFER = 33;               //Distance (m) to dilate the edge of cloud-identified objects



// Import and filter S2 SR.
// Loading s2cloudless collections based on predefined parameters
// Joining the two collections by adding a s2_cloudless_col image as a a property to the corresponding sen2 image

var s2_sr_col = sentinel2.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', CLOUD_FILTER));


print('sentinel2',sentinel2.size())
print('s2_sr_col',s2_sr_col.size())

var get_s2_sr_cld_col = function(aoi, start_date, end_date) {
    
    // Import and filter s2cloudless.
    var s2_cloudless_col = ee.ImageCollection('COPERNICUS/S2_CLOUD_PROBABILITY')
        .filterBounds(aoi)
        .filterDate(start_date, end_date);

    // Join the filtered s2cloudless collection to the SR collection by the 'system:index' property.
    return ee.ImageCollection(ee.Join.saveFirst('s2cloudless').apply({
        'primary': s2_sr_col,
        'secondary': s2_cloudless_col,
        'condition': ee.Filter.equals({
            'leftField': 'system:index',
            'rightField': 'system:index'
          })
    }))};

 
// Apply the get_s2_sr_cld_col function to build a collection according to the parameters defined above.
// This produces a filtered Sentinel2 collection joined with the Sen2Cloudless images
var s2_sr_cld_col_eval = get_s2_sr_cld_col(AOI, START_DATE, END_DATE)


//Define cloud mask component functions
// adding cloud propability and is_cloud to each sen2 image

var add_cloud_bands = function(img) {

    // Get s2cloudless image, subset the probability band.
    var cld_prb = ee.Image(img.get('s2cloudless')).select('probability');

    // Condition s2cloudless by the probability threshold value
    var is_cloud = cld_prb.gt(CLD_PRB_THRESH).rename('clouds');

    // Add the cloud probability layer and cloud mask as image bands.
    return img.addBands(ee.Image([cld_prb, is_cloud]));
};



//Cloud shadow components

var add_shadow_bands = function(img) {
    
    // Identify water pixels from the SCL band.
    var not_water = img.select('SCL').neq(6);

    // Identify dark NIR pixels that are not water (potential cloud shadow pixels).
    var SR_BAND_SCALE = 1e4;
    var dark_pixels = img.select('B8').lt(NIR_DRK_THRESH*SR_BAND_SCALE).multiply(not_water).rename('dark_pixels');

    // Determine the direction to project cloud shadow from clouds (assumes UTM projection).
    var shadow_azimuth = ee.Number(90).subtract(ee.Number(img.get('MEAN_SOLAR_AZIMUTH_ANGLE')));

    // Project shadows from clouds for the distance specified by the CLD_PRJ_DIST input.
    var cld_proj = (img.select('clouds').directionalDistanceTransform(shadow_azimuth, CLD_PRJ_DIST*10)
        .reproject({'crs': img.select(0).projection(), 'scale': 100})
        .select('distance')
        .mask()
        .rename('cloud_transform'));

    // Identify the intersection of dark pixels with cloud shadow projection.
    var shadows = cld_proj.multiply(dark_pixels).rename('shadows');

    // Add dark pixels, cloud projection, and identified shadows as image bands.
    return img.addBands(ee.Image([dark_pixels, cld_proj, shadows]))};


//Final cloud-shadow mask

var add_cld_shdw_mask = function(img) {
    // Add cloud component bands.
    var img_cloud = add_cloud_bands(img);

    // Add cloud shadow component bands.
    var img_cloud_shadow = add_shadow_bands(img_cloud);

    // Combine cloud and shadow mask, set cloud and shadow as value 1, else 0.
    var is_cld_shdw = img_cloud_shadow.select('clouds').add(img_cloud_shadow.select('shadows')).gt(0);

    // Remove small cloud-shadow patches and dilate remaining pixels by BUFFER input.
    // 20 m scale is for speed, and assumes clouds don't require 10 m precision.
    var is_cld_shdw = (is_cld_shdw.focal_min(2).focal_max(BUFFER*2/20)
        .reproject({'crs': img.select([0]).projection(), 'scale': 20})
        .rename('cloudmask'));

    // Add the final cloud-shadow mask to the image.
    return img_cloud_shadow.addBands(is_cld_shdw);
};



// Apply cloud and cloud shadow mask
//Define cloud mask application function

var apply_cld_shdw_mask = function(img) {
    // Subset the cloudmask band and invert it so clouds/shadow are 0, else 1.
    var not_cld_shdw = img.select('cloudmask').not();

    // Subset reflectance bands and update their masks, return the result.
    // Selects all bands starting with B + the terrain shadow layer calcualted earlier
    return img.select('B.*').updateMask(not_cld_shdw);
};
//, 'shadow']
//Process the collection
var s2_cloudless = s2_sr_cld_col_eval.map(add_cld_shdw_mask).map(apply_cld_shdw_mask);




/////////////////////////// Calculating Indices on Sentinel 2  //////////////////////////////////////////////
// MNDWI 
var sentinel2 = s2_cloudless
                    .map(function(image) {
                    return image.addBands(image.normalizedDifference(['B8','B4']).select(['nd'], ['NDVI']));    //.addBands(image.metadata('system:time_start'))
                    })
                    .map(function(image) {
                    return image.addBands(image.normalizedDifference(['B3','B11']).select(['nd'], ['MNDWI']));
                    })
                    .select(['MNDWI','NDVI','B2','B3','B4', 'B8', 'B11','B12'],
                            ['MNDWI', 'NDVI', 'blue', 'green', 'red', 'nir', 'swir1', 'swir2']);
print('sentinel2', sentinel2)
//Adding hillshadow as a band
//var sentinel2 = sentinel2.map(hillshadow);



////////////////// Mosaicing //////////////////////////

// Inspiration: https://code.earthengine.google.com/20ad3c83a17ca27b28640fb922819208


// Mosaic maker function (same code used for Sentinel 2)  - Inspiration: https://code.earthengine.google.com/20ad3c83a17ca27b28640fb922819208
var mosaick_maker = function(imageCollection, diff, temporalResolution, range, clip_feature){
  var temporal_composites = function(date, newlist) {
    date = ee.Date(date);
    newlist = ee.List(newlist);
    var filtered = imageCollection.filterDate(date, date.advance(temporalResolution, 'day'));
    var filtered_addedQA = filtered.map(function(image) {return image.addBands(image.metadata('system:time_start'))});
    var image = ee.Image(filtered_addedQA.median()).set('system:time_start', date).clip(clip_feature); //filtered_addedQA.first().get('system:time_start')); // date);      qualityMosaic('system:time_start'))                  //Change to qualityMosaic()
    return ee.List(ee.Algorithms.If(filtered.size(), newlist.add(image), newlist));
};
  var imageCollection_unfiltered = ee.ImageCollection(ee.List(range.iterate(temporal_composites, ee.List([]))));
  return imageCollection_unfiltered.limit(range.size().subtract(1), 'system:time_start');
};

// Mosaicking
var diff = end.difference(start, 'day');
var temporalResolution = 30; // days ; maybe 14 - quantify how much gap area there is 
var range = ee.List.sequence(0, diff.subtract(1), temporalResolution).map(function(day){return start.advance(day,'day')});
var sentinel2_mosaics = mosaick_maker(sentinel2, diff, temporalResolution, range, clip_feature);

print('range', range)

var snow_mask_geom = ee.Image.constant(1).clip(snow_areas).mask()

// Adding month to metadata and mask snow 
var sentinel2_mosaics = sentinel2_mosaics.map(function(image) {
  var number_of_month = ee.Number.parse(image.get('system:index')).add(ee.Number(1)); // adds number of the month
  var ndsi = image.normalizedDifference(['green','swir1']).select(['nd'], ['NDSI']);
  var snow_mask = ndsi.lt(0)
  var snow_mask = snow_mask.where(snow_mask_geom.neq(1), 1);
  return image.set('month', number_of_month)
               .updateMask(snow_mask)
});


// Gap filling with constant value
// for pixels that don't have any value (in none of the time steps - maybe mean of nearest neighbourhood?)
var sentinel2_mosaics = sentinel2_mosaics.map(function(image) {
  return image.unmask(0);     //OBS: Selection bands deactivated .select(selection_bands) 
});





////////////////////////////////// Layer Stacking ////////////////////////////////////////////

// Combine all image collections
var image_collection_raw = ee.ImageCollection(sentinel2_mosaics.select(['MNDWI', 'NDVI', 'blue', 'green', 'red', 'nir', 'swir1', 'swir2']))
.merge(ee.ImageCollection(sentinel1_AS_mosaics))
// .merge(ee.ImageCollection(sentinel1_DES_mosaics)) // exlucde as otherwise property 'VH_DES_1' is missing.
.merge(elevation.set('static', 'true')) // Setting a property to enable filtering later
.merge(slope.set('static', 'true'))
.merge(HAND.set('static', 'true'));

print('image_collection_raw', image_collection_raw)

// Layer stack maker
var layer_stacker = function(image_collection) {
  var first = ee.Image(image_collection.first()).select([]);
  var appendBands = function(image, previous) {   //Previous = result of previous iteration, NOT previous image
    return ee.Image(previous).addBands(image);
  };
  return ee.Image(image_collection.iterate(appendBands, first));   //First is the starting image to be used as starting point for adding onto for each interation
};



 
////////////////////////////////// Extract samples (points without features) to training samples  ////////////////////////////////////////////

//////// Load samples  ////////


var asset_name_samples = '2020_samples_'+aoi_name+'_1000' // 
var samples = ee.FeatureCollection('users/estherbarvels/SY_Water/samples/' + asset_name_samples)



// var samples = ee.FeatureCollection('users/estherbarvels/SY_Water/samples_error_areas/' + asset_name_samples)



Map.addLayer(samples, {}, 'samples', false )
Map.addLayer(aoi_fc, {}, 'AOI',false)



//////// Extract sample features for each month ////////
var image_combiner = function(imageCollection, featureCollection, range){
  
  //Filters an image collection, produces a subset and adds it to a list (this function is later iterated over the an image collection)
  var temporal_composites = function(range, list) {
    //newlist = ee.List(newlist);
    var filtered_imgCol = imageCollection.filterMetadata('month', 'equals', range)
                          .merge(image_collection_raw.filterMetadata('static', 'equals', 'true'))
    var filtered_fC = featureCollection.filterMetadata('month', 'equals', range)
    var layer_stack = layer_stacker(filtered_imgCol);
    
    // Sampling from one image
    var sample = layer_stack.sampleRegions({
      collection: filtered_fC,
      scale: 10, 
      geometries: true})
  
    //return ee.ImageCollection(list).merge(ee.ImageCollection(filtered))
    return ee.FeatureCollection(list).merge(sample)
    //return ee.Listfiltered//ee.List(newlist).add(filtered);
};

// Iterates the function above over a list of numbers signifying months
  return range.iterate(temporal_composites, ee.FeatureCollection([]));
};

var range = ee.List.sequence(1, 12, 1)


var training_sample = image_combiner(image_collection_raw, samples, range);



// Generic Function to remove a property from a feature
var removeProperty = function(feature, property) {
  var properties = ee.Feature(feature).propertyNames()
  var selectProperties = properties.filter(ee.Filter.neq('item', property))
  return feature.select(selectProperties)
}

// Removing property: month
var training_sample = ee.FeatureCollection(training_sample).map(function(feature) {
  return removeProperty(feature,'month')})
  
 
  
//// Export training samples ////
var asset_name_train_samples = '2020_train_'+aoi_name+'_1000' 

Export.table.toAsset(training_sample, asset_name_train_samples, 'users/estherbarvels/SY_Water/train_samples/' + asset_name_train_samples)

//// Export error training samples ////


// var asset_name_train_samples = '2020_train_error_salt_lake_2_20'
// var asset_name_train_samples = '2020_train_error_wetland_15'
// var asset_name_train_samples = '2020_train_error_shadows_terrain_20'
// Export.table.toAsset(training_sample, asset_name_train_samples, 'users/estherbarvels/SY_Water/train_samples_error_areas/' + asset_name_train_samples)


////////////////////////////////// Training and Classification ////////////////////////////////////////////
//// Loading training samples ////
var training_sample = ee.FeatureCollection('users/estherbarvels/SY_Water/train_samples/' + asset_name_train_samples)
print('training_sample size()', training_sample.size())
print('training_sample first()', training_sample.first())
print("asset_name_train_samples", asset_name_train_samples)


// // Combine training samples 
// var training_sample_error_1 = ee.FeatureCollection('users/estherbarvels/SY_Water/train_samples_error_areas/' + '2020_train_error_wetland_15')
// var training_sample_error_2 = ee.FeatureCollection('users/estherbarvels/SY_Water/train_samples_error_areas/' + '2020_train_error_salt_lake_2_20')
// var training_sample_error_3 = ee.FeatureCollection('users/estherbarvels/SY_Water/train_samples_error_areas/' + '2020_train_error_shadows_terrain_20')

var training_sample = training_sample
                  //.merge(training_sample_error_1).merge(training_sample_error_2)//.merge(training_sample_error_3)
                                    
                                   
//                   

print('training_sample with added error samples', training_sample.size())


/// Train the classifier 
print('Input properties', training_sample.first().propertyNames().remove('system:index').remove('classification'))


var classifier = ee.Classifier.smileRandomForest(500);
var trained_classifier = classifier.train(training_sample, 'class', training_sample.first().propertyNames().remove('system:index').remove('classification')); // .first().propertyNames().remove('system:index')
print(trained_classifier)

var trainAccuracy = trained_classifier.confusionMatrix();
print('Resubstitution error matrix: ', trainAccuracy);
print('Training overall accuracy: ', trainAccuracy.accuracy());
print('PA: ', trainAccuracy.producersAccuracy());
print('UA: ', trainAccuracy.consumersAccuracy());



/////// Classify, display, export /////// 

var clip_feature = aoi_fc

var classified_imgCol = ee.ImageCollection.fromImages(range.map(function(id){
  var image_collection_month = image_collection_raw.filterMetadata('month', 'equals', id)
                              .merge(image_collection_raw.filterMetadata('static', 'equals', 'true'))
  var layer_stack = layer_stacker(image_collection_month)
  var classified_image = layer_stack.classify(trained_classifier).clip(clip_feature).set('month', id);
  return classified_image
  
}))


/////// Display all classified images, if not exported yet. Otherwise comment this out ////
var listOfImages = classified_imgCol
                      .map(function(img){ return img.clip(geom_display) }) // clip to smaller area, otherwise too heavy
listOfImages = listOfImages.toList(classified_imgCol.size())
var len = listOfImages.size();
len.evaluate(function(l) {
  for (var i=0; i < l; i++) {
    // i = i+1
    var img = ee.Image(listOfImages.get(i)).clip(geom_display); 
    Map.addLayer(img, {palette: ['white', 'blue'], min:0, max:3}, 'Classified '+(i+1).toString(),false);
  } 
});
///////////////////




//// Export classified images ////
var asset_path = 'users/estherbarvels/SY_Water/classified/' + aoi_name + '/error_samples_added/wetland_saltLake/'
var asset_name = 'water_1000_'
var year = '2020_'
var descr = asset_name.concat(year)
var assetId =asset_path.concat(descr)


for (var i=1; i<13; i++){
  var id = i

  var image_collection_month = image_collection_raw.filterMetadata('month', 'equals', id)
                              .merge(image_collection_raw.filterMetadata('static', 'equals', 'true'))
  var layer_stack = layer_stacker(image_collection_month)
  var classified_image = layer_stack.classify(trained_classifier).clip(clip_feature);

  Export.image.toAsset({
  image: classified_image.toByte(),
  description: descr+id,
  assetId: assetId+id,
  scale: 10,
  region: aoi_fc, //geom_display, 
  maxPixels: 2000000000000
});

}


///////////////////////////////////// Reviewing previous outputs ////////////////////////////////////////////

var rgbVis = {
  min: 170, 
  max: 2400,
  bands:['red', 'green', 'blue']
}

var waterVis = {
  palette: ['red', 'white', 'blue'], 
  min: -0.9, 
  max: 0.9,
  bands:['MNDWI']
}

var classVis = {
  palette: ['white', 'blue'], 
  min: 0, 
  max: 3,
  bands:['classification']
}

var snowVis = {
  palette: ['green', 'white', 'blue'], 
  min: -1, 
  max: 1,
  bands:['NDSI']
}






var palette_GLAD = ["white", "red", "yellow", "blue"]
var start = ee.Date('2020-01-01');
var end = ee.Date('2020-12-31');
var GLAD = ee.ImageCollection('projects/glad/water/individualMonths')
            .filterDate(start, end)
            .map(function(img){return img.clip(aoi_fc)})
            
//Function for applying negative buffer around specified pixel values
var buffer = function (image) {
  var mask = image.mask().reduce(ee.Reducer.min())
  var negative_buffer = mask
    .focal_min({radius: 30, units: 'meters'})
  return image.updateMask(negative_buffer)
}

// Creating buffer and reclassing all values
// New classes:
// 3 = Water (GLAD 100)
// 2 = Water buffer (GLAD 100 within buffer) 
// 1 = Uncertain (GLAD 25-75) 
// 0 =Land (GLAD 0)
var GLAD = GLAD.map(function(image) {
  var GLAD_water = image.mask(image.eq(100)) // selecting water pixels
  var GLAD_buffer = buffer(GLAD_water) // cuts away a negative buffer around water pixels
  var img = image.where(GLAD_buffer.eq(100), 3) //reclass water outside of buffer (references buffered layer to know which pixels to reclass in the original)
  var img = img.where(img.eq(100), 2); // reclass water inside buffer
  var img = img.where(img.eq(0), 0); // reclass land
  var img = img.where(img.gt(3), 1); // reclass uncertain categories (px 25 50 and 77)
  return img})
  
var GLAD_imgCol_list = GLAD.toList(GLAD.size())



//// Load and display exported classification results ////
var asset_path = 'users/estherbarvels/SY_Water/classified/' + aoi_name + '/'
var asset_name = 'water_1000_' 
var year = '2020_'
var descr = asset_name.concat(year)
var assetId =asset_path.concat(descr)

var imgCol = ee.ImageCollection([
  ee.Image(assetId+1).set('month', 1),
  ee.Image(assetId+2).set('month', 2),
  ee.Image(assetId+3).set('month', 3),
  ee.Image(assetId+4).set('month', 4),
  ee.Image(assetId+5).set('month', 5),
  ee.Image(assetId+6).set('month', 6),
  ee.Image(assetId+7).set('month', 7),
  ee.Image(assetId+8).set('month', 8),
  ee.Image(assetId+9).set('month', 9),
  ee.Image(assetId+10).set('month', 10),
  ee.Image(assetId+11).set('month', 11),
  ee.Image(assetId+12).set('month', 12)
  ])
  
  

var listOfImages = imgCol//  .map(function(img){ return img.clip(geom_display) }) 
listOfImages = listOfImages.toList(imgCol.size())
var len = listOfImages.size();
len.evaluate(function(l) {
  for (var i=0; i < l; i++) {

    // var img = ee.Image(listOfImages.get(i)); 
    // Map.addLayer(img, {palette: ['white', 'blue'], min:0, max:3}, asset_name+(i+1).toString(),false, 0.5);
    
    var id = i+1
    var mosaick = sentinel2_mosaics.filterMetadata('month', 'equals', id).first().clip(geom_display);
    var img_GLAD = ee.Image(GLAD_imgCol_list.get(i))//.clip(geom_display);
    Map.addLayer(mosaick, waterVis, 'Sentinel-2 Mosaick MNDWI - '+ id,false);
    Map.addLayer(mosaick, rgbVis, 'Sentinel-2 Mosaick RGB -' + id,false);
    Map.addLayer(img_GLAD, {bands:['wp'], palette:palette_GLAD,min: 0, max: 3}, 'GLAD reclassified-'+id,false);
  } 
});
  
  
