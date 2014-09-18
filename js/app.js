var lyricHub = {

	jsonResult:null,
	searchButton: null,
	resetButton: null,
	artistField:null,
	songField:null,
	displayArea:null,
	params: {fmt: 'realjson'},
	params1: {client_id: 'a5d568cd2894d82c7060a31ab7a67348'},
	base: "https://lyrics.wikia.com/api.php?callback=?",
	base1: "https://api.soundcloud.com/tracks.json",
	init:function()
	{
		lyricHub.searchButton = $("#searchButton");
		lyricHub.resetButton = $("#resetButton");
		lyricHub.artistField = $("#artistField");
		lyricHub.songField = $("#songField");
		lyricHub.displayArea = $("#displayArea");
		lyricHub.ifRelatedSongs = $("#ifRelatedSongs");
		lyricHub.audioPlayer = $("#player");
		lyricHub.initEvent();
	},
	//INITIALIZE EVENTS
	initEvent:function()
	{
		lyricHub.resetButton.click(function () {
			$("#songField").val("");
			$("#artistField").val("");
		});
		lyricHub.searchButton.click(lyricHub.onSearch);
		$("#loading").fadeOut();
		lyricHub.configureAudioPlayer();
		lyricHub.ifRelatedSongs.on("click" ,"a#playSong", lyricHub.playSounds);
	},
	onSearch:function(e)
	{	
		var artist, song;
		song = $("#songField").val().trim().toLowerCase();
		artist = $("#artistField").val().trim().toLowerCase();
		if(artist === "" && song === "") {
			alert('You must enter at least one parameter');
		} 
		else if(song !== "" && artist !== "")  
		{
			lyricHub.params.song = song;
			lyricHub.params.artist = artist;
			lyricHub.params1.q = song;
			lyricHub.searchFind();
			lyricHub.findSongs();
		}
		else {
			if(artist !== "")
			{
				lyricHub.params.artist = artist;
				lyricHub.params1.q = artist;
				lyricHub.searchFind();
				lyricHub.findSongs();	
			}
			else
			{
				lyricHub.params1.q = song;
				lyricHub.findSongs();
			}
		}
			
		e.preventDefault();
	},
	configureAudioPlayer: function()
	{
		lyricHub.audioPlayer = $("audio#player").get(0);
		lyricHub.audioPlayer.loop = true;
	},

	//find song lyrics from LyricWiki API
	searchFind: function()
	{
		console.log(lyricHub.params);
		$.getJSON(lyricHub.base, lyricHub.params, function(response) {
			console.log(response);
			$("#loading").fadeIn();
			lyricHub.onSuccess(response);
		});
	},

	//find Related songs from SoundCloud API
	findSongs: function()
	{
		console.log(lyricHub.params1);
		$.getJSON(lyricHub.base1, lyricHub.params1, function(songs) {
			console.log(songs);
			$("#loading").fadeIn();
			lyricHub.onFindSuccess(songs);
		});
	},
		
	//Handle JSON RESPONSE
	onSuccess: function(response)
	{
		lyricHub.jsonResult = response;
		console.log(lyricHub.jsonResult);
		$("#loading").fadeOut();
		$("#artist").text("Artist : " + lyricHub.jsonResult.artist);
		$("#song").text("Song Title : " + lyricHub.jsonResult.song);
		$("#lyric").text("Song Lyrics : " + lyricHub.jsonResult.lyrics);
		$("#link").text("Continue to full lyrics...");
		$("#link").attr("href", lyricHub.jsonResult.url);
		
	},
	onFindSuccess: function(response)
	{
		lyricHub.jsonResult = response;
		var songListArea = "";
		console.log(lyricHub.jsonResult);
		$("#loading").fadeOut();
		$.each(response, function() {
			var songList = this;
			var caption = songList.title;
			var image = songList.artwork_url;
			if (image == undefined) {
				image = "img/albumArt.jpg";
			}
			var listenToSong = this.stream_url + '?client_id='+ lyricHub.params1.client_id;
			songListArea += '<div class="songFound">' +
							'<ul>' +
							'<li><img src="' + image + '"/ class="albumArt"></li>' +
							'<li><a href="' + listenToSong + '" id="playSong" target="_blank"><img src="img/play.png" class="playIcon"/></a></li>' +
							'<li><p>' + caption +'</p></li>' +
							'</ul>' 
							'</div>';
			$('#ifRelatedSongs').html(songListArea);
		});
	},

	playSounds: function(e)
	{
		e.preventDefault();
		var href = $(this).prop("href");
		lyricHub.audioPlayer.src = href;
		console.log(href);
		lyricHub.audioPlayer.play();
		return false;
	}
}
$(document).ready(lyricHub.init)