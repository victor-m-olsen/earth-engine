/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cop_lc = ee.Image("users/victormackenhauer/Cop_LC"),
    geometry6 = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
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
    sample = ee.FeatureCollection("users/victormackenhauer/sample21_new_area"),
    fallow = ee.FeatureCollection("users/victormackenhauer/all_fallow_2017"),
    non_agri = ee.FeatureCollection("users/victormackenhauer/all_non_agri"),
    new_A = 
    /* color: #999900 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[26.24869879602352, 6.135902672971025],
          [27.03971442102352, 5.51838565716439],
          [29.15458258508602, 5.512917926571526],
          [29.14359625696102, 7.7662298279720074],
          [28.41300543664852, 6.899969023000838],
          [26.12784918664852, 6.719973596546869]]]),
    new_B = 
    /* color: #009999 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[29.02274664758602, 7.630138528643741],
          [29.03373297571102, 5.605862540674914],
          [32.60978278039852, 5.61132940757799],
          [32.34061774133602, 5.993879922365963],
          [31.84623297571102, 6.043045900444913],
          [31.11014899133602, 7.112602650054449],
          [29.90714606164852, 7.90227722203002],
          [29.312607109150235, 7.970093856781077]]]),
    new_C = 
    /* color: #ff00ff */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[26.94985087064549, 5.713228992015607],
          [26.98830301908299, 5.598434140102555],
          [27.29592020658299, 4.969407902867599],
          [27.66945536283299, 4.547893228695544],
          [28.28468973783299, 4.131610655575679],
          [29.57558329252049, 4.312393065802059],
          [30.50392801908299, 3.5835409074027056],
          [30.50392801908299, 5.724160642380826]]]),
    new_D = 
    /* color: #ff9999 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[30.427301702629393, 5.6853635939391225],
          [30.427301702629393, 3.643308646883988],
          [30.723932562004393, 3.4185165966388156],
          [32.22356635106689, 3.4239999705347235],
          [33.92644721044189, 3.7693871440230864],
          [33.47051459325439, 4.42687773884253],
          [32.54766303075439, 5.7072277488394025]]]),
    crop = ee.FeatureCollection("users/victormackenhauer/all_crop_2018"),
    geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[27.240640766488823, 4.185681926805138],
          [27.240640766488823, 3.6787620947435875],
          [27.699319965707573, 3.6787620947435875],
          [27.699319965707573, 4.185681926805138]]], null, false),
    geometry2 = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[31.25089071458054, 5.067286379358227],
          [31.25089071458054, 4.634881965952221],
          [31.91556356614304, 4.634881965952221],
          [31.91556356614304, 5.067286379358227]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/


//var feature_string = ee.List(['nir_12', 'nir_11', 'nir_10', 'NDVI_10', 'swir2_8', 'NDVI_12', 'swir2_12', 'ndwi', 'NDVI', 'red_12', 'NDVI_8', 'VH_2', 'red', 'ndwi_12', 'nir', 'NDVI_11', 'ndwi_8', 'NDVI_5', 'swir2', 'red_10', 'VH', 'ndwi_5', 'NDVI_7', 'ndwi_1', 'swir2_6', 'swir2_9', 'ndwi_7', 'NDVI_1', 'NDVI_2', 'swir2_7', 'VH_1', 'nir_8', 'swir2_11', 'std', 'blue_12', 'blue_5', 'swir2_10', 'ndwi_10', 'red_11', 'ndwi_11', 'nir_5', 'min', 'VV_2', 'VH_3', 'NDVI_6', 'swir2_1', 'blue', 'red_8', 'red_6', 'ndwi_6', 'max', 'swir2_2', 'swir2_5', 'blue_10', 'ndwi_2', 'red_5', 'VH_8', 'ndwi_4', 'NDVI_4', 'ndwi_9'])
//var layer_selection = feature_string
//var feature_selection = feature_string.add('class')
 




var clip_feature = geometry2
//var sample_asset = sample



////////////////////////////Loading and labeling training polygons////////////////////////////
//Rice has been excluded


//Fallow
//var fallow_reclassed = fallow.map(function(feature) {
//  return feature.set('class', 1);
//  });


//Non-agri  
var savanna_reclassed = non_agri.filterMetadata('label', 'equals', 'savanna').map(function(feature) {
  return feature.set('class', 2);
  });

var forest_reclassed = non_agri.filterMetadata('label', 'equals', 'forest').map(function(feature) {
  return feature.set('class', 3);
  });

var bare_reclassed = non_agri.filterMetadata('label', 'equals', 'bare').map(function(feature) {
  return feature.set('class', 4);
  });  
  
var grassland_reclassed = non_agri.filterMetadata('label', 'equals', 'grassland').map(function(feature) {
  return feature.set('class', 5);
  });  
  
var water_reclassed = non_agri.filterMetadata('label', 'equals', 'water').map(function(feature) {
  return feature.set('class', 6);
  });  

var artificial_reclassed = non_agri.filterMetadata('label', 'equals', 'artificial').map(function(feature) {
  return feature.set('class', 7);
  });



/*
//Crops
var beans_reclassed = crop.filterMetadata('LC_3', 'equals', 'Beans').map(function(feature) {
  return feature.set('class', 8);
});
var cassavaGr_reclassed = crop.filterMetadata('LC_3', 'equals', 'Cassava/Gr').map(function(feature) {
  return feature.set('class', 9);
});
var maize_reclassed = crop.filterMetadata('LC_3', 'equals', 'Maize').map(function(feature) {
  return feature.set('class', 10);
});
var millet_reclassed = crop.filterMetadata('LC_3', 'equals', 'Millet').map(function(feature) {
  return feature.set('class', 11);
});
var sesame_reclassed = crop.filterMetadata('LC_3', 'equals', 'Sesame').map(function(feature) {
  return feature.set('class', 12);
});
var sourghum_reclassed = crop.filterMetadata('LC_3', 'equals', 'Sourghum').map(function(feature) {
  return feature.set('class', 13);
});
*/





