/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #98ff00 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[33.70794399186116, -13.823493650186965],
          [33.70794399186116, -14.042087002318128],
          [33.96612270279866, -14.042087002318128],
          [33.96612270279866, -13.823493650186965]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var global_admin0 = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level0");
var malawi = global_admin0.filter(ee.Filter.eq('ADM0_NAME', 'Malawi'))

// Defining AOI
var clip_feature = geometry

// Defining time range
var start = ee.Date('2021-01-01');
var end = ee.Date('2021-12-14');

// Reference module repository (includes cloud masking function)
var Preprocess = require('users/victormackenhauer/REACH-BackUps:Modules/Preprocess')

//Monthly Mosaick maker Sen2
function make_date_range_monthly(start, end){
  var n_months = end.difference(start,'month').round().subtract(1);
  var range = ee.List.sequence(0,n_months,1); 
  var make_datelist = function (n) {
    return start.advance(n,'month')
  };
  return range.map(make_datelist);
}

var date_range_monthly = make_date_range_monthly(start, end)

function composite_monthly(imgCol, date_range){
  return ee.ImageCollection.fromImages(
      date_range.map(function (date) {
        date = ee.Date(date)
        imgCol = imgCol.filterDate(date, date.advance(1,'month'))
        return imgCol.mean()
                    .set('date', date.format('YYYY-MM'))
                    .set('year', date.get('year'))
                    .set('month', date.get('month'))
                    .set('system:time_start', date.millis())
                    .clip(clip_feature)
      }))
}

// Annual mosaic for Landsat 8
var annual_mosaick_function_l8 = function(img, start, end) {
  var landsat_filtered = landsat.filterDate(start, end)
  var landsat_masked = landsat_filtered.map(l8_cloud_remover)
  var annual_mosaick_l8 = landsat_masked.mean() /// OBS: mean used
  return annual_mosaick_l8
}

/*************************************************************************************
//////////////////////////////////////// 03_Data /////////////////////////////////////
*************************************************************************************/

// Sen2
var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR')
                    .filterDate(start, end)
                    .filterBounds(clip_feature)
var s2_cloudless = Preprocess.filterCloudsAndShadowsUkraine(sentinel2,clip_feature,start,end,false, 60)
var sentinel2_mosaick = composite_monthly(s2_cloudless, date_range_monthly)
var s2_annual_mosaick = s2_cloudless.median().clip(clip_feature)


var imageVisParam4 = {"opacity":1,"bands":["B4","B3","B2"],"min":273.36,"max":3266.64,"gamma":1}

Map.addLayer(s2_annual_mosaick, imageVisParam4, '2021')


Export.image.toDrive({
  image: s2_annual_mosaick, //.clip(malawi),
  description: 's2_annual_mosaick_malawi',
  region: geometry,
  scale: 10,
  maxPixels: 1e13
})





