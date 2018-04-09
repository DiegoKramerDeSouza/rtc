$(document).ready(function() {
    //Application - Inicia a chamada e tratamento de multiconexão
    var connection = new RTCMultiConnection();
    var status = false;

    //Conexão com serviço de websocket
    //Servidor  de signaling gratúito https://rtcmulticonnection.herokuapp.com:443/
    connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    //connection.socketURL = 'https://pinechart.com:3000/';

    //Definição de elementos da conferência; Audio e Video
    connection.session = {
        audio: true,
        video: true
    }
    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    }

    document.getElementById('btn-join-as-teacher').onclick = function() {
        //Definir 'your-room-id' - Formulário contendo hash de escola, professor, matéria e assunto
        //Definição "title: 'Professor'" - Informativo de matéria e assunto
        var isPublicModerator = true;
        var elem = document.getElementById(this.id);
        var materia = document.querySelector('#materia').value;
        var assunto = document.querySelector('#assunto').value;
        var roomLabel = materia + " (" + assunto + ")";
        var roomId = Math.floor((Math.random() * 9999) + 0);
        var roomHash = btoa(materia + "|" + roomId + "|" + assunto);

        if (materia && assunto) {
            this.disabled = true;
            materia.disabled = true;
            assunto.disabled = true;

            if (hasClass(elem, "btn-success")) {
                elem.classList.remove("btn-success");
                elem.classList.add("btn-default");
            }
            connection.teacherVideosContainer = document.getElementById('main-video');
            connection.open(roomHash, isPublicModerator);
            connection.onstream = function(event) {

                /*
                connection.teacherVideosContainer.appendChild(event.mediaElement);
                event.mediaElement.play();
                setTimeout(function() {
                    event.mediaElement.play();
                }, 5000);
                if (event.type === 'local') {
                    event.mediaElement.muted = true;
                }
                */

                var video = document.createElement('video');
                video.controls = true;
                if (event.type === 'local') {
                    video.muted = true;
                }
                video.srcObject = event.stream;
                console.log(video.srcObject);
                var width = parseInt(connection.teacherVideosContainer.clientWidth / 2) - 20;
                var mediaElement = getHTMLMediaElement(video, {
                    //    title: roomLabel,
                    buttons: ['full-screen'],
                    width: width,
                    showOnMouseEnter: false
                });
                document.getElementById('room-id').value = roomHash;
                setStatus('online');
                showRoomURL(roomHash, materia, assunto);
                setRoomLabel(roomLabel);
                connection.teacherVideosContainer.appendChild(mediaElement);
            }
        }
    }

    var publicRoomsDiv = document.getElementById('public-conference');
    (function looper() {
        //connection.getPublicModerators(startsWith, callback)
        connection.getPublicModerators(function(array) {
            publicRoomsDiv.innerHTML = '';
            if (array.length > 0) {
                array.forEach(function(moderator) {
                    //Definições de moderador:
                    // moderator.userid
                    // moderator.extra
                    if (moderator.userid == connection.userid) {
                        //Verifica se quem conecta é o próprio moderador
                        return;
                    }

                    var labelRoom = moderator.userid;
                    labelRoom = atob(labelRoom);
                    var labelClasse = labelRoom.split('|')[0];
                    var labelMateria = labelRoom.split('|')[2];

                    var divOpen = document.createElement('div');
                    var card = "<div class='card m-2'>" +
                        "<h5 class='card-header'>" +
                        "<i class='fa fa-desktop'></i> " + labelClasse +
                        "</h5>" +
                        "<div class='card-body'>" +
                        "<div class='row'>" +
                        "<div class='col-sm-12 col-md-3'>" +
                        "<img class='mr-3 classroom-img' style='max-width:80px; max-height:75px;' src='img/classroom.png' alt='Sala de aula'>" +
                        "</div>" +
                        "<div class='col-sm-12 col-md-6'>" +
                        "<h5 class='card-title'>" +
                        "Assunto: " + labelMateria +
                        "</h5>" +
                        "<p class='card-text'>Acesse esta sala de aula clicando no botão ao lado.</p>" +
                        "</div>" +
                        "<div id=" + moderator.userid + " class='col-sm-12 col-md-3 text-center'>" +
                        "</div>" +
                        "</div>" +
                        "</div>";

                    divOpen.innerHTML = card;

                    var button = document.createElement('button');
                    button.id = moderator.userid;
                    button.className = 'btn btn-info';
                    button.onclick = function() {
                        this.disabled = true;
                        var elem = document.getElementById(this.id);
                        if (hasClass(elem, "btn-info")) {
                            elem.classList.remove("btn-info");
                            elem.classList.add("btn-default");
                        }
                        connection.classVideosContainer = document.getElementById('class-video');
                        connection.join(this.id);
                        //Definições de vídeo para quem acessa a sala
                        connection.onstream = function(event) {
                            console.log("Connect: " + event.type);
                            var userVideo = document.createElement('video');
                            userVideo.controls = false;
                            //Define se a conexão é local ou remota
                            if (event.type === 'local') {
                                userVideo.muted = true;
                                userVideo.srcObject = event.stream;
                                console.log(userVideo.srcObject);
                                console.log(moderator.userid);
                                var width = parseInt(connection.classVideosContainer.clientWidth / 2) - 20;
                                var mediaElement = getHTMLMediaElement(userVideo, {
                                    title: 'Minha Cam',
                                    buttons: ['full-screen'],
                                    width: width,
                                    showOnMouseEnter: false
                                });
                            } else {
                                userVideo.srcObject = event.stream;
                                console.log(userVideo.srcObject.id);
                                console.log(moderator.userid);
                                var width = parseInt(connection.classVideosContainer.clientWidth / 2) - 20;
                                var mediaElement = getHTMLMediaElement(userVideo, {
                                    title: labelClasse + " (" + labelMateria + ")",
                                    buttons: ['full-screen'],
                                    width: width,
                                    showOnMouseEnter: false
                                });
                            }

                            callTeacherStream();
                            connection.classVideosContainer.appendChild(mediaElement);
                            setRoomLabel(labelClasse + " (" + labelMateria + ")");
                        };
                    };
                    button.innerHTML = 'Entrar';
                    if (moderator.userid == connection.sessionid) {
                        // Se já estiver conectado na sala
                        button.disabled = true;
                    }
                    //publicRoomsDiv.insertBefore(li, publicRoomsDiv.firstChild);
                    //publicRoomsDiv.insertBefore(divOpen, publicRoomsDiv.firstChild);
                    publicRoomsDiv.appendChild(divOpen);

                    var divClose = document.getElementById(moderator.userid);
                    divClose.appendChild(button);
                });
            } else {
                var divOpen = document.createElement('div');
                publicRoomsDiv.appendChild(divOpen);
            }

            setTimeout(looper, 3000);
        });
    })();


    //
    (function() {
        var params = {},
            r = /([^&=]+)=?([^&]*)/g;

        function d(s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        }
        var match, search = window.location.search;
        while (match = r.exec(search.substring(1))) {
            params[d(match[1])] = d(match[2]);
        }
        window.params = params;
    })();

    //
    var roomid = '';
    if (localStorage.getItem(connection.socketMessageEvent)) {
        roomid = localStorage.getItem(connection.socketMessageEvent);
    } else {
        roomid = connection.token();
    }
    document.getElementById('room-id').value = roomid;
    document.getElementById('room-id').onkeyup = function() {
        localStorage.setItem(connection.socketMessageEvent, this.value);
    };
    var hashString = location.hash.replace('#', '');
    if (hashString.length && hashString.indexOf('comment-') == 0) {
        hashString = '';
    }
    var roomid = params.roomid;
    if (!roomid && hashString.length) {
        roomid = hashString;
    }
    if (roomid && roomid.length) {
        document.getElementById('room-id').value = roomid;
        localStorage.setItem(connection.socketMessageEvent, roomid);
        // auto-join-room
        (function reCheckRoomPresence() {
            connection.checkPresence(roomid, function(isRoomExists) {
                if (isRoomExists) {
                    connection.join(roomid);
                    return;
                }
                setTimeout(reCheckRoomPresence, 5000);
            });
        })();
    }

});

//Funções-----------------------------------------------------------------

//Verificação de classes para elementos html
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
//Define status de stream - on/off
function setStatus(st) {
    status = st;
}
//
function callTeacherStream() {
    $('#teacher-access').slideUp(300);
    $('#opend-rooms').slideUp(300);
    var videoPanel = document.getElementById('video-panel');
    videoPanel.classList.remove("d-none");
}

function setRoomLabel(label) {
    var roomtitle = document.getElementById('class-title');
    roomtitle.innerHTML = label;
}

function showRoomURL(roomid, className, classTheme) {
    var roomHashURL = '#' + roomid;
    var roomQueryStringURL = '?roomid=' + roomid;
    var html = '<div class="card-title">Sua aula foi iniciada.</div>';
    html += '<div class="card-text">';
    html += '   Hash URL: <a href="' + roomHashURL + '" target="_blank">' + roomHashURL + '</a><br />';
    html += '   QueryString URL: <a href="' + roomQueryStringURL + '" target="_blank">' + roomQueryStringURL + '</a>';
    html += '</div>';
    var roomURLsDiv = document.getElementById('room-urls');
    roomURLsDiv.innerHTML = html;
    roomURLsDiv.style.display = 'block';
    callTeacherStream();
}