// Combining selected polygons and removing unsupported geometries
var training_points = savanna_reclassed.merge(forest_reclassed)
                                      .merge(bare_reclassed)
                                      .merge(grassland_reclassed)
                                      .merge(water_reclassed)
                                      .merge(artificial_reclassed)
                                      .merge(crop)
                                      .filterBounds(clip_feature);
                                            








/////////////////////////// Loading Imagery //////////////////////////////////////////////

// Filters
var sen2_selection = clip_feature.buffer(40000);
var sen1_selection = clip_feature.buffer(60000);
var selection_bands = ['NDVI', 'blue', 'red', 'nir', 'swir2'];
var start = ee.Date('2018-01-01');
var end = ee.Date('2019-01-30');


var data_clipper = function(image) {          // Currently not in use
    return image.clip(clip_feature);
};

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
var sentinel1 = ee.ImageCollection('COPERNICUS/S1_GRD')
                  .sort('system:time_start')
                  .filterBounds(sen1_selection)  //Geometry, not feature!!   sen1_selection
                  .filterDate(start, end)
                  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
                  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
                  .filter(ee.Filter.eq('instrumentMode', 'IW'))
                  .select(['VV', 'VH'])
                  .map(function(image) {
                    return image.unitScale(-30, 30).copyProperties(image, ['system:time_start']);        //No clamping performed, may be a problem for outliers
                  });
