/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var imageCollection = ee.ImageCollection("COPERNICUS/S2_SR"),
    imageVisParam = {"opacity":1,"bands":["B4","B3","B2"],"min":599.7778351485231,"max":3637.6106452436334,"gamma":2.186},
    imageVisParam2 = {"opacity":1,"bands":["NDVI"],"palette":["c6ffd0","067f1a"]},
    geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[35.07293276590006, 30.735763423437945],
          [35.07293276590006, 29.705774208787986],
          [36.28142885965006, 29.705774208787986],
          [36.28142885965006, 30.735763423437945]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var AOI = ee.Geometry.Point(35.564, 30.666)
var START_DATE = '2020-12-21'
var END_DATE = '2020-12-22'
var CLOUD_FILTER = 60


var image = imageCollection.filterBounds(AOI).filterDate(START_DATE, END_DATE).first()

print(image)

Map.addLayer(image, imageVisParam, 'image', false)

var nir = image.select('B5');
var red = image.select('B4');
var ndvi = nir.subtract(red).divide(nir.add(red)).rename('NDVI');

Map.addLayer(ndvi, '', 'ndvi', false)

// var gt03 = i.gt(0.3).selfMask().rename('NDVI_gt03');

// Create a binary mask.
var ndvi_mask = ndvi.gt(0.3) //ee.Filter(ee.Filtereq(1);

var ndvi_masked = ndvi.mask(ndvi_mask)


Map.addLayer(ndvi_masked, imageVisParam2, 'ndvi_masked', false)


// // Update the composite mask with the water mask.
// var maskedComposite = median.updateMask(mask);
// Map.addLayer(maskedComposite, visParams, 'masked');

// Index = (NIR - MIR)/ (NIR + MIR) using Sentinel-2 Band 8 (NIR) and Band 12 (MIR). 

var ndwi = image.normalizedDifference(['B8', 'B12']);

Map.addLayer(ndwi, '', 'ndwi', false)

// Create a binary mask.
var ndwi_mask = ndwi.gt(0.4) //ee.Filter(ee.Filtereq(1);


var ndwi_masked = ndvi.mask(ndwi_mask)

Map.addLayer(ndwi_masked, '', 'ndwi_masked', false)



/////OBS: Commented out to avoid activation of code
Export.image.toDrive({
  image: ndvi_masked,
  description: 'ndvi_masked2',
  scale: 10,
  maxPixels: 2000000000000
  region: geometry
});

Export.image.toDrive({
  image: ndwi_masked,
  description: 'ndwi_masked2',
  scale: 10,
  maxPixels: 2000000000000
  region: geometry
});

  
  
