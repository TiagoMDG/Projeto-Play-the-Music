'use strict';
var chave = "5b5c0afd0b275d029ef54d33c99d7e1b";
var pais = "Portugal"
var artista = "Demon Hunter"

var cloneMedia=$('.media').clone();
$("#IdtopPortugal").html("");
$("#Idtoptracks").html("");
$("#Idsearch").html("");
$("#idButton").click(tracksearch);

function topportugal (){
    $.ajax({
            method: "GET",
            url: "http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=" + pais + "&api_key=" + chave + "&limit=10&format=json"
        }).done(function(resultado){
            console.log(resultado);
            resultado.tracks.track.forEach(function(result){
                var liMedia = cloneMedia.clone();
                $('.artist',liMedia).text(result.name);
                $('.listeners',liMedia).text(result.listeners);
                getImagem(chave, result.artist.name, result.name, liMedia,'#image');
                $('.btn.detalhes').attr('onclick','detalhes("' + result.name + '","' + result.artist.name+'")');
                $('.media-list-portugal').append(liMedia);
                console.log(result.name);
            })
        });
};

function toptracks (){
    $.ajax({
            method: "GET",
            url: "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + artista + "&api_key=" + chave + "&limit=10&format=json"
        }).done(function(resultado){
            console.log(resultado);
            resultado.toptracks.track.forEach(function(result){
                var liMedia = cloneMedia.clone();
                $('.title',liMedia).text(result.name);
                $('.playcount',liMedia).text(result.playcount);
                getImagem(chave, result.artist.name, result.name, liMedia,'#image');
                $('.btn.detalhes').attr('onclick','detalhes("' + result.name + '","' + result.artist.name+'")');
                $('.media-list').append(liMedia);
                console.log(getImagem(chave, result.artist.name, result.name, liMedia,'#image'));
            })
        });
};

function getImagem(chave,artista,track, liMedia, escrita){
    $.ajax({        
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + chave + "&artist=" + artista + "&limit=1&track=" + track + "&format=json" 
        // http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=5b5c0afd0b275d029ef54d33c99d7e1b&artist=Cher&limit=1&track=Believe&format=json          
    }).done(function(info){
        if (typeof(info.track.album) !== "undefined"){
            var imgurl = info.track.album.image[1]["#text"];
            $(escrita,liMedia).attr("src", imgurl);
            console.log(imgurl);          
        } 
    });
} 

function tracksearch (){
    track = $("#Idbarrapesquisa").val();
    $("#Idsearch").empty();
    $.ajax({
            method: "GET",
            url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track="+ track +"&api_key="+chave+"&limit=10&track=&format=json"
        }).done(function(resultado){
            console.log(resultado);
            resultado.results.trackmatches.track.forEach(function(result){
                var liMedia = cloneMedia.clone();
                $('.title',liMedia).text(result.name);
                $('.playcount',liMedia).text(result.playcount);
                getImagem(chave, result.artist, result.name, liMedia,'#image');
                $('.btn.detalhes').attr('onclick','detalhes("' + result.name + '","' + result.artist.name+'")');
                $('#Idsearch').append(liMedia);
            })
        });
};   

function detalhes (track, artista){
    $.ajax({        
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + chave + "&artist=" + artista + "&limit=1&track=" + track + "&format=json" 
        // http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=5b5c0afd0b275d029ef54d33c99d7e1b&artist=Cher&limit=1&track=Believe&format=json          
    }).done(function(info){
        console.log(info);
        $("#IdArtistaDetalhes").text(info.track.artist.name);
        $("#IdNomeDetalhes").text(info.track.name);
        $("#IdPlaycountDetalhes").text(info.playcount);
        if (typeof ("info.track.album") !== "undefined"){
            $("#IdAlbumDetalhes").text(info.track.album.title);
            $("#IdImagemDetalhes").attr("src", info.track.album.image[2]["#text"]); 
        }
        console.log(track, artista);
    });
}

toptracks();
topportugal();