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
        [[[26.139378567957678, 8.066997639939055],
          [26.139378567957678, 3.3677211504785713],
          [32.20383169295768, 3.3677211504785713],
          [32.20383169295768, 8.066997639939055]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var img2016 = ee.Image('users/dmdruce/victor/2016_v2_clip')
var img2017 = ee.Image('users/dmdruce/victor/2017_v2_clip')
var img2018 = ee.Image('users/dmdruce/victor/2018_v2_clip')
var mode = ee.ImageCollection([img2016, img2017, img2018]).mode()
var area = ee.Image.pixelArea().divide(1000000)
 

var i = ee.Image('users/dmdruce/victor/2016-new')
// var i = ee.Image('users/dmdruce/victor/2017-new')
// var i = ee.Image('users/dmdruce/victor/2018-new')

// var i = reformatImg(img2016)
// Export.image.toAsset({
//   image: i, 
//   description: '2018-new', 
//   assetId: 'users/dmdruce/victor/2018-new', 
//   region: geometry, 
//   scale: 10, 
//   crs: 'EPSG:4326',
//   maxPixels:10e12
// })


print(i)
Map.addLayer(i, {min:1, max:5}, 'img')

var classes = ee.Dictionary({
  "SavannahBuffer": 1,
  "Savannah": 2,
  "Forest": 3,
  "Bare/Artificial/Water": 4,
  "Cropland": 5
})

var values = classes.values()
var names = classes.keys()

var stats = area.addBands(i).reduceRegion({
    reducer: ee.Reducer.sum().group(1), 
    geometry: geometry, 
    scale: 10, 
    crs: 'EPSG:4326', 
    maxPixels: 10e12
  })
  
stats = ee.List(stats.get('groups')).map(function(g) {
    var key = ee.Dictionary(g).get('group')
    var value = ee.Dictionary(g).getNumber('sum')
    return [names.get(values.indexOf(key)), value.int()]
  }).flatten()
  
print(ee.Dictionary(stats))


// Split savanna class in two (repeat for each cropland map)

function reformatImg (img){
  var dist = img.eq(8)
                .fastDistanceTransform(30).sqrt().multiply(ee.Image.pixelArea().sqrt())
                .updateMask(img.mask())
  var buffer = dist.gt(0).and(dist.lt(100))
  var addBuffer = img.where(buffer.and(img.eq(2)), ee.Image(1))
  return addBuffer.remap([1,2,3,4,6,8], [1,2,3,4,4,5])
}


var training = ee.FeatureCollection('users/dmdruce/victor/training-data')
Map.addLayer(training, {}, 'training')
var distMask = training.distance(1000).mask().not()
Map.addLayer(distMask, {min:0, max:1}, 'distMask')


print(i)

var sample = i.updateMask(distMask)
              .stratifiedSample({
  numPoints:1, 
  classBand:'remapped', 
  region: geometry, 
  scale: 10, 
  projection: 'EPSG:4326', 
  classValues: [1,2,3,4,5],  ///buffer, savannah, Forest, Bare, Crop
  classPoints: [100,875,51,30,30], 
  dropNulls: true, 
  geometries: true
})

print(sample)
Map.addLayer(sample, {}, 'sample')
Export.table.toAsset(sample, 'sample', 'users/dmdruce/victor/validation-sample')