var landsat = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
                  .filterDate(start, end)
                  .filterBounds(sen2_selection)
                  .select(['B2', 'B3', 'B4','B5', 'B6', 'B7', 'BQA'],['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'BQA'])
                  .map(function(image) {
                  return image.addBands(image.normalizedDifference(['nir','red']).select(['nd'], ['NDVI']));
                  })
                  .sort('system:time_start');
var aqua = ee.ImageCollection('MODIS/006/MYD13Q1')
                  .filterDate(start, end)
                  .filterBounds(sen2_selection)
                  .select(['NDVI','sur_refl_b03', 'sur_refl_b01','sur_refl_b02', 'sur_refl_b07'], ['NDVI', 'blue', 'red', 'nir', 'swir2']) //error: ['NDVI','blue','green','red', 'nir'], error2: ['NDVI','sur_refl_b01','sur_refl_b02','sur_refl_b03', 'sur_refl_b07'], ['NDVI','red','nir','blue', 'swir2']
                  .sort('system:time_start');
var terra = ee.ImageCollection('MODIS/006/MOD13Q1')
                  .filterDate(start, end)
                  .filterBounds(sen2_selection)
                  .select(['NDVI','sur_refl_b03', 'sur_refl_b01','sur_refl_b02', 'sur_refl_b07'], ['NDVI', 'blue', 'red', 'nir', 'swir2']) //error: ['NDVI','blue','green','red', 'nir']
                  .sort('system:time_start');
var dem = ee.Image('USGS/SRTMGL1_003');
var elevation = dem.select('elevation');
var slope = ee.Terrain.slope(elevation);



var area = sentinel2.first().select(['blue'])


//var areaImage =area.multiply(ee.Image.pixelArea())

//print(areaImage)

//var img = ee.Image.pixelArea().divide(1000000);
//print(img)
//Map.addLayer(img)





// Sum the values of forest loss pixels in the Congo Republic.
var stats = area.reduceRegion({
  reducer: ee.Reducer.count(),
  geometry: geometry,
  scale: 30,
  maxPixels: 1e9
});

var dict = ee.Dictionary(stats)

var feature = ee.Feature(null, dict);

var fc = ee.FeatureCollection(feature)

// Export the FeatureCollection.
Export.table.toDrive({
  collection: fc,
  description: 'area_export',
  fileFormat: 'CSV'
});





//////AREA EXTRACTOR/////////////////////

    var countries = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw');
    var Nepal = countries.filterMetadata('Country', 'equals', 'Nepal');
    var scaleforTestArea = 30;
     
    // km square
    var img = ee.Image.pixelArea().divide(1000000);
     
    var area2 = img.reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: Nepal,
      crs: 'EPSG:32645', // WGS Zone N 45
      scale: scaleforTestArea,
      maxPixels: 1E13
    });
    // gives an area of 147134.49 km2
    //print('area of Nepal using pixel area method: ', ee.Number(area2.get('area')).getInfo() + ' km2');





/*
Export.table.toDrive(time_series.map(function(image) {
  
                            var area = image.select(['blue'])
                            
                            var stats = area.reduceRegion({
                            reducer: ee.Reducer.count(),
                            //geometry: new_D,
                            scale: 100,
                            maxPixels: 1e9
                            })
                            
                            var dict = ee.Dictionary(stats)
                            
                            var feature = ee.Feature(null, dict)
      
                            return feature}))
      
      


//var area = sentinel2_mosaics.first().select(['blue'])

var stats = area.reduceRegion({
  reducer: ee.Reducer.count(),
  geometry: clip_feature,
  scale: 100,
  maxPixels: 1e9
});

var dict = ee.Dictionary(stats)

var feature = ee.Feature(null, dict);

var fc = ee.FeatureCollection(feature)

// Export the FeatureCollection.
//Export.table.toDrive({
//  collection: fc,
//  description: 'sen2_area_export',
//  fileFormat: 'CSV'
//});



*/



















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


var landsat_mosaics = mosaic_maker(landsat_masked);













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
  return ee.Image(image).multiply(scale_factor).set('system:time_start', time_string).set('type', 'modis').clip(clip_feature);
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

var area = sentinel2_mosaics.first().select(['blue'])

