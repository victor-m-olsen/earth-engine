/// victor v2
/// savanna class only where > 5km from cropland ///DONE
/// -- ignore single pixel cropland.             ///DONE
/// flag samples if within ~1km of all human activity (roads/villages etc.) ///DONE
/// check if sample is on exposed rock. (bare category)  ///NO
/// Forest = NDVI > 0.3 in dry season (jan, feb, march)  ///DONE
/// Savanna = NDVI < 0.3 in dry season.                  ///DONE

Map.setOptions('hybrid')
var a = ee.Image('users/dmdruce/victor/2016-new')
var b = ee.Image('users/dmdruce/victor/2017-new')
var c = ee.Image('users/dmdruce/victor/2018-new')

print(a)
var geom = a.geometry()
Map.addLayer(a, {min:1, max:5}, 'i', false)

/// if dry season ndvi freq gt than thresh, then forest. 0.5 or 1. (Jan/Feb/Mar)
/// if 0.5 then 345 possible forest
/// if 1.0 (100%) then 171 forest class.
var forestThresh = 1.0

/// If wet season freq is lt bareThresh check if rock.
var bareThresh = 0.2

var distHumThresh = 1000 // in meters

var cropErosion = 20 /// in meters
var distCropThresh = 1000 // in meters // CHANGE

var NDVI_threshold = 0.4


/// osm data
var buildings = ee.FeatureCollection('users/dmdruce/victor/hotosm_buildings')
var populated = ee.FeatureCollection('users/dmdruce/victor/hotosm_populated_places')
var roads = ee.FeatureCollection('users/dmdruce/victor/hotosm_roads')
var water = ee.FeatureCollection('users/dmdruce/victor/hotosm_waterways')

Map.addLayer(buildings, {}, 'buildings', false)
Map.addLayer(populated, {}, 'populated', false)
Map.addLayer(roads, {}, 'roads', false)
Map.addLayer(water, {}, 'water', false)

/// excluding water for now
var human = ee.FeatureCollection([buildings, populated, roads])
              .flatten()
              .filterBounds(geom)
              .distance(distHumThresh)
              .mask()
              .updateMask(a.mask())
              

Map.addLayer(human, {}, 'human', false)


var classes = ee.Dictionary({
  "SavannahBuffer": 1,
  "Savannah": 2,
  "Forest": 3,
  "Bare/Artificial/Water": 4,
  "Cropland": 5
})


var sample = ee.FeatureCollection('users/dmdruce/victor/validation-sample')
               .select(['remapped'], ['sample'])
print(sample.first())

var sav = sample.filter(ee.Filter.eq('sample', 2))
print(sav.size())
Map.addLayer(sav, {}, 'savanna samples', false)
 

var i2016 = sampleCheck(a, 2016)
var i2017 = sampleCheck(b, 2017)
var i2018 = sampleCheck(c, 2018)


var multiYearStack = ee.ImageCollection([i2016, i2017, i2018]).toBands()
                       .addBands(human)
print(multiYearStack)

var proj = a.projection()
print(proj)
var check = multiYearStack.sampleRegions({collection:sample, scale:10, projection:proj, geometries:true}) // OBS: All samples included. change to sav only
                          .map(function(f){
                            var hum = f.getNumber('distance').eq(1)
                            var crop = f.getNumber('2016_croplandBuffer').or(
                               f.getNumber('2017_croplandBuffer').or(
                                  f.getNumber('2018_croplandBuffer'))).eq(1)
                            return f.set('check', hum.or(crop))
                          })
print('check', check)

Export.table.toDrive({
  collection: check, 
  description: 'validation-samples', 
  fileFormat: 'SHP'
})

Export.table.toDrive({
  collection: sample, 
  description: 'original-samples', 
  fileFormat: 'SHP'
})




////// Total to be checked
print(check.filter(ee.Filter.eq('check', 1)).size())

/// These samples need checking as close to human stuff.
var humDist = check.filter(ee.Filter.eq('distance', 1))
print('close to human:', humDist.size())

/// These samples need checking as close to cropland.
var cropDist = check.filter(
  ee.Filter.or(
    ee.Filter.eq('2016_croplandBuffer', 1),
    ee.Filter.eq('2017_croplandBuffer', 1),
    ee.Filter.eq('2018_croplandBuffer', 1)
    )
  )
