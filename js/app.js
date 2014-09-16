var lyricHub = {

	jsonResult:null,
	searchButton: null,
	artistField:null,
	songField:null,
	displayArea:null,
	params: {fmt: 'realjson'},
	base: "https://lyrics.wikia.com/api.php?callback=?",
	init:function()
	{
		lyricHub.searchButton = $("#searchButton");
		lyricHub.artistField = $("#artistField");
		lyricHub.songField = $("#songField");
		lyricHub.displayArea = $("#displayArea");
		lyricHub.initEvent();
	},
	//INITIALIZE EVENTS
	initEvent:function()
	{
		lyricHub.searchButton.click(lyricHub.onSearch);
	},
	onSearch:function(e)
	{	
		var artist, song;
		song = $("#songField").val().trim();
		artist = $("#artistField").val().trim();
		if(artist === "" && song === "") {
			lyricHub.displayArea.text('You must enter at least one parameter');
		} else {
			if(song !== "") 
			{
				lyricHub.params.song = song;
			}
			if(artist !== "") {
				lyricHub.params.artist = artist;
			}
			lyricHub.searchFind();
		}
			
		e.preventDefault();
	},
	//find song lyrics from LyricWiki API
	searchFind: function()
	{
		console.log(lyricHub.params);
		$.getJSON(lyricHub.base, lyricHub.params, function(response) {
			console.log(response);
			lyricHub.onSuccess(response);
		});
	},
		
	//Handle JSON RESPONSE
	onSuccess: function(response)
	{
		lyricHub.jsonResult = response;
		console.log(lyricHub.jsonResult);
		$("#artist").text(lyricHub.jsonResult.artist);
		$("#song").text(lyricHub.jsonResult.song);
		$("#lyric").text(lyricHub.jsonResult.lyrics);
		$("#link").text(lyricHub.jsonResult.url);

		
	},


}
$(document).ready(lyricHub.init)