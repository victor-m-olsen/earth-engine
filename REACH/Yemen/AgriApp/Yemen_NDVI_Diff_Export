/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var aoi = 
    /* color: #d63000 */
    /* shown: false */
    /* locked: true */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[42.924140080910576, 16.819755315621983],
          [42.924140080910576, 13.291504414325763],
          [51.606085881691826, 13.291504414325763],
          [51.606085881691826, 16.819755315621983]]], null, false),
    imageVisParam = {"opacity":1,"bands":["red","green","blue"],"min":200.72,"max":2875.28,"gamma":1},
    imageVisParamMNDWI = {"opacity":1,"bands":["MNDWI"],"min":0,"max":0.8,"palette":["ffffff","3d8cdc"]},
    table = ee.FeatureCollection("users/pedrovieirac/yem_adm3_polygons"),
    imageVisParamNDVI = {"opacity":1,"bands":["NDVI"],"min":0,"max":0.9,"palette":["ffffff","0cc219"]},
    WaPor_LULC17 = ee.Image("users/pedrovieirac/Yemen/WaPor_LULC_17"),
    WaPor_LULC18 = ee.Image("users/pedrovieirac/Yemen/WaPor_LULC_18"),
    WaPor_LULC19 = ee.Image("users/pedrovieirac/Yemen/WaPor_LULC_19"),
    WaPor_LULC20 = ee.Image("users/pedrovieirac/Yemen/WaPor_LULC_20");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
 
// CONSTANTS
var baseRepo = "users/pedrovieirac/"
var imageNameBase = "users/pedrovieirac/Filtered_NDVI_"

var NDVI_color = "006600"

var negative_color = "660066"

var imageVisParamsNDVI = {bands: ["NDVI"],
max: 0.7,
min: -0.7,
opacity: 1,
palette: [negative_color,"ffffff", NDVI_color]}

var yem_adm3  = ee.FeatureCollection(baseRepo + "Yemen/yem_adm3_polygons");


// Configure the map.
Map.style().set('cursor', 'crosshair');
Map.setCenter(44,15, 7)


// Import images from assets as a list
var imageNameList =  ee.List([]);
var diffImageList =  ee.List([]);

var i,j;
for (j= 2019; j < 2022; j++){
for (i = 1; i < 13; i++) {
  if(j<2021 ||(j == 2021 && i < 5)){
  var file_name = imageNameBase.concat(j).concat("_").concat(i);
  var image = ee.Image(file_name)
  var image = image.set("month", i)
  var image = image.set("year", j)
  imageNameList = imageNameList.add(image)}
  
  if(j==2020){
    // print(image)
    // print(imageNameList.get(i-1))
    var image1 = image.toFloat().divide(255)
    var image2 = ee.Image(imageNameList.get(i-1)).toFloat().divide(255)
    var diff_image = image1.subtract(image2)
    diffImageList = diffImageList.add(diff_image)
  }
}}

print(diffImageList, "Image List")


Map.addLayer(ee.Image(diffImageList.get(6)),imageVisParamsNDVI, 'NDVI Diff 5', false)

var year = "2020"


var name_base = ee.String("Diff_NDVI_").cat(ee.String(year)).cat(ee.String("_"))
var i;

for (i = 1; i < 13; i++) {
  var id  = i
  var name = name_base.getInfo().concat(i)
  var image1 = ee.Image(diffImageList.get(i-1))
  
  // Export classification
  Export.image.toAsset({
  description:name,
  image:image1,
  assetId: 'Yemen/'+name,
  scale: 10,
  region: WaPor_LULC20.geometry(),
  maxPixels: 2000000000000
})}


