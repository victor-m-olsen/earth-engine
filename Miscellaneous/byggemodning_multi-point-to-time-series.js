/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[11.73740775310796, 56.197618833395055],
          [11.73740775310796, 55.5380399327131],
          [12.700084755061084, 55.5380399327131],
          [12.700084755061084, 56.197618833395055]]], null, false),
    alle_punkter = ee.FeatureCollection("users/victormackenhauer/alle_punkter_GEE_84");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var clip_feature = geometry


var points = ee.FeatureCollection(alle_punkter)


 

/////////////////////////// Loading Imagery //////////////////////////////////////////////

// Filters
var sen2_selection = clip_feature.buffer(40000);
var sen1_selection = clip_feature.buffer(60000);
var selection_bands = ['NDVI', 'blue', 'red', 'nir', 'swir2'];
var selection_bands2 = ['NDVI', 'blue', 'red', 'nir', 'swir2', 'green'];
var start = ee.Date('2019-01-01');
var end = ee.Date('2019-06-30');

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
                  .filterBounds(sen1_selection)  //Geometry, not feature!!   sen1_selection
                  .filterDate(start, end)
                  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
                  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
                  .filter(ee.Filter.eq('instrumentMode', 'IW'))
                  .filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING')) //#DESCENDING
                  .select(['VV', 'VH'])
                  .map(function(image) {
                    return image.unitScale(-30, 30).copyProperties(image, ['system:time_start']);        //No clamping performed, may be a problem for outliers
                  });
