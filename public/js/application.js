$(document).ready(function() {
    //Application - Inicia a chamada e tratamento de multiconexão
    var connection = new RTCMultiConnection();
    var status = false;

    //Conexão com serviço de websocket
    //Servidor  de signaling gratúito https://rtcmulticonnection.herokuapp.com:443/
    connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

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

    var publicRoomsDiv = document.getElementById('public-rooms');
    (function looper() {
        //connection.getPublicModerators(startsWith, callback)
        connection.getPublicModerators(function(array) {
            publicRoomsDiv.innerHTML = '';
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

                var li = document.createElement('li');
                li.innerHTML = '<b>' + labelClasse + '(' + labelMateria + ')</b>';

                var item = document.getElementById('public-conference');
                /*item.innerHTML = "<div class=\"media\">" +
                    "<img class=\"mr-3\" src=\"<?= $this->basePath('img/classroom.jpg')?> \" alt=\"Sala de aula\">" +
                    "<div class=\"media-body\">" +
                    "<h5 class=\"mt-0\">" + labelClasse + "</h5>" +
                    labelMateria +
                    "<br/>";*/
                //"</div>" +
                //"</div>";

                var button = document.createElement('button');
                button.id = moderator.userid;
                button.onclick = function() {
                    this.disabled = true;
                    var elem = document.getElementById(this.id);
                    if (hasClass(elem, "btn-success")) {
                        elem.classList.remove("btn-success");
                        elem.classList.add("btn-default");
                    }
                    connection.classVideosContainer = document.getElementById('class-video');
                    connection.join(this.id);
                    //Definições de vídeo para quem acessa a sala
                    connection.onstream = function(event) {
                        console.log(event.type);
                        var userVideo = document.createElement('video');
                        userVideo.controls = false;
                        if (event.type === 'local') {
                            userVideo.muted = true;
                        }
                        userVideo.srcObject = event.stream;
                        var width = parseInt(connection.classVideosContainer.clientWidth / 2) - 20;
                        var mediaElement = getHTMLMediaElement(userVideo, {
                            //title: 'Classe',
                            buttons: ['full-screen'],
                            width: width,
                            showOnMouseEnter: false
                        });
                        callTeacherStream();
                        connection.classVideosContainer.appendChild(mediaElement);
                    };
                };
                button.innerHTML = 'Entrar na sala';
                li.appendChild(button);
                if (moderator.userid == connection.sessionid) {
                    // Se já estiver conectado na sala
                    button.disabled = true;
                }
                publicRoomsDiv.insertBefore(li, publicRoomsDiv.firstChild);
            });
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