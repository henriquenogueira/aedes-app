// Definitions
var API_ENDPOINT = 'http://aedespot.herokuapp.com/api/reports/';

// onReady handler settings
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    // To persist coordinates of the mobile
    var latitude, longitude;

    // Position handler: persists
    var onLocationSuccess = function(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    };

    function onLocationError(error) {
        alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    }

    // Getting user's location
    navigator.geolocation.getCurrentPosition(
        onLocationSuccess,
        onLocationError,
        {
            enableHighAccuracy: true,
            timeout: 10000
        }
    );

    $(".container a").click(function () {

        // Getting report details
        var type = $(this).attr('data-type');
        var description = $(this).attr('data-description');

        var data = {category: type, latitude: latitude, longitude: longitude};
        $.post(API_ENDPOINT, data, function (response) {
            alert('Registrado ' + description + ' na sua posição. Acompanhe os resultados pelo site.');
        });
    });
}