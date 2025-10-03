const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("sendLocation", { latitude, longitude });
    },
        (err) => {
            console.error(err);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        }

    );
}

const map =L.map('map').setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:"OpenStreetMap"
}).addTo(map);


// Empty Marker Layer
const markers= {}

socket.on("recieveLocation", function(data) {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude],16);

    // If marker for this id already exists, update its position
    if(markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Create a new marker and add it to the markers object
        const marker = L.marker([latitude, longitude]).addTo(map);
        marker.bindPopup(`Device ID: ${id}`).openPopup();
        markers[id] = marker;
    }
});

socket.on("user-disconnected", function(id) {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});