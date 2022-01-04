/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var study_area = 
    /* color: #e9ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[36.89574157568359, 11.315745688602268],
          [36.89574157568359, 10.881817666785688],
          [37.51646911474609, 10.881817666785688],
          [37.51646911474609, 11.315745688602268]]], null, false),
    terrace_area = 
    /* color: #0b4a8b */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[37.02758182300863, 10.953337452327515],
          [37.02758182300863, 10.941919047348751],
          [37.03985561146078, 10.941919047348751],
          [37.03985561146078, 10.953337452327515]]], null, false),
    field = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[37.02351494582183, 10.951130777773855],
          [37.02351494582183, 10.950751572993642],
          [37.02418549807555, 10.950751572993642],
          [37.02418549807555, 10.951130777773855]]], null, false),
    mws_selected = /* color: #98ff00 */ee.Geometry.Polygon(
        [[[37.04116659572901, 10.951185609315868],
          [37.02348547390284, 10.956410158098091],
          [37.01661901882471, 10.949163178584703],
          [37.02314215114893, 10.944781197958454],
          [37.03189688137354, 10.941241858600357],
          [37.03910665920557, 10.946635120749626]]]),
    mws_id = ee.FeatureCollection("users/estherbarvels/mws_dacota_KFW_only_ID"),
    geometry = /* color: #d63000 */ee.Geometry.MultiPoint(),
    geometry2 = /* color: #98ff00 */ee.Geometry.Polygon(
        [[[39.83040391370696, 14.286979341381736],
          [37.96272813245696, 14.393419506672007],
          [36.75423203870696, 13.988679963874743],
          [36.66634141370696, 9.905244983569657],
          [34.66682969495696, 9.861951886410287],
          [34.97444688245696, 7.690548636871709],
          [39.74251328870696, 7.799409696493439]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/


Map.centerObject(study_area, 13)
//going through Victor's code (code_original), maybe adjusting it and adding it here
//goal: NDVI time series with not only Landsat, but also Sentinel-2 and MODIS
var selection_bands = ['NDVI', 'blue', 'red', 'nir', 'swir2'];
var start = ee.Date('2015-10-01'); 
var end = ee.Date('2019-01-01');


// Create list of dates for time series with 'month'-unit
var n_months = end.difference(start,'month').round();
var range = ee.List.sequence(0,n_months,1); //list from 0 to 12
var make_datelist = function(n) {
  return start.advance(n,'month');
};
range = range.map(make_datelist);
print('range', range);

    
var aqua = ee.ImageCollection('MODIS/006/MYD13Q1')
                  .filterDate(start, end)
                  .filterBounds(study_area)
                  .select(['NDVI','sur_refl_b03', 'sur_refl_b01','sur_refl_b02', 'sur_refl_b07'], ['NDVI', 'blue', 'red', 'nir', 'swir2']) //error: ['NDVI','blue','green','red', 'nir'], error2: ['NDVI','sur_refl_b01','sur_refl_b02','sur_refl_b03', 'sur_refl_b07'], ['NDVI','red','nir','blue', 'swir2']
                  .sort('system:time_start')
var terra = ee.ImageCollection('MODIS/006/MOD13Q1')
                  .filterDate(start, end)
                  .filterBounds(study_area)
                  .select(['NDVI','sur_refl_b03', 'sur_refl_b01','sur_refl_b02', 'sur_refl_b07'], ['NDVI', 'blue', 'red', 'nir', 'swir2']) //error: ['NDVI','blue','green','red', 'nir']
                  .sort('system:time_start')


                    
var landsat8_SR = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR') //surface reflectance 
                  .filterDate(start, end)
                  .filterBounds(study_area)
                  .select(['B2', 'B3', 'B4','B5', 'B6', 'B7', 'pixel_qa'],['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'pixel_qa'])
                  
                  .map(function(image) { //take entire map-function out if using other(new) method where NDVI is calculated later
                  return image.addBands(image.normalizedDifference(['nir','red']).select(['nd'], ['NDVI']))
                  })

                  
var landsat_masked = ee.ImageCollection(landsat8_SR) //!!!!!! exchange this one with Victor's and don't use SR-product!!!!!!!
                        .map(function(image) {
                          // Bits 3 and 5 are cloud shadow and cloud, respectively.
                          var cloudShadowBitMask = (1 << 3);
                          var cloudsBitMask = (1 << 5);
                          // Get the pixel QA band.
                          var qa = image.select('pixel_qa');
                          // Both flags should be set to zero, indicating clear conditions.
                          var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
                                         .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
                          return image.updateMask(mask);
                        })

var sentinel2 = ee.ImageCollection('COPERNICUS/S2') //NOT surfance reflectance
                    .filterDate(start, end)
                    .filterBounds(study_area)
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
// print('sentinel2',sentinel2)
 
// print(ee.Date(1441872162740))//system:time_start - 2015-09-10 first Sentinel2-image


//Cloud masking functions for Sentinel2
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


//var sentinel2_masked = simpleTDOM2(sentinel2.map(maskS2clouds)).select(selection_bands);
var sentinel2_masked = simpleTDOM2(sentinel2.map(bustClouds)).map(maskS2clouds).select(selection_bands);                        
//print('sentinel2',sentinel2_masked);
                  



///////// MOSAICKING Landsat and Sentinel-2///////
//Output: landsat_mosaics
//Output: sentine2_mosaics

function mosaic_maker(imageCollection){
  var temporal_composites = function(date, newlist) { 
    //function needs 2 parameters (objects) so it can be iterated over the date-list later: 
                                                    //1) the current list item and 
                                                    //2) result from previous iteration/value for first iteration
    date = ee.Date(date);
    newlist = ee.List(newlist);
    var filtered = imageCollection
                  .filterDate(date, date.advance(1,'month')); //filter collection with range of 30 days
    var filtered_addedQA = filtered.map(function(image) {
                                          return image.addBands(image.metadata('system:time_start'))}); //new band that contains date (system time) assigned to each image -> in each image every pixel has the same value in this band
    var image = ee.Image(filtered_addedQA
                  .qualityMosaic('NDVI'))
                  .set('system:time_start', date)
                  .clip(study_area); //filtered_addedQA.first().get('system:time_start')); // date);      qualityMosaic('system:time_start'))                  //Change to qualityMosaic()
    return ee.List(ee.Algorithms.If(filtered.size(), newlist.add(image), newlist)); 

//if the collection has at least one image (filtered.size() = true) then add image, otherwise leave list as it is 
//if filtered.size() = 0 , boolean value is false --> in case if no images are available due to high temporal resolution or clouds
    
  };
  var imageCollection_unfiltered = ee.ImageCollection(ee.List(range.iterate(temporal_composites, ee.List([]))));
  //iterate temporal_composites-function over the list "range" (lists of dates), empty list is first list-object that function takes (?)
  return imageCollection_unfiltered.limit(range.size().subtract(1), 'system:time_start'); //sort by 'system:time_start'
}


var landsat_mosaics = mosaic_maker(landsat_masked);
var sentinel2_mosaics = mosaic_maker(sentinel2_masked);
// print('landsat_mosaics',landsat_mosaics);
//print('sentinel2_mosaics',sentinel2_mosaics);
//Map.addLayer(landsat_mosaics, {}, 'landsat_mosaics');


/////// Mosaicing MODIS ///////
//Output: modis_mosaics
var modis = terra.merge(aqua).sort('system:time_start');
// print('modis',modis);


var monthly_mosaics = function(date, newlist) {
  date = ee.Date(date);
  newlist = ee.List(newlist);
  var filtered = modis.filterDate(date, date.advance(1,'month'));
  var image = ee.Image(filtered
                        .mosaic())
                        .set('system:time_start', date); //latest image on top
  return ee.List(ee.Algorithms.If(filtered.size(), newlist.add(image), newlist));
};

var modis_unfiltered = ee.ImageCollection(ee.List(range.iterate(monthly_mosaics, ee.List([]))));
var modis_list = modis_unfiltered.toList(range.size().subtract(1)); //removing last image

var modis_mosaics = ee.ImageCollection(modis_list.map(function(image) {
  var scale_factor = ee.Image(0.0001);
  var time_string = ee.Image(image).get('system:time_start');
  return ee.Image(image)
  .multiply(scale_factor)
  .set('system:time_start', time_string)
  .set('type', 'modis')
  .clip(study_area);
}));


/*var inspectImage = 5;
print('modis_mosaics', '', modis_mosaics);
Map.addLayer(ee.Image(modis_mosaics.toList(modis_mosaics.size()).get(inspectImage)), '', 'modis_mosaics');
*/



///////////// Correlating and adjusting values /////////////
//beware of potential problem if no overlapping pixels exist for sen2 and landsat/modis


//Output: adjusted_landsat_mosaics
//Output: adjusted_modis_mosaics

var correlation_adjuster = function(image) { //only works if area of overlapping pixel is large enough, otherwise the mean is not representative
  var time = image.get('system:time_start')
  var sen2_image = sentinel2_mosaics.filterMetadata('system:time_start', 'equals', time).first()
  //var sen2_image = sentinel2_mosaics.filterMetadata('system:time_start', 'not_less_than', time).first()
  
  //get sen2_mean where sen2 overlaps with filler
   //calculate mean of overlapping pixels with LS (all clouds of both images masked out)
  var sen2_mean = sen2_image.select(selection_bands)
                            .updateMask(image.select(selection_bands)) //makes image with masked out clouds from both LS and S2
                            .reduceRegion({
                              reducer: ee.Reducer.median(),     ///Consider mean instead of median
                              geometry: study_area,
                              scale: 1000, //resample so it's faster
                              tileScale: 16,
                              bestEffort: true
                              //maxPixels: 1e9
                              });
  
  //get filler_mean where filler overlaps with sen2
  //calculate mean of overlapping pixels with S2 (all clouds of both images masked out)
  var filler_mean = image.select(selection_bands)
                          .updateMask(sen2_image.select(selection_bands))
                          .reduceRegion({
                            reducer: ee.Reducer.median(),
                            geometry: study_area,
                            scale: 1000,
                            tileScale: 16,
                            //maxPixels: 1e9
                            bestEffort: true
                            });

  var multiplication_factor_NDVI = ee.Number(sen2_mean.get('NDVI')).divide(ee.Number(filler_mean.get('NDVI')))
  var multiplication_factor_red = ee.Number(sen2_mean.get('red')).divide(ee.Number(filler_mean.get('red')))
  //var multiplication_factor_green = ee.Number(sen2_mean.get('green')).divide(ee.Number(filler_mean.get('green')))
  var multiplication_factor_blue = ee.Number(sen2_mean.get('blue')).divide(ee.Number(filler_mean.get('blue')))
  var multiplication_factor_nir = ee.Number(sen2_mean.get('nir')).divide(ee.Number(filler_mean.get('nir')))
  var multiplication_factor_swir2 = ee.Number(sen2_mean.get('swir2')).divide(ee.Number(filler_mean.get('swir2')))
  
  var ndvi = image.select('NDVI').multiply(ee.Image(multiplication_factor_NDVI)).set('system:time_start', time)
  var red = image.select('red').multiply(ee.Image(multiplication_factor_red))
  //var green = image.select('green').multiply(ee.Image(multiplication_factor_green))
  var blue = image.select('blue').multiply(ee.Image(multiplication_factor_blue))
  var nir = image.select('nir').multiply(ee.Image(multiplication_factor_nir))
  var swir2 = image.select('swir2').multiply(ee.Image(multiplication_factor_swir2))


  return ee.Algorithms.If(filler_mean.get('NDVI'), //if there is a mean-image = if there is an overlap
  ee.Image(ndvi).addBands(ee.Image(blue)).addBands(ee.Image(red)).addBands(ee.Image(nir)).addBands(ee.Image(swir2)), //then make adjusted image
      ee.Algorithms.If(image.get('type'), //else, if there is no mean-image but 'type' property, 
      image, //then take image (it can only be MODIS because LS has no 'type' - if no overlap with Landsat, not the original LS image is taken but the adjusted MODIS image)
      null ))    
      
      //.addBands(ee.Image(green))
};


var adjusted_landsat_mosaics = landsat_mosaics.map(correlation_adjuster, true) //feature collection of 12 elements
// print('adjusted_landsat_mosaics',adjusted_landsat_mosaics);
var adjusted_modis_mosaics = modis_mosaics.map(correlation_adjuster, true); //feature collection
// print('adjusted_modis_mosaics',adjusted_modis_mosaics);


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
}) //, true


// print('sentinel2_mosaics_landsatFill',sentinel2_mosaics_landsatFill);
// print('landsat_mosaics',landsat_mosaics)

 var Feature_style = {color: '000000', fillColor: '00000000'};
Map.addLayer(mws_id.style(Feature_style), '', 'MWS')


// --------feature collection --------


var mws_features = mws_id.filterBounds(study_area)
print(mws_features,'mws_featues')

// var property_list = mws_features.first().propertyNames() //list

// print(mws.limit(4),'limited mws collection') //limits to 4 first features
// var mws_genetie = mws.filterMetadata('mws_nm', 'equals', 'Genetie') 
// print(mws_genetie,'Genetie feature')
// var feature_i1 = ee.Feature(mws.toList(400).get(1)) //another way to get a mws
// print(feature_i1,'feature i=1 from list');



// ------- reduce properties of features (so not all the attributes from shp are in csv later on) ------
var reduceProperty = function(f, property) {
  var properties = f.propertyNames()
  var selectProperties = properties.filter(ee.Filter.eq('item', property))
  return f.select(selectProperties)
}

var mws_features_reduced_prop = mws_features.map(function(f) {
  return reduceProperty(f, 'mwsID') //features of the collection will only have mwsID as property
})




//////////// Time series to .csv ///////////


// Define a FeatureCollection: microwatersheds
var regions = mws_features_reduced_prop
// Define ImageCollection: mosaics
var image_collection = sentinel2_modisFill
// print(image_collection.first().id(), 'id of first()') //0 
// print('image_collection:',image_collection)





 
//FUNCTION: Collect region, image, value triplets.
var triplets = image_collection.map(function(image) {
  return image.select('NDVI')
              .reduceRegions({
                  collection: regions,//.select(['mwsID']), ??what is the difference??
                  reducer: ee.Reducer.mean(), 
                  scale: 30
               })
              .filter(ee.Filter.neq('mean', null)) //filter everything that is not null
              .map(function(f) { //f = image
                 // return f.set('imageId', image.id());
                 var date = image.get('system:time_start');
                 var date_format = ee.Date(date).format('YYYY-MM-dd');
                  return f.set('mosaic', date_format)//make new property; das hier später durch Datum ersetzen  
                });
            })
          .flatten();
// print(triplets.first(), 'triplets.first()');
// print(triplets, 'triplets')


//FUNCTION: Format a table of triplets into a 2D table of rowId (image name/ date) x colI (feature id /mws)
var format = function(table, rowId, colId) { 
  // Get a FeatureCollection with unique row IDs.
  var rows = table.distinct(rowId);
  // Join the table to the unique IDs to get a collection in which
  // each feature stores a list of all features having a common row ID. 
  var joined = ee.Join.saveAll('matches').apply({ // determines how the join is applied
    primary: rows, //primary feature collection
    secondary: table,  //secondary feature collection
    condition: ee.Filter.equals({
      leftField: rowId, 
      rightField: rowId
    })
  });

  return joined.map(function(row) { 
      // Get the list of all features with a unique row ID.
      var values = ee.List(row.get('matches'))
        // Map a function over the list of rows to return a list of
        // column ID and value.
        .map(function(feature) {
          feature = ee.Feature(feature);
          return [feature.get(colId), feature.get('mean')];
        });
      // Return the row with its ID property and properties for
      // all matching columns IDs storing the output of the reducer.
      // The Dictionary constructor is using a list of key, value pairs.
      return row.select([rowId]).set(ee.Dictionary(values.flatten()));
    });
};



var table1 = format(triplets, 'mosaic', 'mwsID');


/// EXPORT ///

// var desc1 = 'TS_sentinel2_modisFill'
// Export.table.toDrive({
//   collection: table1, 
//   description: desc1, 
//   fileNamePrefix: desc1,
//   fileFormat: 'CSV',
//   folder: 'GEE'
// });


// Print polygon area in square kilometers.
print('Polygon area: ', geometry2
.area().divide(1000 * 1000));





//FUNCTION: export time series for only one region as CSV file

// var createTS = function(img){
//   var date = img.get('system:time_start');
//   var value = img.reduceRegion(ee.Reducer.mean(), terrace_area, 30).get('NDVI');
//   var ft = ee.Feature(null, {'system:time_start': date, 
//                             'date': ee.Date(date).format('Y/M/d'), 
//                             'value': value});
//   return ft;
// };

// var TS = modis_mosaics.map(createTS);

// print(TS, 'TS')
// // Export.table.toDrive({collection: TS, selectors: 'date, value'});

