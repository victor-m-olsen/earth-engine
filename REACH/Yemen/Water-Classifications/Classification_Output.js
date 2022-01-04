/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var imageVisParam = {"opacity":1,"bands":["classification"],"min":1,"max":3,"gamma":1},
    admin0 = ee.FeatureCollection("users/reachyemengis/Admin0"),
    geometry = /* color: #d63000 */ee.Geometry.Point([45.168906246169605, 15.260114485993498]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var oct_filler = ee.Image('users/reachyemengis/water_export8/water2020_10').remap([1,3], [0,1])



Map.setCenter(lon, lat, zoom)



//Monthly surface water maps

var previous = ee.Image('users/reachyemengis/water_export8/water2020_1').clip(admin0).remap([1,3], [0,1])
Map.addLayer(previous, '', '1', false)

var previous = ee.Image('users/reachyemengis/water_export8/water2020_2').clip(admin0).remap([1,3], [0,1])
Map.addLayer(previous, '', '2', false)

var previous = ee.Image('users/reachyemengis/water_export8/water2020_3').clip(admin0).remap([1,3], [0,1])
Map.addLayer(previous, '', '3', false)

var previous = ee.Image('users/reachyemengis/water_export8/water2020_4').clip(admin0).remap([1,3], [0,1])
Map.addLayer(previous, '', '4', false)

var previous = ee.Image('users/reachyemengis/water_export8/water2020_5').clip(admin0).remap([1,3], [0,1])
Map.addLayer(previous, '', '5', false)

var previous = ee.Image('users/reachyemengis/water_export8/water2020_6').clip(admin0).remap([1,3], [0,1])
Map.addLayer(previous, '', '6', false)

var previous = ee.Image('users/reachyemengis/water_export8/water2020_7').clip(admin0).remap([1,3], [0,1])
Map.addLayer(previous, '', '7', false)

var previous = ee.Image('users/reachyemengis/water_export8/water2020_8').clip(admin0).remap([1,3], [0,1])
Map.addLayer(previous, '', '8')

var previous = ee.Image('users/reachyemengis/water_export8/water2020_9').unmask(oct_filler).clip(admin0).remap([1,3], [0,1])
Map.addLayer(previous, '', '9', false)

var previous = ee.Image('users/reachyemengis/water_export8/water2020_10').clip(admin0).remap([1,3], [0,1])
Map.addLayer(previous, '', '10', false)

var previous = ee.Image('users/reachyemengis/water_export8/water2020_11').clip(admin0).remap([1,3], [0,1])
Map.addLayer(previous, '', '11', false)

var previous = ee.Image('users/reachyemengis/water_export8/water2020_12').clip(admin0).remap([1,3], [0,1])
Map.addLayer(previous, '', '12', false)
