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
                connection.openOrJoin(roomHash);
                connection.onstream = function(event) {
                    var video = document.createElement('video');
                    video.controls = true;
                    if (event.type === 'local') {
                        video.muted = true;
                    }
                    video.srcObject = event.stream;
                    var width = parseInt(connection.videosContainer.clientWidth / 2) - 20;
                    var mediaElement = getHTMLMediaElement(video, {
                        title: roomLabel,
                        buttons: ['full-screen'],
                        width: width,
                        showOnMouseEnter: false
                    });
                    setStatus('online');
                    connection.teacherVideosContainer.appendChild(mediaElement);
                }
            }
        }
        /*
    document.getElementById('btn-join-as-class').onclick = function() {
        //Definir 'your-room-id' - Formulário contendo hash de escola, professor, matéria e assunto
        //Definir "title: 'Classe'" - Informativo de turma
		this.disabled = true;
		var elem = document.getElementById(this.id);
        if (hasClass(elem, "btn-success")) {
            elem.classList.remove("btn-success");
            elem.classList.add("btn-default");
        }
        connection.classVideosContainer = document.getElementById('class-video');
        connection.openOrJoin('your-room-id');
        connection.onstream = function(event) {
            var video = document.createElement('video');
            video.controls = true;
            if (event.type === 'local') {
                video.muted = true;
            }
            video.srcObject = event.stream;
            var width = parseInt(connection.videosContainer.clientWidth / 2) - 20;
            var mediaElement = getHTMLMediaElement(video, {
                title: 'Classe',
                width: width,
                showOnMouseEnter: false
            });
            connection.classVideosContainer.appendChild(mediaElement);
		};
		
	}
	*/


});

//Funções-----------------------------------------------------------------

//Verificação de classes para elementos html
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function setStatus(st) {
    status = st;
}

function callTeacherStream() {
    $('#teacher-access').slideUp(300);

}