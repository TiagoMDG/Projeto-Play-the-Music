'use strict';
var chave = "5b5c0afd0b275d029ef54d33c99d7e1b";
var pais = "Portugal"
var artista;
var webstorage = localStorage;
var favoritos = new Array;
var track;

var cloneMedia = $('.media').clone();
$("#IdtopPortugal").html("");
$("#Idtoptracks").html("");
$("#Idsearch").html("");
$("#IdListafavoritos").html("");
$("#idButton").click(tracksearch);

function topportugal() {
    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=" + pais + "&api_key=" + chave + "&limit=10&format=json"
    }).done(function(resultado) {
        resultado.tracks.track.forEach(function(result) {
            var liMedia = cloneMedia.clone();
            $('.track', liMedia).text(result.name);
            $('.artist', liMedia).text(result.artist.name);
            getImagem(chave, result.artist.name, result.name, liMedia, '#image');
            $('.btn.detalhes', liMedia).attr('onclick', 'detalhes("' + result.artist.name + '","' + result.name + '")');
            $('.btn.favoritos', liMedia).attr('onclick', 'adicionarOuRemoverFavoritos("' + result.name + '","' + result.artist.name + '")');
            $('.media-list-portugal').append(liMedia);
        })
    });
};

function toptracks() {
    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=itzgunnyz&limit=9&api_key=" + chave + "&format=json"
    }).done(function(resultado) {
        resultado.recenttracks.track.forEach(function(result) {
            var liMedia = cloneMedia.clone();
            $('.track', liMedia).text(result.name);
            $('.artist', liMedia).text(result.artist['#text']);
            getImagem(chave, result.artist['#text'], result.name, liMedia, '#image');
            $('.btn.detalhes', liMedia).attr('onclick', 'detalhes("' + result.artist['#text'] + '","' + result.name + '")');
            $('.btn.favoritos', liMedia).attr('onclick', 'adicionarOuRemoverFavoritos("' + result.name + '","' + result.artist['#text'] + '")');
            $('.media-list').append(liMedia);
        })
    });
};

function getImagem(chave, artista, track, liMedia, escrita) {
    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + chave + "&artist=" + artista + "&limit=1&track=" + track + "&format=json"
    }).done(function(info) {
        if (typeof(info.track.album) !== "undefined") {
            var imgurl = info.track.album.image[1]["#text"];
            $(escrita, liMedia).attr("src", imgurl);
        }
    });
}

function tracksearch() {
    track = $("#Idbarrapesquisa").val();
    $("#Idsearch").empty();
    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + track + "&api_key=" + chave + "&limit=10&track=&format=json"
    }).done(function(resultado) {
        resultado.results.trackmatches.track.forEach(function(result) {
            var liMedia = cloneMedia.clone();
            $('.track', liMedia).text(result.name);
            $('.artist', liMedia).text(result.artist);
            getImagem(chave, result.artist, result.name, liMedia, '#image');
            $('.btn.detalhes', liMedia).attr('onclick', 'detalhes("' + result.artist + '","' + result.name + '")');
            $('.btn.favoritos', liMedia).attr('onclick', 'adicionarOuRemoverFavoritos("' + result.name + '","' + result.artist + '")');
            $('#Idsearch').append(liMedia);
        })
    });
};

function carregarDetalhes() {
    webstorage = JSON.parse(localStorage.getItem('webstorage'));
    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + chave + "&artist=" + webstorage.artista + "&limit=1&track=" + webstorage.track + "&format=json"
    }).done(function(info) {
        var liMedia = cloneMedia.clone();
        $("#IdArtistaDetalhes").text("Artista: " + info.track.artist.name);
        $("#IdNomeDetalhes").text("Track: " + info.track.name);
        if (typeof(info.track.album) !== "undefined") {
            $("#IdAlbumDetalhes").text("Album: " + info.track.album.title);
            $("#IdImagemDetalhes").attr("src", info.track.album.image[2]["#text"]);
        }
        $('.btn.favoritos', '.well').attr('onclick', 'adicionarOuRemoverFavoritos("' + info.track.name + '","' + info.track.artist.name + '")');
    });
}

function detalhes(artista, track) {
    location.href = "detalhes.html";
    if (typeof(Storage) !== "undefined") {
        webstorage = {
            track,
            artista
        }
        localStorage.setItem('webstorage', JSON.stringify(webstorage));
    } else {
        $('#error').text("Local Storage disabled/not supported!").show().fadeOut(2000);
    }
}

function carregarFavoritos() {
    favoritos = JSON.parse(localStorage.getItem('favoritos'));
    if (typeof(localStorage.favoritos) !== "undefined") {
        var i = 0;
        favoritos.forEach(function(result) {
            $.ajax({
                method: "GET",
                url: "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + chave + "&artist=" + result[0] + "&limit=1&track=" + result[1] + "&format=json"
            }).done(function(info) {
                if (info.error !== 6) {
                    var liMedia = cloneMedia.clone();
                    $('.track', liMedia).text(result[0]);
                    $('.artist', liMedia).text(result[1]);
                    getImagem(chave, info.track.name, info.track.artist.name, liMedia, '#image');
                    $('.btn.favoritos', liMedia).attr('onclick', 'adicionarOuRemoverFavoritos("' + info.track.artist.name + '","' + info.track.name + '")');
                    $('.btn.detalhes', liMedia).attr('onclick', 'detalhes("' + info.track.name + '","' + info.track.artist.name + '")');
                    $('#IdListafavoritos').append(liMedia);
                }
            })
            i++;
        })
    }
}

function onMouseEnter(button) {
    if (localStorage.getItem("favoritos") == null){
        return;
    }
    var temp = button.parentNode.onclick.toString();
    var res = temp.split("\"");
    favoritos = JSON.parse(localStorage.getItem('favoritos'));
    favoritos.forEach(function(result) {
        if (result[0].toUpperCase() == res[1].toUpperCase()) {
            button.src = "imgs/heartBroken.png";
            return;
        }
    })
}

function onMouseLeave(button) {
    button.src = "imgs/heart.svg";
}

function adicionarOuRemoverFavoritos(artista, track) {
    if (typeof(Storage) !== "undefined") {
        var listaFavoritos = [artista, track];
        if (localStorage.getItem("favoritos") != null) {
            for (var index = 0; index < favoritos.length; index++) {
                if (favoritos[index][0].toUpperCase() == listaFavoritos[0].toUpperCase()) {
                    favoritos.splice(index, 1);
                    localStorage.setItem('favoritos', JSON.stringify(favoritos));
                    return;
                }
            }
            favoritos = JSON.parse(localStorage.getItem('favoritos'));
            favoritos.push(listaFavoritos);
        } else {
            favoritos = listaFavoritos;
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
            favoritos = JSON.parse(localStorage.getItem('favoritos'));
            favoritos.push(listaFavoritos);
            favoritos.splice(0, 2);
        }
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    } else {
        $('#error').text("Local Storage disabled/not supported!").show().fadeOut(2000);
    }
}

var pagina = document.getElementsByTagName("title")[0]["text"];

if (pagina == "Index") {
    toptracks();
}

if (pagina == "Top 10 de Portugal") {
    topportugal();
}
if (pagina == "Detalhes") {
    carregarDetalhes();
}
if (pagina == "Favoritos") {
    carregarFavoritos();
}