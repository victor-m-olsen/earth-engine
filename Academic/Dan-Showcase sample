var img2016 = ee.Image('users/dmdruce/victor/2016_v2_clip')
var img2017 = ee.Image('users/dmdruce/victor/2017_v2_clip')
var img2018 = ee.Image('users/dmdruce/victor/2018_v2_clip')
var mode = ee.ImageCollection([img2016, img2017, img2018]).mode()

Map.addLayer(img2016, {min:2, max:8}, 'img2016', false)
Map.addLayer(img2017, {min:2, max:8}, 'img2017', false)
Map.addLayer(img2018, {min:2, max:8}, 'img2018', false)
Map.addLayer(mode, {min:2, max:8}, 'mode', false)
 
var new2016 = ee.Image('users/dmdruce/victor/2016-new')
var new2017 = ee.Image('users/dmdruce/victor/2017-new')
var new2018 = ee.Image('users/dmdruce/victor/2018-new')

Map.addLayer(new2016, {min:1, max:5}, 'new2016', false)
Map.addLayer(new2017, {min:1, max:5}, 'new2017', false)
Map.addLayer(new2018, {min:1, max:5}, 'new2018', false)

var samples = ee.FeatureCollection('users/dmdruce/victor/validation-sample')
Map.centerObject(samples)
Map.addLayer(samples, {}, 'samples')