// Definitions
var API_ENDPOINT = 'http://aedespot.herokuapp.com/api/reports/';

// onReady handler settings
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    // To persist coordinates of the mobile
    var latitude, longitude, photoData = null;

    // Position handler: persists
    var onLocationSuccess = function(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    };

    function onLocationError(error) {
        alert('Não foi possível achar sua localização. Habilite o location service e reinicie a aplicação.');
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

    $("#addPhotoButton").click(function () {
        navigator.camera.getPicture(function(imageData) {
            photoData = imageData;
            $('#photo').attr('src', photoData);
        }, function(err) {
            alert("Não foi possível adicionar foto.")
        }, {
			quality: 50,
			destinationType: navigator.camera.DestinationType.FILE_URI
		});
    });

    $(".container a").click(function () {

        // Getting report details
        var type = $(this).attr('data-type');

        // Data to be submitted
        var params = new Object();
        params.category = type;
        params.latitude = latitude;
        params.longitude = longitude;
        params.device_id = device.uuid;

        var options = new FileUploadOptions();
        options.fileKey = "photo";

        // Image upload
        if (photoData != null) {
            options.fileName = photoData.substr(photoData.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.params = params;

            var ft = new FileTransfer();
            ft.upload(photoData, API_ENDPOINT, uploadSuccess, uploadFailed, options);
        }
        else {
            $.post(API_ENDPOINT, params, uploadSuccess);
        }
    });

    function uploadSuccess(response) {
        alert('Registrada ocorrência na sua posição. Acompanhe os resultados pelo site.');
    }

    function uploadFailed(err) {
        alert('Não foi possível enviar o relatório.');
    }
}
