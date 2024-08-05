var platform = new H.service.Platform({
    apikey: 'ptik-LaTS1_6c551rX6s921sdWJFeJqGR6d7lO7LYlY',
});

var defaultLayers = platform.createDefaultLayers();

var map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map,
    {
        center: { lat: 10.762622, lng: 106.660172 },
        zoom: 12,
        pixelRatio: window.devicePixelRatio || 1,
    },
);


function moveToLocation(lat, lng) {
    map.setCenter({ lat: lat, lng: lng });
}


var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
searchPlace($('.map').data('map'));
function searchPlace(query) {
    // var query = document.getElementById('searchInput').value;
    fetch(`/api/map/location?q=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then((places) => {
            console.log('Found places:', places);
            // Hiển thị các địa điểm trên bản đồ
            places.forEach((place) => {
                map.removeObjects(map.getObjects());

                var marker = new H.map.Marker({
                    lat: place.position.lat,
                    lng: place.position.lng,
                });

                marker.addEventListener('tap', function () {
                    var hereWeGoUrl = `https://wego.here.com/directions/mix//${place.title}/?map=${place.position.lat},${place.position.lng},15,normal&search=${encodeURIComponent(query)}`;
                    window.open(hereWeGoUrl, '_blank');
                });

                map.addObject(marker);

                // Di chuyển bản đồ đến vị trí của địa điểm đầu tiên tìm thấy
                moveToLocation(place.position.lat, place.position.lng);
            });
        })
        .catch((error) => console.error('Error:', error));
}
