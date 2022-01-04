/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[32.432335947919, -8.859788785248364],
          [32.432335947919, -17.284255975366733],
          [36.343468760419, -17.284255975366733],
          [36.343468760419, -8.859788785248364]]], null, false),
    table = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level0");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var dataset = ee.ImageCollection("ESA/WorldCover/v100").first().clip(geometry);

var malawi = table.filter(ee.Filter.eq('ADM0_NAME', 'Malawi'))
Map.addLayer(malawi)

var visualization = {
  bands: ['Map'], 
};

Map.centerObject(dataset);

Map.addLayer(dataset, visualization, "Landcover");


Export.image.toDrive({
  image: dataset.clip(malawi),
  description: 'malawi_lc_clipAdmin0',
  region: geometry,
  scale: 10,
  maxPixels: 1e13
})

