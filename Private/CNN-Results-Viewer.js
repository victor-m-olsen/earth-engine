/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var image = ee.Image("users/victormackenhauer/Classified_pixel_demo");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
Map.addLayer(image)

print(image)
var LABEL_DATA = ee.FeatureCollection('projects/google/demo_landcover_labels')

Map.addLayer(LABEL_DATA.select('prediction'), '', 'prediction')
Map.addLayer(LABEL_DATA.select('waterProb'), '', 'waterProb')
Map.addLayer(LABEL_DATA.select('vegProb'), '', 'vegProb')
Map.addLayer(LABEL_DATA.select('bareProb'), '', 'bareProb')



print('LABEL_DATA', LABEL_DATA)