print('close to crop:', cropDist.size())


/// These samples are probably forest.
var forestS = check.filter(
  ee.Filter.or(
    ee.Filter.eq('2016_forest', 1),
    ee.Filter.eq('2017_forest', 1),
    ee.Filter.eq('2018_forest', 1)
    )
  )
print('Forest class:', forestS.size())


/// check these for bare
var bareS = check.filter(
  ee.Filter.or(
    ee.Filter.eq('2016_bare', 1),
    ee.Filter.eq('2017_bare', 1),
    ee.Filter.eq('2018_bare', 1)
    )
  )
print('Bare class:', bareS.size())







function sampleCheck (img, year){
  var months = ee.List.sequence(1, 12, 1)
  
  var ndviCollection = months.map(function(m){
    var date = ee.Date.fromYMD(year, m, 1)
    var end = date.advance(1, 'month')
    
    var s2 = getS2cloudless(geom, date, end).map(function(i){
        return i.normalizedDifference(['B8', 'B4'])
                .updateMask(i.select('probability').lt(40))
                .rename('ndvi')
      }).max().gt(NDVI_threshold) // CHANGE
    
    return ee.Image(s2).set('y', year, 'm', m, 'dry', ee.Number(m).lte(3), 'system:index', date.format('YYYYMM'))
  })
  
  var dry = ee.ImageCollection(ndviCollection).filter(ee.Filter.eq('dry', 1))
  var dryCount = dry.count().rename('dryCount')
  var dryFreq = dry.sum().divide(dryCount).rename('dryFreq')
  
  var wet = ee.ImageCollection(ndviCollection).filter(ee.Filter.eq('dry', 0))
  var wetCount = wet.count().rename('wetCount')
  var wetFreq = wet.sum().divide(wetCount).rename('wetFreq')
  
  var forest = dryFreq.gte(forestThresh).rename('forest')
  var bare = wetFreq.lte(bareThresh).rename('bare')

  var cropland_simple = dilate(erode(img.eq(5), cropErosion), distCropThresh).unmask(0).rename('croplandBuffer')
  
  /// sav (2), forest (3), bare (4)
  var lc_class = ee.Image(2).where(forest, 3).where(bare, 4).rename('LCclass')

  var stack = dryCount.addBands([dryFreq, wetCount, wetFreq, cropland_simple, forest, bare, lc_class])
                 .updateMask(img.mask())
                 .set('system:index', ee.Number(year).format('%04d'))
  
  
  return stack
}



function getS2Imgs (bounds, s, e){
  return ee.ImageCollection("COPERNICUS/S2")
           .filter([
             ee.Filter.date(s,e),
             ee.Filter.bounds(bounds),
             ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 70)
             ])
          .map(maskEdges)
}


function getS2cloudless (bounds, s, e){
  var primary = getS2Imgs(bounds, s, e) //get the SR products.
  var cloudless = ee.ImageCollection("COPERNICUS/S2_CLOUD_PROBABILITY").filterBounds(bounds).filterDate(s,e)
  /// join them
  var join = ee.Join.inner()
               .apply(primary, cloudless, ee.Filter.equals({leftField:'system:index', rightField:'system:index'})) 
               .map(function (j){
                 var cl = ee.Image(j.get('secondary'))
                 var sr = ee.Image(j.get('primary'))
                 return sr.addBands(cl).copyProperties(sr)
               })
  
  return ee.ImageCollection(join)
}


function maskEdges(s2_img) {
  return s2_img.updateMask(s2_img.select('B8A').mask()
               .updateMask(s2_img.select('B9').mask()))
               .copyProperties(s2_img);
}


function erode(img, distance) {
  var d = (img.not().unmask(1)
       .fastDistanceTransform(30).sqrt()
       .multiply(ee.Image.pixelArea().sqrt()))
  return img.updateMask(d.gt(distance))
}

function dilate(img, distance) {
  var d = (img.fastDistanceTransform(30).sqrt()
       .multiply(ee.Image.pixelArea().sqrt()))
  return d.lt(distance)
}
