/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var imageCollection = ee.ImageCollection("projects/planet-nicfi/assets/basemaps/africa"),
    imageVisParam = {"opacity":1,"bands":["R","G","B"],"min":-219.98873659809885,"max":1381.5813476814737,"gamma":1.4180000000000001},
    geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[30.62416511928375, -9.022595659035527],
          [30.62416511928375, -15.587823878612776],
          [37.01820808803375, -15.587823878612776],
          [37.01820808803375, -9.022595659035527]]], null, false),
    imageVisParam2 = {"opacity":1,"bands":["R","G","B"],"min":273.5,"max":1365.5,"gamma":1.4180000000000001},
    imageVisParam3 = {"opacity":1,"bands":["R","G","B"],"min":118,"max":1480,"gamma":1.4180000000000001},
    imageVisParam4 = {"opacity":1,"bands":["R","G","B"],"min":118,"max":1480,"gamma":1.4180000000000001};
/***** End of imports. If edited, may not auto-convert in the playground. *****/


print(imageCollection.first()) //.filterDate('2021-01-01','2021-09-22'))

Map.addLayer(imageCollection.first(), imageVisParam4, '0')
// Map.addLayer(ee.Image(imageCollection.filterDate('2021-01-01','2021-09-22').toList(100).get(1)), imageVisParam4, '1')
// Map.addLayer(ee.Image(imageCollection.filterDate('2021-01-01','2021-09-22').toList(100).get(2)), imageVisParam4, '2')
// Map.addLayer(ee.Image(imageCollection.filterDate('2021-01-01','2021-09-22').toList(100).get(3)), imageVisParam4, '3')
// Map.addLayer(ee.Image(imageCollection.filterDate('2021-01-01','2021-09-22').toList(100).get(4)), imageVisParam4, '4')
// Map.addLayer(ee.Image(imageCollection.filterDate('2021-01-01','2021-09-22').toList(100).get(5)), imageVisParam4, '5')