var landsat = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
                  .filterDate(start, end)
                  .filterBounds(sen2_selection)
                  .select(['B2', 'B3', 'B4','B5', 'B6', 'B7', 'BQA'],['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'BQA'])
                  .map(function(image) {
                  return image.addBands(image.normalizedDifference(['nir','red']).select(['nd'], ['NDVI']))
                  })
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
//var sentinel2_masked = simpleTDOM2(sentinel2.map(bustClouds)).map(maskS2clouds).select(selection_bands2);



// Activate only QA-band masking
var sentinel2_masked = sentinel2.map(maskS2clouds)





////////////////// Mosaick Maker Function //////////////////////////
// Date range
var diff = end.difference(start, 'month');  //change to months?
var temporalResolution = 1; // month
var range = ee.List.sequence(0, diff.subtract(1), temporalResolution).map(function(month){return start.advance(month,'month')});      //diff.subtract(1)



// Mosaic maker function (same code used for Sentinel 2)  - Inspiration: https://code.earthengine.google.com/20ad3c83a17ca27b28640fb922819208
function mosaic_maker(imageCollection){
  var temporal_composites = function(date, newlist) {
    date = ee.Date(date);
    newlist = ee.List(newlist);
    var filtered = imageCollection.filterDate(date, date.advance(temporalResolution, 'month'));
    var filtered_addedQA = filtered.map(function(image) {return image.addBands(image.metadata('system:time_start'))});
    var image = ee.Image(filtered_addedQA.qualityMosaic('NDVI')).set('system:time_start', date).clip(clip_feature); //filtered_addedQA.first().get('system:time_start')); // date);      qualityMosaic('system:time_start'))                  //Change to qualityMosaic()
    return ee.List(ee.Algorithms.If(filtered.size(), newlist.add(image), newlist));
};
  var imageCollection_unfiltered = ee.ImageCollection(ee.List(range.iterate(temporal_composites, ee.List([]))));
  return imageCollection_unfiltered.limit(range.size(), 'system:time_start');   //range.size().subtract(1)
}






//////////////////////////// Mosaicking Sentinel 2 /////////////////////////////////////////////////////////
//Output: sentinel2_mosaics

var sentinel2_mosaics = mosaic_maker(sentinel2_masked);




//////////////////////////// Processing Sentinel 1 /////////////////////////////////////////////////////////
//Output: sentinel1_mosaics

var sentinel1_2018 = sentinel1.filter(ee.Filter.calendarRange({
    start: 2018,
    end: 2018,
    field: 'year'}))
    
    
var sentinel1_2019 = sentinel1.filter(ee.Filter.calendarRange({
    start: 2019,
    end: 2019,
    field: 'year'}))




// Composites
var months = ee.List.sequence(1, 12, 1); //1, 355, 6); //
var sentinel1_mosaics_unfiltered = ee.ImageCollection(months.map(function(m) {
  var time_period = sentinel1_2018
    .filter(ee.Filter.calendarRange({               //Selecting polarisation 
    start: m,
    end: ee.Number(m).add(1),
    field: 'month'}))
  var composite = ee.Image(time_period.mean());
  return composite.set('system:time_start', time_period.first().get('system:time_start')).clip(clip_feature);
}));

//Filters out images outside of current temporal scope
var sentinel1_mosaics_18 = sentinel1_mosaics_unfiltered.map(function(image) {
  return ee.Algorithms.If(ee.Number(image.bandNames().size().gt(0)), image.set('approved','true').copyProperties(image, ['system:time_start']), image.set('approved','false'));
}).filterMetadata('approved', 'equals', 'true');

// Composites
var months = ee.List.sequence(1, 5, 1); //1, 355, 6); //
var sentinel1_mosaics_unfiltered = ee.ImageCollection(months.map(function(m) {
  var time_period = sentinel1_2019
    .filter(ee.Filter.calendarRange({               //Selecting polarisation 
    start: m,
    end: ee.Number(m).add(1),
    field: 'month'}))
  var composite = ee.Image(time_period.mean());
  return composite.set('system:time_start', time_period.first().get('system:time_start')).clip(clip_feature);
}));

//Filters out images outside of current temporal scope
var sentinel1_mosaics_19 = sentinel1_mosaics_unfiltered.map(function(image) {
  return ee.Algorithms.If(ee.Number(image.bandNames().size().gt(0)), image.set('approved','true').copyProperties(image, ['system:time_start']), image.set('approved','false'));
}).filterMetadata('approved', 'equals', 'true');

var combined_sen1 = sentinel1_mosaics_19.merge(sentinel1_mosaics_18)
var sentinel1_mosaics = combined_sen1
var combined_sen1_col = ee.FeatureCollection([ee.ImageCollection(combined_sen1.select('VV')), ee.ImageCollection(combined_sen1.select('VH'))])








//////////// Time series to .csv ///////////

// Define a FeatureCollection
var regions = points

// FUNCTION 1: Collect region, image, value triplets.
// Output: id, mean and date extracted for each image, for each feature


var format_function = function(imageCol, rowId, colId) {

  var triplets = imageCol.map(function(image) {
    return image.reduceRegions({
                    collection: regions,//.select(['mwsID']), ??what is the difference??
                    reducer: ee.Reducer.mean(), 
                    scale: 10,
                    tileScale: 16
                 })
                .filter(ee.Filter.neq('mean', null)) //filter everything that is not null
                .map(function(f) { //f = image
                   // return f.set('imageId', image.id());
                   var date = image.get('system:time_start');
                   var date_format = ee.Date(date).format('YYYY-MM-dd');
                    return f.set('date', date_format)//make new property; das hier später durch Datum ersetzen  
                  });
              })
            .flatten();

//FUNCTION 2: Format a table of triplets into a 2D table of rowId (date) x colId (feature id)
//Part 1: Output: Feature collection of dates. Each feature contains list with all features corresponding to given date

  // Get a FeatureCollection with unique row IDs.
  var rows = triplets.distinct(rowId);
  
  // Join the table to the unique IDs to get a collection in which
  // each feature stores a list of all features having a common row ID. 
  var joined = ee.Join.saveAll('matches').apply({ // determines how the join is applied
    primary: rows, //primary feature collection
    secondary: triplets,  //secondary feature collection
    condition: ee.Filter.equals({
      leftField: rowId, 
      rightField: rowId
    })
  });
  return joined.map(function(row) { 
      
      // Get the list of all features with a unique row ID.
      var values = ee.List(row.get('matches'))
        // Map a function over the list of dates to return a list of
        // column ID and value. Turn list of ID/value pairs into Dictionary.
        // add dictionary as property.
        .map(function(feature) {
          feature = ee.Feature(feature);
          return ee.List([ee.String(feature.get('id')), ee.String(feature.get('mean'))]);
        });
      return row.select(['date']).set(ee.Dictionary(values.flatten()))
});
};






// Change image collection and select bands
var image_collection = sentinel1_mosaics.select('VH')


// Apply function - temp profile to csv
format_function = format_function(image_collection, 'date', 'id')




/// EXPORT ///
var desc1 = 'VH_ASCENDING'
Export.table.toDrive({
   collection: format_function,
   description: desc1, 
   fileNamePrefix: desc1,
   fileFormat: 'CSV'
 });
 






