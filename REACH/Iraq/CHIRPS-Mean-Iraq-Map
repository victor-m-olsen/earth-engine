/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var CHIRPS = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY"),
    adm0 = ee.FeatureCollection("users/mh_khan/irq_admbnda_adm0_cso_itos_20190603"),
    imageVisParam = {"opacity":1,"bands":["precipitation"],"min":-1.433718692546338,"max":1.7994131001741256,"palette":["ffffff","3b0aff"]},
    geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[38.99079577908206, 37.788444244460045],
          [38.99079577908206, 28.382139006059237],
          [49.40583484158206, 28.382139006059237],
          [49.40583484158206, 37.788444244460045]]], null, false),
    imageVisParam2 = {"opacity":1,"bands":["precipitation"],"min":0.3797532714903355,"max":2.5389067508280276,"palette":["ceebff","4c36ff"]};
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var HydroSHEDS = ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_3")
                .filterBounds(geometry);
var iraq_shed = HydroSHEDS.filter(ee.Filter.eq('HYBAS_ID', 2030073570))

var CHIRPS_mean_iraq = CHIRPS.mean().clip(iraq_shed)

//print(CHIRPS.limit(10, 'system:time_start', false))

Export.image.toDrive({
  image: CHIRPS_mean_iraq,
  description: 'CHIRPS_mean_iraq_500',
  scale: 500,
  maxPixels: 999999999999,
  region: iraq_shed,
  fileFormat: 'GeoTIFF',
  // formatOptions: {
  //   cloudOptimized: true
  // }
});


  