var stats = area.reduceRegion({
  reducer: ee.Reducer.count(),
  geometry: clip_feature,
  scale: 100,
  maxPixels: 1e9
});

var dict = ee.Dictionary(stats)

var feature = ee.Feature(null, dict);

var fc = ee.FeatureCollection(feature)

// Export the FeatureCollection.
Export.table.toDrive({
  collection: fc,
  description: 'sen2_area_export',
  fileFormat: 'CSV'
});


/*


Export.table.toDrive(sentinel2_mosaics.map(function(image) {
  
                            var area = image.select(['blue'])
                            
                            var stats = area.reduceRegion({
                            reducer: ee.Reducer.count(),
                            geometry: clip_feature,
                            scale: 50,
                            maxPixels: 1e9
                            })
                            
                            var dict = ee.Dictionary(stats)
                            
                            var feature = ee.Feature(null, dict)
      
                            return feature}))
      



*/

















//////////////////////////////////// Correlating and adjusting values ///////////////////////
//beware of potential problem if no overlapping pixels exist for sen2 and landsat/modis


//Output: adjusted_landsat_mosaics
//Output: adjusted_modis_mosaics

var correlation_adjuster = function(image) {
  var time = image.get('system:time_start');
  var sen2_image = sentinel2_mosaics.filterMetadata('system:time_start', 'equals', time).first();
  //var sen2_image = sentinel2_mosaics.filterMetadata('system:time_start', 'not_less_than', time).first()
  
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

  var multiplication_factor_NDVI = ee.Number(sen2_mean.get('NDVI')).divide(ee.Number(filler_mean.get('NDVI')));
  var multiplication_factor_red = ee.Number(sen2_mean.get('red')).divide(ee.Number(filler_mean.get('red')));
  //var multiplication_factor_green = ee.Number(sen2_mean.get('green')).divide(ee.Number(filler_mean.get('green')))
  var multiplication_factor_blue = ee.Number(sen2_mean.get('blue')).divide(ee.Number(filler_mean.get('blue')));
  var multiplication_factor_nir = ee.Number(sen2_mean.get('nir')).divide(ee.Number(filler_mean.get('nir')));
  var multiplication_factor_swir2 = ee.Number(sen2_mean.get('swir2')).divide(ee.Number(filler_mean.get('swir2')));
  
  var ndvi = image.select('NDVI').multiply(ee.Image(multiplication_factor_NDVI)).set('system:time_start', time);
  var red = image.select('red').multiply(ee.Image(multiplication_factor_red));
  //var green = image.select('green').multiply(ee.Image(multiplication_factor_green))
  var blue = image.select('blue').multiply(ee.Image(multiplication_factor_blue));
  var nir = image.select('nir').multiply(ee.Image(multiplication_factor_nir));
  var swir2 = image.select('swir2').multiply(ee.Image(multiplication_factor_swir2));


  return ee.Algorithms.If(filler_mean.get('NDVI'), ee.Image(ndvi).addBands(ee.Image(blue)).addBands(ee.Image(red)).addBands(ee.Image(nir)).addBands(ee.Image(swir2)), ee.Algorithms.If(image.get('type'), image, null ));   //OBS: type refers to a property specifying MODIS or nothing  //.addBands(ee.Image(green))
};



var adjusted_landsat_mosaics = landsat_mosaics.map(correlation_adjuster, true);
var adjusted_modis_mosaics = modis_mosaics.map(correlation_adjuster, true);

//var adjusted_landsat_mosaics = landsat_mosaics
//var adjusted_modis_mosaics = modis_mosaics








////////////////////////////////// Gap filling Sentinel 2  //////////////////////////////////
//Output: sentinel2_optical_filled
//Output: sentinel2_NDVI_filled


