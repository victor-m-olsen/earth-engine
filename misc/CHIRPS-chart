/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[38.31555309911268, 37.320805091113726],
          [38.31555309911268, 27.939572376619665],
          [49.96106091161268, 27.939572376619665],
          [49.96106091161268, 37.320805091113726]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var CHIRPS = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
                  .filter(ee.Filter.date('2016-01-01', '2019-12-31')).select('precipitation');
var precipitationVis = {
  min: 1.0,
  max: 17.0,
  palette: ['001137', '0aab1e', 'e7eb05', 'ff4a2d', 'e90000'],
};
Map.addLayer(CHIRPS, precipitationVis, 'Precipitation');

//geometry12
print('geometry2')
print(ui.Chart.image.series(CHIRPS, geometry, ee.Reducer.mean()));