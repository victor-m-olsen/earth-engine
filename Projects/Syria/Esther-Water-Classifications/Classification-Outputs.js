// Final surface water maps

// 2017
var asset_path = 'users/'+ 'reachsyriagee' + '/SY_Water/classified/AOI_WoS/final/error_corrected_1236/'
var assetId = asset_path + 'water_2017_'
var imgCol_17 = get_imgCol(assetId)
print(imgCol_17)

// 2018
var asset_path = 'users/'+ 'reachsyriagee' + '/SY_Water/classified/AOI_WoS/final/error_corrected_123/'
var assetId = asset_path + 'water_2018_'
var imgCol_18 = get_imgCol(assetId)
print(imgCol_18) 

// 2019
var asset_path = 'users/'+ 'reachsyriagee' + '/SY_Water/classified/AOI_WoS/final/error_corrected_123/'
var assetId = asset_path + 'water_2019_'
var imgCol_19 = get_imgCol(assetId)
print(imgCol_19) 

// 2020
var asset_path = 'users/'+ 'reachsyriagee' + '/SY_Water/classified/AOI_WoS/final/error_corrected_12/'
var assetId = asset_path + 'water_2020_'
var imgCol_20 = get_imgCol(assetId)
print(imgCol_20) 


// 2021
var asset_path = 'users/'+ 'reachsyriagee' + '/SY_Water/classified/AOI_WoS/final/error_corrected_12/'
var assetId = asset_path + 'water_2021_'

var imgCol_21 = ee.ImageCollection([
  ee.Image(assetId+1),
  ee.Image(assetId+2),
  ee.Image(assetId+3),
  ee.Image(assetId+4),
  ee.Image(assetId+5),
  ee.Image(assetId+6)
  ])
  
print(imgCol_21) 

  
var imgCol_merged = imgCol_17.merge(imgCol_18).merge(imgCol_19).merge(imgCol_20).merge(imgCol_21)


var listOfImages = imgCol_merged
var listOfImages = listOfImages.toList(listOfImages.size())
var len = listOfImages.size();

var id = 0;
var year = 2017
var bool;

len.evaluate(function(l) {
  for (var i=0; i < l; i++) {
    id +=1
    // console.log('i '+ i + 'id '+ id)

    var img = ee.Image(listOfImages.get(i)); 
    Map.addLayer(img, {palette: ['white', 'blue'], min:0, max:3}, year+ ' ' + id,false)
    
    bool = (i+1) % 12 === 0
    if (bool) {id = 0; year += 1}
  } 
});

function get_imgCol(assetId){
  
  var imgCol = ee.ImageCollection([
    ee.Image(assetId+1),
    ee.Image(assetId+2),
    ee.Image(assetId+3),
    ee.Image(assetId+4),
    ee.Image(assetId+5),
    ee.Image(assetId+6),
    ee.Image(assetId+7),
    ee.Image(assetId+8),
    ee.Image(assetId+9),
    ee.Image(assetId+10),
    ee.Image(assetId+11),
    ee.Image(assetId+12)
  ])
  
  return imgCol
}