// Filling gaps with Landsat
var sentinel2_mosaics_landsatFill = sentinel2_mosaics.map(function(image) {
  var time_stamp = ee.Date(image.get('system:time_start'));
  var landsat_filler = adjusted_landsat_mosaics.filterMetadata('system:time_start', 'equals', time_stamp).first();
  return ee.Algorithms.If(landsat_filler, image.select(selection_bands).unmask(landsat_filler.select(selection_bands).toFloat()), image.select(selection_bands).toFloat());
}, true);


// Filling gaps with MODIS
var sentinel2_modisFill = sentinel2_mosaics_landsatFill.map(function(image) {
  var time_stamp = ee.Date(image.get('system:time_start'));
  var modis_filler = adjusted_modis_mosaics.filterMetadata('system:time_start', 'equals', time_stamp).first().toFloat();  //filterDate(time_stamp, end)
  return image.select(selection_bands).unmask(modis_filler).select(selection_bands);
}); //, true




var area = sentinel2_mosaics_landsatFill.first().select(['blue'])

var stats = area.reduceRegion({
  reducer: ee.Reducer.count(),
  geometry: new_D,
  scale: 100,
  maxPixels: 1e9
});

var dict = ee.Dictionary(stats)

var feature = ee.Feature(null, dict);

var fc = ee.FeatureCollection(feature)

// Export the FeatureCollection.
Export.table.toDrive({
  collection: fc,
  description: 'sen2_land8_area_export',
  fileFormat: 'CSV'
});







var area = sentinel2_modisFill.first().select(['blue'])

var stats = area.reduceRegion({
  reducer: ee.Reducer.count(),
  geometry: new_D,
  scale: 100,
  maxPixels: 1e9
});

var dict = ee.Dictionary(stats)

var feature = ee.Feature(null, dict);

var fc = ee.FeatureCollection(feature)

// Export the FeatureCollection.
Export.table.toDrive({
  collection: fc,
  description: 'sen2_land8_MODIS_area_export',
  fileFormat: 'CSV'
});





Export.table.toDrive(sentinel2_modisFill.map(function(image) {
  
                            var area = image.select(['blue'])
                            
                            var stats = area.reduceRegion({
                            reducer: ee.Reducer.count(),
                            geometry: clip_feature,
                            scale: 10,
                            maxPixels: 1e9
                            })
                            
                            var dict = ee.Dictionary(stats)
                            
                            var feature = ee.Feature(null, dict)
      
                            return feature}))
      














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
  return composite.set('system:time_start', m).clip(clip_feature);
}));

//Filters out images outside of current temporal scope
var sentinel1_mosaics = sentinel1_mosaics_unfiltered.map(function(image) {
  return ee.Algorithms.If(ee.Number(image.bandNames().size().gt(0)), image.set('approved','true'), image.set('approved','false'));
}).filterMetadata('approved', 'equals', 'true');


// Calculating VH/VV ratio
//var sen1_ratio = sentinel1_mosaics.map(function(image){
//                      return image.select('VH').divide(image.select('VV')).select(['VH'], ['ratio']).copyProperties(image, ['system:time_start']);
//});









//////////////////////////////////////// Seasonality metrics /////////////////////////////////////////
//output: metrics

// Optical metrics
var max = ee.Image(sentinel2_modisFill.select('NDVI').reduce(ee.Reducer.max()));
var min = ee.Image(sentinel2_modisFill.select('NDVI').reduce(ee.Reducer.min()));
var amp = max.subtract(min);
var std = ee.Image(sentinel2.select('NDVI').reduce(ee.Reducer.stdDev()));


// SAR metrics
var vv_max = ee.Image(sentinel1.select('VV').reduce(ee.Reducer.max()));
var vv_min = ee.Image(sentinel1.select('VV').reduce(ee.Reducer.min()));
var vv_amp = vv_max.subtract(vv_min);
var vv_std = ee.Image(sentinel1.select('VV').reduce(ee.Reducer.stdDev()));


