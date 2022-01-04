/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[35.48219728720077, 30.573358339168042],
          [35.48219728720077, 30.57217595774293],
          [35.53918886434921, 30.57217595774293],
          [35.53918886434921, 30.573358339168042]]], null, false),
    geometry2 = 
    /* color: #98ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[35.45198488485702, 30.746126239438386],
          [35.45198488485702, 30.535219276370313],
          [35.744495871185144, 30.535219276370313],
          [35.744495871185144, 30.746126239438386]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var dataset = ee.Image('USGS/SRTMGL1_003').clip(geometry2);

var elevation = dataset.select('elevation');
var slope = ee.Terrain.slope(elevation);
Map.addLayer(slope, {min: 0, max: 60}, 'slope');



Export.image.toDrive({
  image: dataset,
  description: 'dem',
  scale: 30,
  region: geometry2,
  maxPixels: 2000000000000
});

Export.image.toDrive({
  image: slope,
  description: 'slope',
  scale: 30,
  region: geometry2,
  maxPixels: 2000000000000
});