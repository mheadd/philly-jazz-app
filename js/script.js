// Set view of Leaflet map based on screen size
var map = new L.Map('map').setView([39.96,-75.134],13);

// Information for the base tile via Cloudmade
var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/f14689c8008d43da9028a70e6a8e710a/2402/256/{z}/{x}/{y}.png'
var cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18});
// Add to map
map.addLayer(cloudmade);


// Here's the Tabletop feed
// First we'll initialize Tabletop with our spreadsheet
var jqueryNoConflict = jQuery;
jqueryNoConflict(document).ready(function(){
	initializeTabletopObject('0AsNAXuadeXIxdGJCT0hsWXZiLTNVZklrSUhQRzYxRVE');
});

// Pull data from Google spreadsheet
// And push to our startUpLeaflet function
function initializeTabletopObject(dataSpreadsheet){
	Tabletop.init({
    	key: dataSpreadsheet,
    	callback: startUpLeafet,
    	simpleSheet: true,
    	debug: false
    });
}


// This function gets our data from our spreadsheet
// Then gets it ready for Leaflet.
// It creates the marker, sets location
// And plots on it on our map
function startUpLeafet(tabletopData) {
	// Tabletop creates arrays out of our data
	// We'll loop through them and create markers for each
	for (var num = 0; num < tabletopData.length; num ++) {
		// Our table columns
		// Change 'brewery', 'address', etc.
		// To match table column names in your table
		var dataName= tabletopData[num].name;
		var dataAddress = tabletopData[num].address;
		var dataDecription = tabletopData[num].description;
		var dataArtist = tabletopData[num].artist;
		var dataLink = tabletopData[num].link;
		var dataType = tabletopData[num].type;

		// Pull in our lat, long information
		var dataLat = tabletopData[num].latitude;
		var dataLong = tabletopData[num].longitude;

		// Determine marker type.
		/*
		if(dataType == 'Historic Place') {
			marker = 'marker-icon.png';
		}
		else if (dataType == 'Mural') {
			marker = 'marker-icon-black.png';
		}
		else if (dataType == 'Legendary Club') {
			marker = 'marker-icon-pink.png';
		}
		else {
			marker = 'marker-icon-dark.png';
		}
		var myIcon = L.icon({iconUrl: 'js/images/' + marker, iconSize: [17, 28]});
		*/

		if(dataType == 'Historic Marker') {
			marker = 'marker-icon-dark.png';
		}
		else {
			marker = 'marker-icon.png';
		}
		var myIcon = L.icon({iconUrl: 'js/images/' + marker});

		// Add to our marker
		marker_location = new L.LatLng(dataLat, dataLong);
		// Create the marker
    	layer = new L.Marker(marker_location, {icon: myIcon});
    
    	// Create the popup
    	// Change 'Address', 'City', etc.
		// To match table column names in your table
    	var popup = "<div class=popup_box" + "id=" + num + ">";
    	popup += "<div class='popup_box_header'><strong>" + dataName + "</strong></div>";
    	popup += "<hr />";
    	popup += "<strong>Address:</strong> " + dataAddress + "<br />";
    	popup += dataDecription.length > 0 ? "<strong>Description:</strong> " + dataDecription + "<br />" : "";
    	popup += dataArtist.length > 0 ? "<strong>Artist:</strong> " + dataArtist + "<br />" : "";
    	popup += dataLink.length > 0 ? "<strong><a href=\"" + dataLink + "\">Learn more</a></strong><br />" : "";
    	popup += dataType == 'Historic Marker' ? "<strong><a href=\"javascript:searchEchoNest('" + dataArtist + "')\">Search Echonest Images</a></strong><br />" : "";
    	popup += "</div>";
    	// Add to our marker
		layer.bindPopup(popup);
	
		// Add marker to our to map
		map.addLayer(layer);
	}
};


// Toggle for 'About this map' and X buttons
// Only visible on mobile
isVisibleDescription = false;
// Grab header, then content of sidebar
sidebarHeader = $('#sidebar_header').html();
sidebarContent = $('#sidebar_content').html();
// Then grab credit information
creditsContent = $('#credits_content').html();
$('.toggle_description').click(function() {
	if (isVisibleDescription === false) {
		$('#description_box_cover').show();
		// Add Sidebar header into our description box
		// And 'Scroll to read more...' text on wide mobile screen
		$('#description_box_header').html(sidebarHeader + '<div id="scroll_more"><strong>Scroll to read more...</strong></div>');
		// Add the rest of our sidebar content, credit information
		$('#description_box_content').html(sidebarContent + '<br />' + 'Credits:' + creditsContent);
		$('#description_box').show();
		isVisibleDescription = true;
	} else {
		$('#description_box').hide();
		$('#description_box_cover').hide();
		isVisibleDescription = false;
	}
});


// Toggles view/hide of credits
// Only visible on desktop
isVisibleDamage = true;
$('#toggle_credits').click(function() {
	$('#credits_box').slideToggle('slow');
	if(isVisibleDamage){
		$('#toggle_credits').html("Hide");
		isVisibleDamage = false;
	} else {
		$('#toggle_credits').html("Credits");
		isVisibleDamage = true;
	}
});

R.ready(function() {
	R.player.play({source: "a236082"}); // Coltrane, A Love Supreme
});

var echonest = new EchoNest("VHJCDGJN5VA9MCITN");
function searchEchoNest(name) {
	echonest.artist(name).images( function(imageCollection) {
		$('#content').remove();
		$('#sidebar_content').append('<div id="content"></div>');
		$('#content').append( imageCollection.to_html('<img class="echonest" src="${url}" width="200" height="200">') );
	}, {results: 5});
}