

var imageVisParam = {
"opacity":1,
"bands":["remapped"],
"min":0,
"max":1,
"palette":["ffffff","20099d"]
};

// var img = ee.Image("users/reachyemengis/water_export9/water2020_1")
// print(img)


// Import images from assets as a list
var imageNameBase = "users/reachyemengis/water_export9/water2020_"
var imageNameList =  ee.List([]);
var i;
for (i = 1; i < 13; i++) {
  var file_name = imageNameBase.concat(i);
  var image = ee.Image(file_name)
  var image = image.set("month", i)
  var image = image.set("year", 2020)
  imageNameList = imageNameList.add(image)
  }

// Creating the slider collection
var slider_collect = ee.ImageCollection(imageNameList)

// Set DATE property for collection used in time sliders
slider_collect = slider_collect.map(function(image){
      var m = image.get("month")
      var y = image.get("year")
      return image.set('system:time_start', ee.Date.fromYMD(y, m, 1));
    })     

var chart_collect = slider_collect.map(function(image){
      var m = image.get("month")
      var y = image.get("year")
      return image.set('system:time_start', ee.Date.fromYMD(y, m, 1));
    })

// Configure the map.
Map.style().set('cursor', 'crosshair');
Map.setCenter(45.26490,15.39012, 12)

var collection = slider_collect;

// Define start and end of slider
var start = ee.Image(collection.first()).get("system:time_start")//.get('month').format();
var end = ee.Date('2020-12-31')

print('start', start)
print('end', end)

// Run this function on every 'change' of the dateSlider.

var showMosaic = function(range) {
      var mosaic =  collection.filterDate(range.start(), range.end())
  
  // Asynchronously compute the name of the composite.  Display it.
  range.start().get('month').evaluate(function(name) {
    var visParams = {bands: ['classification'], max: 1};
    var layer = ui.Map.Layer(mosaic, imageVisParam, "Surface Water - Year: 2020, Month: "+name );
    Map.layers().set(0, layer);
  });
};

// Asynchronously compute the date range and show the slider.
  var dateSlider = ui.DateSlider({
    start: 1577836800000,
    end: 1608422400000,
    value: null,
    period: 30,
    onChange: showMosaic,
     style: {width: '32%',backgroundColor: 'ffffff50', 
     position:"bottom-left", padding: '0px 0px 2px 2px', margin: '0px 0px 0px 0px'   }
  });

  Map.add(dateSlider.setValue('2020-08-01'));

//Map.add(dateSlider.setValue(end));


// set position of panel
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
    //backgroundColor: '#C0C0C0'
  }
});

// Create legend title
var legendTitle = ui.Label({
  value: 'Legend',
  style: {
    fontWeight: 'bold',
    fontSize: '16px',
    margin: '0 0 4px 0',
    padding: '0',
    //backgroundColor: '#C0C0C0'
    }
});

// Add the title to the panel
legend.add(legendTitle);

// Creates and styles 1 row of the legend.
var makeRow = function(color, name) {
      
      // Create the label that is actually the colored box.
      var colorBox = ui.Label({
        style: {
          backgroundColor: '#' + color,
          // Use padding to give the box height and width.
          padding: '8px',
          margin: '0 0 4px 0'
          //backgroundColor: '#C0C0C0'
        }
      });
      
      // Create the label filled with the description text.
      var description = ui.Label({
        value: name,
        style: {margin: '0 0 4px 6px'
        //backgroundColor: '#C0C0C0'
        }
      });
      
      // return the panel
      return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
      });
};

//  Palette with the colors
var palette =['20099d'] //, 'FFFFFF'];

// name of the legend
var names = ['Surface Water'];

// Add color and and names
for (var i = 0; i < 1; i++) {
  legend.add(makeRow(palette[i], names[i]));
  }  

// add legend to map (alternatively you can also print the legend to the console)  
Map.add(legend);



var title = ui.Label({
  value: 'Monthly Surface Water in Yemen 2020',
  style: {
    position: 'top-center',
    backgroundColor: 'ffffff80',
      // fontWeight: 'light',
    fontSize: '20px',
    // margin: '0 0 4px 0',
    padding: '8px',
  }
})

Map.add(title);

Map.setOptions('TERRAIN',{} ,  ['HYBRID', "TERRAIN"]);