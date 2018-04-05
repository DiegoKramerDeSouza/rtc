$(document).ready(function() {
    //Application - Inicia a chamada e tratamento de multiconexão
    var connection = new RTCMultiConnection();

    //Conexão com serviço de websocket
    //Servidor  de signaling gratúito https://rtcmulticonnection.herokuapp.com:443/
    connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    //connection.socketURL = 'https://pinechart.com:3000/';

    //Definição de elementos da conferência; Audio e Video
    connection.session = {
        audio: true,
        video: true
    };

    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    }

    document.getElementById('btn-join-as-teacher').onclick = function() {
        this.disabled = true;
        connection.teacherVideosContainer = document.getElementById('teacher-video');
        connection.openOrJoin('your-room-id');
        connection.onstream = function(event) {
            //document.teacherVideosContainer.appendChild( event.mediaElement );

            var video = document.createElement('video');
            video.controls = true;
            if (event.type === 'local') {
                video.muted = true;
            }
            video.srcObject = event.stream;
            var width = parseInt(connection.videosContainer.clientWidth / 2) - 20;
            var mediaElement = getHTMLMediaElement(video, {
                title: 'Professor',
                buttons: ['full-screen'],
                width: width,
                showOnMouseEnter: false
            });
            connection.teacherVideosContainer.appendChild(mediaElement);
        };
    }
    document.getElementById('btn-join-as-class').onclick = function() {
        this.disabled = true;
        connection.openOrJoin('your-room-id');
    }





    /*
    connection.connectSocket(function() {
        console.log('Successfully connected to socket.io server.');

        connection.socket.emit('howdy', 'hello');
    });

    var cameraOptions = {
        audio: true,
        video: true
    };

    connection.captureUserMedia(function(camera) {
        var video = document.createElement('video');
        video.src = URL.createObjectURL(camera);
        video.muted = true;

        var streamEvent = {
            type: 'local',
            stream: camera,
            streamid: camera.id,
            mediaElement: video
        };
        connection.onstream(streamEvent);

        // ask RTCMultiConnection to
        // DO NOT capture any camera
        // because we already have one
        connection.dontCaptureUserMedia = true;

        // now open or join a room
        connection.openOrJoin('your-room-id');
    }, cameraOptions);
    */
});