var metrics = ee.Image.cat([max, min, amp, std, vv_max, vv_min, vv_amp, vv_std]).select(['NDVI_max', 'NDVI_min', 'NDVI_max_1', 'NDVI_stdDev', 'VV_max', 'VV_min', 'VV_max_1', 'VV_stdDev'],['max', 'min', 'amp', 'std', 'vv_max', 'vv_min', 'vv_amp', 'vv_std']);











/////////////////////////////// Texture //////////////////////////////      //not normalized!!
//sen1_texture
//sen1_entropy


var sen1_texture = sentinel1_mosaics.map(function(image){
                  var img = image.select('VV').multiply(ee.Image(100)).toInt();
                  var square = ee.Kernel.square({radius: 4});
                  var entropy = img.entropy(square).select(['VV'],['VV_entropy']);    //entropy
                  var glcm = img.glcmTexture({size: 4});
                  var inertia = glcm.select('VV_inertia');                            //inertia
                  return entropy.addBands(inertia);
});










/////////////////////////////////// NDWI /////////////////////////////////////////////////////

var ndwi = sentinel2_modisFill.map(function(image){
                              return image.normalizedDifference(['nir','swir2']).select(['nd'], ['ndwi']);
});









/////////////////////////////////// COPERNICUS LAND COVER PRODUCT //////////////////////////////


// Erosion followed by a dilation
var kernel = ee.Kernel.circle({radius: 5});
var opened = cop_lc
             .focal_min({kernel: kernel, iterations: 2})
             .focal_max({kernel: kernel, iterations: 2});

// Dilation followed by erosion
var open_closed = opened
                  .focal_max({kernel: kernel, iterations: 2})
                  .focal_min({kernel: kernel, iterations: 2});


var cop_lc_combined = ee.ImageCollection([cop_lc.select(['b1'],['cop_lc']), open_closed.select(['b1'],['cop_lc_morphed'])]);











/////////////////////////////// Layer Stacking ////////////////////////////////////////////
//Output: layer_stack

//Datasets to be combined:
//sentinel1_mosaics
//sentinel2_modisFill
//metrics
//sen1_ratios
//sen1_texture
//ndwi





var image_collection = sentinel1_mosaics.merge(sentinel2_modisFill).merge(metrics).merge(ndwi).merge(cop_lc_combined).merge(sen1_texture);     //.select('VV') .merge(cop_lc_combined)  .merge(sen1_texture)




// Layer stack maker
var stackCollection = function(image_collection) {
  var first = ee.Image(image_collection.first()).select([]);
  var appendBands = function(image, previous) {   //Previous = result of previous iteration, NOT previous image
    return ee.Image(previous).addBands(image);
  };
  return ee.Image(image_collection.iterate(appendBands, first));   //First is the starting image to be used as starting point for adding onto for each interation
};

var layer_stack = stackCollection(image_collection).clip(clip_feature);     //.select(layer_selection)











///////////////////////////////////// Sampling //////////////////////////////////////
//Output: training_sample


//var training_sample = sample_asset.select(feature_selection)





/*
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
                            geometries: true                                //add geometries prior to exporting sample
                            }).first().set('class', feature.get('class'))});




Export.table.toDrive(training_points.map(function(feature) {
                            return layer_stack.sample({
                            region: ee.Feature(feature).geometry(),
                            scale: 10,
                            tileScale: 16,
                            geometries: true
                            }).first().set('class', feature.get('class'))}));
                            



*/




/*

///////////////////////////////////// CLASSIFICATION /////////////////////////////////

var classifier = ee.Classifier.randomForest(500);

var trained_classifier = classifier.train(training_sample, 'class', training_sample.first().propertyNames().remove('system:index'));

// Classify the layer_stack.
var classified = layer_stack.classify(trained_classifier).clip(clip_feature);






Export.image.toDrive({
  image: classified,
  description: '2017_D',
  scale: 10,
  region: clip_feature,
  maxPixels: 2000000000000
});

*/