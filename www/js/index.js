// Definitions
var API_ENDPOINT = 'http://aedespot.herokuapp.com/api/reports/';

// onReady handler settings
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    // To persist coordinates of the mobile
    var latitude, longitude, photoData = null;

    var cameraOptions = {
       quality: 80,
       targetWidth: 1400,
       targetHeight: 800,
       destinationType: Camera.DestinationType.FILE_URI,
       sourceType: Camera.PictureSourceType.CAMERA,
       correctOrientation: true
    };

    var locationOptions = {
        enableHighAccuracy: true,
        timeout: 10000
    };

    // Getting user's location
    navigator.geolocation.getCurrentPosition(
        onLocationSuccess,
        onLocationError,
        locationOptions
    );

    $("#addPhotoButton").click(function () {
        navigator.camera.getPicture(onPictureSuccess, onPictureError, cameraOptions);
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
        $("#photo").removeAttr('src');
        photoData = null;
    }

    function uploadFailed(err) {
        alert('Não foi possível enviar o relatório.');
    }

    function onLocationSuccess(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    };

    function onLocationError(error) {
        alert('Não foi possível achar sua localização. Habilite o location service e reinicie a aplicação.');
    }

    function onPictureSuccess(imageData) {
        photoData = imageData;
        $('#photo').attr('src', photoData);
    }

    function onPictureError(err) {
        alert("Não foi possível adicionar foto.")
    }
}
