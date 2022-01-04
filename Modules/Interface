/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var syrAdm3 = ee.FeatureCollection("users/pedrovieirac/Syria/syr_adm3");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
 
var chartSeries = function(varString, geo, imageCollect) {
  
  var title = varString.concat(" Over Time")

  return ui.Chart.image.series(imageCollect, geo, ee.Reducer.mean(), 30)
      .setOptions({
        title: title,
        vAxis: {title: varString},
        lineWidth: 1,
        pointSize: 3,
        maxPixels: 1000000000,
        bestEffort: true
      })
}


exports.chartSeries = chartSeries




exports.setPanel = function(panel) {

ui.root.add(panel);
  
var description_label = ui.Label({value:'This Google Earth Engine application allows for localized agricultural analysis of Syria at\nGovernorate, District and Sub-district level, as well as of custom-drawn features and \nindividual pixels, by plotting an NDVI time series of specified areas on the map.'+ 
'\n\nThe application also allows scrolling through monthly NDVI products of agricultural areas of the \ncountry. For plotting an NDVI time series at any administrative level, use the drop-down buttons.\nFor custom plots, draw or click directly on the map. '+
'Click on different periods of the year in the\ntime-slider (located in bottom portion of the map) to view the different monthly NDVI products for\n the agricultural areas of the country.'+
'\n\nNDVI is an indicator of vegetation health due to its close correlation with photosynthetic activity\n and chlorophyll. An NDVI value of <0.2 indicates dry or sparse vegetation, whilst a value\n of >0.5 tipically indicates healthy vegetation.'+
'The NDVI products are derived from Sentinel-2\n10-meter resolution satellite imagery, treated for cloud and cloud-shadow coverage, masked\nby FAO WaPor crop masks of the year, and filtered to remove zero values.'
, style: {
    position: 'bottom-center',
    backgroundColor: 'ffffff99',
      // fontWeight: 'light',
    fontSize: '9px',
    // margin: '0 0 4px 0',
    padding: '2px',
    whiteSpace: 'pre'}})

 panel.widgets().set(0, description_label);
 
 return panel
}






 


var update_widgets = function(admAttributeNames, placeHolders, level, imageCollect, admFeatures, panel ) {
  var level = level + 1

  if(level ==2){
  // var adm2_filtered = admFeatures.aggregate_array(admAttributeName).distinct().sort().getInfo()
  // var adm3_filtered = admFeatures.aggregate_array(admAttributeName).distinct().sort().getInfo()

  var selectAdm2 = buildAdmAreaWidget(admAttributeNames, placeHolders, level, imageCollect, admFeatures, panel)
  panel.widgets().set(4, selectAdm2);
  }
  else if(level ==3){
      // var adm3_filtered = admFeatures.aggregate_array(admAttributeName).distinct().sort().getInfo()
      var selectAdm3 = buildAdmAreaWidget(admAttributeNames, placeHolders, level, imageCollect, admFeatures, panel)
      panel.widgets().set(5, selectAdm3);
  }
}


var createAndSetLayer = function(feature, key, adm) {
    var feature = feature.union();
    Map.centerObject(feature)
    
    var empty = ee.Image().byte();
    var outline = empty.paint({
    featureCollection: feature,
    color: 1,
    width: 2
    });
    
    var layer = ui.Map.Layer(outline, {palette: '202020'}, adm+key, true, 0.9 );
    Map.layers().set(1, layer);
    
    // Map.addLayer(outline, {palette: 'FF0000'}, 'edges');
}


exports.createAndSetLayer = createAndSetLayer





var buildAdmAreaWidget = function(admAttributeNames, placeHolders, level, imageCollect, admFeatures, panel ) {

var index = level -1 
var admAttributeName = admAttributeNames[index]
var placeHolder = placeHolders[index]

var admAreaNames = admFeatures.aggregate_array(admAttributeName).distinct().sort().getInfo()


var zoomToAdm1 = function(key) {
    var feature = admFeatures.filter(ee.Filter.eq(admAttributeName, key))
    update_widgets(admAttributeNames, placeHolders, level, imageCollect, feature, panel );
    createAndSetLayer(feature, key, "Governorate: ")
    var chart = chartSeries("NDVI",feature,imageCollect)
    panel.widgets().set(6, chart);
  }


var zoomToAdm2 = function(key) {
  var feature = admFeatures.filter(ee.Filter.eq(admAttributeName, key))
    update_widgets(admAttributeNames, placeHolders, level, imageCollect, feature, panel );
    createAndSetLayer(feature, key, "District: ")
    var chart = chartSeries("NDVI",feature,imageCollect)
    panel.widgets().set(6, chart);
}


var zoomToAdm3 = function(key) {
  var feature = admFeatures.filter(ee.Filter.eq(admAttributeName, key))
    createAndSetLayer(feature, key, "Sub-district: ")
    var chart = chartSeries("NDVI",feature,imageCollect)
    panel.widgets().set(6, chart);
}


if( level==1){
  return ui.Select({
  items: admAreaNames,
  placeholder: placeHolder,
  onChange: zoomToAdm1
}); 
}
else if( level ==2){
    return ui.Select({
  items: admAreaNames,
  placeholder: placeHolder,
  onChange: zoomToAdm2
});
}
else if( level ==3){
    return ui.Select({
  items: admAreaNames,
  placeholder: placeHolder,
  onChange: zoomToAdm3
});
}


}


 
 exports.buildAdmAreaWidget = buildAdmAreaWidget
 
 
 
 
 