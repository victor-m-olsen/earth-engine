/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #23cba7 */ee.Geometry.MultiPoint();
/***** End of imports. If edited, may not auto-convert in the playground. *****/


// CONSTANTS
var baseRepo = "users/reachsyriagee/"
var imageNameBase = "users/reachsyriagee/SY_NDVI/Syria_NDVI_"
var waterNameBase = 'users/reachsyriagee/SY_Water/final/water_'


var Utils = require('users/reachsyriagee/Modules:Utilities')
var Interface = require('users/reachsyriagee/Modules:Interface')

var syrAdm3  = ee.FeatureCollection(baseRepo + "Admin_Areas/syr_adm3"); 

 


var NDVIColor  = "006600"
var visParamsNDVI = {bands: ["NDVI"], max: 0.85, min: 0.1, opacity: 1, palette: ["ffffff", NDVIColor ]}
var waterVisParams = {bands: ["Water"], palette: ["ffffff00","ffffff00",'blue'], min:1, max:3}

var start = ee.Date('2017-01-01');

var end = ee.Date('2021-09-30') // 2021-08-08

var startYear = start.get('year').getInfo()

var endYear = end.get('year').getInfo()
var endMonth = end.get('month').getInfo()



// CONFIGURE MAP
Map.style().set('cursor', 'crosshair');

Map.setCenter(37,35, 7)



// CREATE COLLECTION FROM ASSETS
var imageCollect= Utils.generateCollectionFromAssets(imageNameBase,startYear,endYear,9,true)


var waterCollect= Utils.generateCollectionFromAssets(waterNameBase,startYear,endYear,9,false)
waterCollect = waterCollect.map(function(image){return image.selfMask().select(["classification"],["Water"])})


print(imageCollect)
print(waterCollect)

// FILTER NDVI VALUES
var filteredCollect = imageCollect.map(function(image){    
  return image.updateMask(image.select("NDVI").gt(0.3))})
  
var filteredCollect = filteredCollect.select(["NDVI"], ["Area"])


//SETTING THE UI PANEL
var panel = ui.Panel({style: {width: '400px', backgroundColor:'ffffff50'}})

var dataSeriesPanel = ui.Panel({
  style: {width: '400px', backgroundColor:'ffffff50', padding: '5px 5px'},
  layout: ui.Panel.Layout.flow('horizontal'),
})

panel = Interface.setPanel(panel,"Syria")

dataSeriesPanel.widgets().set(0, ui.Label(" "))

panel.widgets().set(1, dataSeriesPanel);


// CREATE DATE-SLIDER TO DISPLAY COMPOSITES
var collections =  [imageCollect,waterCollect]
var labels = ["NDVI - Year: ","Water - Year: "]
var visParams = [visParamsNDVI, waterVisParams]

var dateSlider = Interface.createAndSetDateSliders(start, end, collections, visParams, labels)
// var dateSlider = Interface.createAndSetDateSlider(start, end, collections, waterVisParams, "NDVI - Year: ")
  
Map.add(dateSlider.setValue(end.advance(-2,"week")));

print(Map.widgets())



//ADMINISTRATIVE AREA CHART AND ZOOM TOOL

var admAttributeNames = ["admin1Name","admin2Name","admin3Name"]

var placeHolders = ['Select a Governorate','Select a District','Select a Sub-district']

var buildAdmWidgets = function(){
  var selectAdm1 = Interface.buildAdmAreaWidget(admAttributeNames, placeHolders,1, collections, syrAdm3, panel)
  panel.widgets().set(2, selectAdm1);
  
  var selectAdm2 = Interface.buildAdmAreaWidget(admAttributeNames, placeHolders, 2, collections, syrAdm3, panel)
  panel.widgets().set(3, selectAdm2);
  
  var selectAdm3 = Interface.buildAdmAreaWidget(admAttributeNames, placeHolders, 3, collections, syrAdm3, panel)
  panel.widgets().set(4, selectAdm3);
}

buildAdmWidgets()




//GEOMETRY DRAWING TOOL
var drawingTools = Map.drawingTools().setShown(false);

while (drawingTools.layers().length() > 0) {
  var layer = drawingTools.layers().get(0);
  drawingTools.layers().remove(layer);
}

var dummyGeo = ui.Map.GeometryLayer({geometries: null, name: 'geometry', color: '23cba7'});

drawingTools.layers().add(dummyGeo)

function chartNdviGeometry() {
  var aoi = drawingTools.layers().get(0).getEeObject();

  drawingTools.setShape(null);
  
  var chart = Interface.chartSeries("NDVI",aoi,imageCollect,ee.Reducer.mean(),false)
  panel.widgets().set(5, chart);

  var waterChart = Interface.chartSeries("Water (m²)",aoi,waterCollect,ee.Reducer.sum(),true)
  panel.widgets().set(6, waterChart);
  Interface.drawPolygon(drawingTools)
}

drawingTools.onDraw(ui.util.debounce(chartNdviGeometry, 500));

Interface.drawPolygon(drawingTools)




// SETTING TITLE, LEGEND AND BASEMAP ELEMENTS
var legendPaletteNDVI =[ NDVIColor +'00', NDVIColor+'50', NDVIColor,'0000ff' ];
var legendNamesNDVI = ['NDVI: 0 ','NDVI: 0.5','NDVI: 1', "Water"];


Interface.createAndSetMapElements('NDVI of Agricultural Areas in Syria 2017-2021',legendPaletteNDVI,legendNamesNDVI,4)


