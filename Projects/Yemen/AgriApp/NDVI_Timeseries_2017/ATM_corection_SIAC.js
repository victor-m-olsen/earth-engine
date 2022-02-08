// ######################################################################################################
// ######################################################################################################
//                                    ### ATMOSPHERIC CORRECTION WITH SIAC  ###
// ######################################################################################################
/* 
For a description of the SIAC method, please see <https://github.com/MarcYin/SIAC_GEE>, and 
Yin, F., Lewis, P. E., Gomez-Dans, J., & Wu, Q. (2019, February 21). 
A sensor-invariant atmospheric correction method: application to Sentinel-2/MSI and Landsat 8/OLI. 
https://doi.org/10.31223/osf.io/ps957
*/ 

// ---- Area of Interest (AOI) and User parameters
var ground_sensor = ee.Geometry.Point(-52.905090, -28.228550);
var polygon = ground_sensor.buffer(1000).bounds();//
var start_date = '2017-11-15';
var end_date   = '2017-11-30';

var criteria = ee.Filter.and(
    ee.Filter.bounds(ground_sensor), ee.Filter.date(start_date, end_date));
var cloud_perc = 60;//Max cloud percentile per scene.    

// -- Collections of Landsat 7, 8 and Sentinel 2 TOA data
var L8_col = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
                .filter(criteria)
                .filter(ee.Filter.lt('CLOUD_COVER', cloud_perc));

var L7_col = ee.ImageCollection('LANDSAT/LE07/C01/T1_TOA')
                .filter(criteria)
                .filter(ee.Filter.lt('CLOUD_COVER', cloud_perc));

var S2_col = ee.ImageCollection("COPERNICUS/S2")
                .filter(criteria)
                .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', cloud_perc));
                
                
// - Import the SIAC atmospheric correction module
var siac = require('users/marcyinfeng/utils:SIAC');

// - Apply SIAC and retrieve bottom of atmosphere (BOA) reflectance
var L7_boa = siac.get_l7_sur(L7_col.first());
var L8_boa = siac.get_l8_sur(L8_col.first()); 
var S2_boa = siac.get_sur(S2_col.first()); 


// - Check and visualization
var Color_comp_01 = {bands:"B4,B3,B2", min: 0.0, max: 0.2, gamma: 1};
var Color_comp =    {bands:"B4,B3,B2", min:200, max:2000, gamma: 1};
Map.addLayer(S2_col.first(), Color_comp, 'TOA');
Map.addLayer(S2_boa, Color_comp_01, 'BOA');
Map.centerObject(S2_col.first())



                