'use strict';
var chave = "5b5c0afd0b275d029ef54d33c99d7e1b";
var pais = "Portugal"
var artista = "Demon Hunter"
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
            $('.artist', liMedia).text(result.name);
            $('.listeners', liMedia).text(result.listeners);
            getImagem(chave, result.artist.name, result.name, liMedia, '#image');
            $('.btn.detalhes', liMedia).attr('onclick', 'detalhes("' + result.name + '","' + result.artist.name + '")');
            $('.btn.favoritos', liMedia).attr('onclick', 'adicionarFavoritos("' + result.name + '","' + result.artist.name + '")');
            $('.media-list-portugal').append(liMedia);
        })
    });
};

function toptracks() {
    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + artista + "&api_key=" + chave + "&limit=10&format=json"
    }).done(function(resultado) {
        resultado.toptracks.track.forEach(function(result) {
            var liMedia = cloneMedia.clone();
            $('.title', liMedia).text(result.name);
            $('.playcount', liMedia).text(result.playcount);
            getImagem(chave, result.artist.name, result.name, liMedia, '#image');
            $('.btn.detalhes', liMedia).attr('onclick', 'detalhes("' + result.name + '","' + result.artist.name + '")');
            $('.btn.favoritos', liMedia).attr('onclick', 'adicionarFavoritos("' + result.name + '","' + result.artist.name + '")');
            $('.media-list').append(liMedia);
        })
    });
};

function getImagem(chave, artista, track, liMedia, escrita) {
    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + chave + "&artist=" + artista + "&limit=1&track=" + track + "&format=json"
        // http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=5b5c0afd0b275d029ef54d33c99d7e1b&artist=Cher&limit=1&track=Believe&format=json          
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
            $('.title', liMedia).text(result.name);
            $('.playcount', liMedia).text(result.playcount);
            getImagem(chave, result.artist, result.name, liMedia, '#image');
            $('.btn.detalhes', liMedia).attr('onclick', 'detalhes("' + result.name + '","' + result.artist + '")');
            $('.btn.favoritos', liMedia).attr('onclick', 'adicionarFavoritos("' + result.name + '","' + result.artist + '")');
            $('#Idsearch').append(liMedia);
        })
    });
};

function carregarDetalhes() {
    webstorage = JSON.parse(localStorage.getItem('webstorage'));
    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + chave + "&artist=" + webstorage.artista + "&limit=1&track=" + webstorage.track + "&format=json"
        // http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=5b5c0afd0b275d029ef54d33c99d7e1b&artist=Cher&limit=1&track=Believe&format=json          
    }).done(function(info) {
        console.log(localStorage.getItem('webstorage'));
        $("#IdArtistaDetalhes").text(info.track.artist.name);
        $("#IdNomeDetalhes").text(info.track.name);
        $("#IdPlaycountDetalhes").text(info.playcount);
        if (typeof("info.track.album") !== "undefined") {
            $("#IdAlbumDetalhes").text(info.track.album.title);
            $("#IdImagemDetalhes").attr("src", info.track.album.image[2]["#text"]);
        }
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
        favoritos.forEach(function(result) {

            $.ajax({
            method: "GET",
            url: "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + chave + "&artist=" + favoritos.artista + "&limit=1&track=" + favoritos.track + "&format=json"
            // http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=5b5c0afd0b275d029ef54d33c99d7e1b&artist=Cher&limit=1&track=Believe&format=json          
        }).done(function(info) {
            var liMedia = cloneMedia.clone();
            $('#IdFavoritoTrack', liMedia).text(result);
            
            //getImagem(chave, result.artist, result.name, liMedia, '#image');
            //$('#image', liMedia).attr('src', info.track.album.image[2]["#text"]);
            $('.btn.favoritos', liMedia).attr('onclick', 'adicionarFavoritos("' + favoritos.artist + '","' + favoritos.track  + '")');
            $('#IdListafavoritos').append(liMedia);
        })
        }) 
    }
}

function adicionarFavoritos(artista, track) {
    if (typeof(Storage) !== "undefined") {
        var listaFavoritos = [artista, track];
        var detetor;
        if (localStorage.getItem("favoritos") != null) {
            console.log("if");
            favoritos = JSON.parse(localStorage.getItem('favoritos'));
            
            favoritos.push(listaFavoritos);
        } else {
            console.log("else");
            favoritos = listaFavoritos;
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
