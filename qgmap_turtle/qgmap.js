// main var
var map;
var markers=[];
var flightPath ;

var turtle_line  = [];
var pos_veleiro ;


var styleArray = [
    {
      featureType: "all",

      // stylers: [
      //  { saturation: -80 }
      // ]
    

    },{
      featureType: "road.arterial",
      elementType: "geometry"
    

      // ,
      // stylers: [
      //   { hue: "blue" },
      //   { saturation: 80 }
      // ]
    

    },{
      featureType: "poi.business",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];


// main init function
function initialize() {

    var myOptions = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: styleArray
    };

	var div = document.getElementById("map_canvas");

    map = new google.maps.Map(div, myOptions);
	
	google.maps.event.addListener(map, 'dragend', function() {
		center = gmap_getCenter();
		qtWidget.mapMoved(center.lat(), center.lng());
	});
	google.maps.event.addListener(map, 'click', function(ev) {
		qtWidget.mapClicked(ev.latLng.lat(), ev.latLng.lng());
	});
	google.maps.event.addListener(map, 'rightclick', function(ev) {
		qtWidget.mapRightClicked(ev.latLng.lat(), ev.latLng.lng());
	});
	google.maps.event.addListener(map, 'dblclick', function(ev) {
		qtWidget.mapDoubleClicked(ev.latLng.lat(), ev.latLng.lng());
	});


	flightPath = new google.maps.Polyline({
	    path: turtle_line,
	    strokeColor: '#FF0000',
	    strokeOpacity: 1.0,
	    strokeWeight: 1.5
	  });

	flightPath.setMap(map)

}

// custom functions
function gmap_setCenter(lat, lng)
{
    map.setCenter(new google.maps.LatLng(lat, lng));
}

function gmap_getCenter()
{
	return map.getCenter();
}

function gmap_setZoom(zoom)
{
    map.setZoom(zoom);
}

function gmap_addMarker(key, latitude, longitude, parameters)
{

	if (key in markers) {
		gmap_deleteMarker(key);
	}


	var icon =  {
        
        path: 'M45.105,15.176c-2.826-2.239-7.411-4.072-13.918-1.454c-1.082-1.193-2.318-2.141-3.661-2.814c0.474-1.08,0.748-2.337,0.748-3.686C28.274,3.234,25.903,0,22.98,0l0,0l0,0c-2.926,0-5.296,3.234-5.296,7.222c0,1.348,0.276,2.605,0.747,3.686c-1.341,0.673-2.578,1.621-3.66,2.814c-6.508-2.62-11.093-0.786-13.919,1.453c-0.526,0.417-0.726,1.125-0.498,1.756c0.229,0.631,0.834,1.046,1.506,1.03c3.197-0.076,6.675,1.093,9.289,2.233c-0.636,2.01-0.99,4.214-0.99,6.528c0,3.949,1.032,7.573,2.748,10.453c-1.882,2.394-2.531,4.963-2.641,7.146c-0.034,0.67,0.367,1.287,0.992,1.53c0.625,0.246,1.336,0.063,1.767-0.45c1.152-1.377,2.662-2.56,4.219-3.55c1.728,1.146,3.672,1.807,5.737,1.807c2.064,0,4.009-0.66,5.736-1.807c1.558,0.99,3.066,2.173,4.218,3.55c0.434,0.515,1.145,0.696,1.77,0.45c0.625-0.242,1.023-0.859,0.99-1.53c-0.108-2.183-0.759-4.752-2.641-7.146c1.716-2.88,2.748-6.504,2.748-10.453c0-2.313-0.354-4.52-0.99-6.528c2.613-1.141,6.092-2.309,9.289-2.234c0.671,0.017,1.277-0.398,1.505-1.03C45.832,16.301,45.632,15.593,45.105,15.176z',
        scale: .75,
        anchor: new google.maps.Point(25,25),
        rotation: parameters['rotation'],


		// path: 'M227.996,0C102.081,0,0,102.081,0,227.996c0,125.945,102.081,227.996,227.996,227.996c125.945,0,227.996-102.051,227.996-227.996C455.992,102.081,353.941,0,227.996,0z M299.435,238.788l-98.585,98.585c-5.928,5.897-15.565,5.897-21.492,0c-5.928-5.928-5.928-15.595,0-21.492l87.885-87.885l-87.885-87.885c-5.928-5.928-5.928-15.565,0-21.492s15.565-5.928,21.492,0l98.585,98.585c3.04,2.979,4.469,6.901,4.438,10.792C303.873,231.918,302.414,235.809,299.435,238.788z',
  //       scale: .06,
		// anchor: new google.maps.Point(230,230),
  //       rotation: parameters['rotation'],


        fillColor: '#FF9100',
        fillOpacity: .8,
        strokeColor: '#ccc',
        strokeWeight: 0.2
    }



	var coords = new google.maps.LatLng(latitude, longitude);
	parameters['map'] = map
	parameters['position'] = coords;
	parameters['icon'] = icon

	var marker = new google.maps.Marker(parameters);

	google.maps.event.addListener(marker, 'dragend', function() {
		qtWidget.markerMoved(key, marker.position.lat(), marker.position.lng())
	});
	google.maps.event.addListener(marker, 'click', function() {
		qtWidget.markerClicked(key, marker.position.lat(), marker.position.lng())
	});
	google.maps.event.addListener(marker, 'dblclick', function() {
		qtWidget.markerDoubleClicked(key, marker.position.lat(), marker.position.lng())
	});
	google.maps.event.addListener(marker, 'rightclick', function() {
		qtWidget.markerRightClicked(key, marker.position.lat(), marker.position.lng())
	});

	markers[key] = marker;
	return key;
}

function gmap_moveMarker(key, latitude, longitude, rotation)
{
	var icon = markers[key].getIcon();

	icon['rotation'] = rotation ;

	markers[key].setIcon(icon);

	var coords = new google.maps.LatLng(latitude, longitude);
	markers[key].setPosition(coords);
}

function gmap_deleteMarker(key)
{
	markers[key].setMap(null);
	delete markers[key]
}

function gmap_changeMarker(key, extras)
{
	if (!(key in markers)) {
		return
	}
	markers[key].setOptions(extras);
}



//edit start

function gmap_addPolyline(latitude, longitude)
{

	// turtle_line.push({
	// 	lat: latitude,
	// 	lng: longitude
	// });


	// var flightPathCoordinates = [
	//     {lat: 37.772, lng: -122.214},
	//     {lat: 21.291, lng: -157.821},
	//     {lat: -18.142, lng: 178.431},
	//     {lat: -27.467, lng: 153.027}
	//   ];

	// var path_temp = flightPath.getPath();

	// path_temp.push( new google.maps.LatLng( latitude, longitude));

	//flightPath.setPath(path_temp);




	// get existing path
	var path = flightPath.getPath();
	// add new point
	path.push(new google.maps.LatLng(latitude, longitude));
	// update the polyline with the updated path
	flightPath.setPath(path);





  

  
}



//edit end
