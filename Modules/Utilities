 
exports.generateCollectionFromAssets = function(imageNameBase,startYear,endYear,endMonth, divide){
  // Import images from assets as a list
  var imageNameList =  ee.List([]);
  var i,j;
  for (j= startYear; j <= endYear; j++){
    for (i = 1; i < 13; i++) {
      if(j<2021 ||(j == 2021 && i <= endMonth)){                                
      var file_name = imageNameBase.concat(j).concat("_").concat(i);
      var image = ee.Image(file_name)
                .set("month", i)
                .set("year", j)
    imageNameList = imageNameList.add(image)}
  }}

  // Creating the slider collection and setting DATE property for collections
  var slider_collect = ee.ImageCollection(imageNameList)
  var divideNumber = 255
  
  return slider_collect.map(function(image){
         var m = image.get("month")
         var y= image.get("year")
         if(!divide){ divideNumber = 1 }
         return image.toFloat().divide(divideNumber).set('system:time_start', ee.Date.fromYMD(y, m, 1)).set("month",m).set("year",y);
       })     

}
