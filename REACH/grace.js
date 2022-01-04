/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[8.493635454996467, 32.212610153327944],
          [8.493635454996467, 20.096994318907377],
          [28.620588579996465, 20.096994318907377],
          [28.620588579996465, 32.212610153327944]]], null, false),
    imageVisParam = {"opacity":1,"bands":["lwe_thickness_csr"],"min":-8.366276592798334,"max":9.793695235914383,"palette":["ff3808","350eff"]},
    imageVisParam2 = {"opacity":1,"bands":["precipitation"],"min":-0.32178615240607994,"max":0.47994857448506684,"palette":["001137","0aab1e","e7eb05","ff4a2d","e90000"]},
    Nubian = 
    /* color: #98ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[20.177362795896613, 26.703514940496067],
          [20.177362795896613, 16.92765849149758],
          [32.30626904589661, 16.92765849149758],
          [32.30626904589661, 26.703514940496067]]], null, false),
    NWSAS = 
    /* color: #0b4a8b */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-0.4800170422934835, 34.38964715430245],
          [-0.4800170422934835, 27.616337916085023],
          [14.373498582706516, 27.616337916085023],
          [14.373498582706516, 34.38964715430245]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var equivalentWaterThicknessCsrVis = {
  min: -25.0,
  max: 25.0,
};

var precipitationVis = {
  min: 1.0,
  max: 17.0,
  palette: ['001137', '0aab1e', 'e7eb05', 'ff4a2d', 'e90000'],
};

var CHIRPS = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
                  .filter(ee.Filter.date('2002-01-01', '2016-12-31')).select('precipitation');

var grace = ee.ImageCollection('NASA/GRACE/MASS_GRIDS/LAND')
                  //.filter(ee.Filter.date('2016-08-01', '2016-08-30'));
var grace_EWT = grace.select('lwe_thickness_csr');

//print('grace', grace)
//print('grace_EWT', grace_EWT)
//print('CHIRPS', CHIRPS)

// Chart
print(ui.Chart.image.series(grace_EWT, geometry, ee.Reducer.mean()));
//print(ui.Chart.image.series(CHIRPS, geometry, ee.Reducer.mean()));

// Map
Map.addLayer(grace_EWT.first().clip(geometry), imageVisParam, 'Equivalent Water Thickness CSR');
Map.addLayer(CHIRPS.mean().clip(geometry), imageVisParam2, 'Precipitation');
