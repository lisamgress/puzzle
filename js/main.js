var seconds;
var timerIntervalHandle;
var clickCounter;
var emptyTile;

function createPuzzleBoard() {
	var rowNum;
	var colNum;

	for(i = 1; i <= 15; i++) {
		var newTile = $("<div></div>");
		newTile.attr("id", "tile" + i);
		newTile.addClass("tile");

		rowNum = Math.floor((i - 1) / 4) + 1;
		colNum = (i - 1) % 4 + 1;

		newTile.addClass("row" + rowNum);
		newTile.addClass("col" + colNum);
		newTile.attr("data-row", rowNum);
		newTile.attr("data-col", colNum);

		$("#puzzleboard").append(newTile);
	}
}

function findMoveableTiles() {
	// clear any existing moveable tags
	$(".tile").removeClass("moveable");

	var emptyTileRow = emptyTile[0];
	var emptyTileCol = emptyTile[1];

	// check each tile to see if it is moveable and if it is, tag it.
	$(".tile").each(function() {
		var tileRow = $(this).attr("data-row");
		var tileCol = $(this).attr("data-col");

		if((Math.abs(tileRow - emptyTileRow) == 1 && Math.abs(tileCol - emptyTileCol) == 0 )||
			(Math.abs(tileRow - emptyTileRow) == 0 && Math.abs(tileCol - emptyTileCol) == 1)) {
			$(this).addClass("moveable");
		}
	})
}

function swapTiles(tile) {
	var tileRow = Number($(tile).attr("data-row"));
	var tileCol = Number($(tile).attr("data-col"));

	var emptyTileRow = emptyTile[0];
	var emptyTileCol = emptyTile[1];

	// if the tile is moveable, swap the tile with the empty tile.              
	// update the empty tile and the moveable tiles.
	if($(tile).hasClass("moveable")) {
		$(tile).attr("class", "tile " + "row" + emptyTileRow + " " + "col" + emptyTileCol);
		$(tile).attr("data-row", emptyTileRow);
		$(tile).attr("data-col", emptyTileCol);
		emptyTile = [tileRow, tileCol];
		findMoveableTiles();	
	}
}

function shufflePuzzleboard(numTileSwaps) {
	for(var i = 0; i <= numTileSwaps; i++) {
		var neighbors = $(".moveable");
		var randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

		swapTiles(randomNeighbor, emptyTile);
	}
}

function checkForWin() {
	var winningBoard = {
		tile1 : ["row1", "col1"],
		tile2 : ["row1", "col2"],
		tile3 : ["row1", "col3"],
		tile4 : ["row1", "col4"],
		tile5 : ["row2", "col1"],
		tile6 : ["row2", "col2"],
		tile7 : ["row2", "col3"],
		tile8 : ["row2", "col4"],
		tile9 : ["row3", "col1"],
		tile10 : ["row3", "col2"],
		tile11 : ["row3", "col3"],
		tile12 : ["row3", "col4"],
		tile13 : ["row4", "col1"],
		tile14 : ["row4", "col2"],
		tile15 : ["row4", "col3"],
	}

	var tiles = $(".tile");

	for(var i = 0; i < tiles.length; i++) {
		var tile = $(tiles[i]);
		var id = tile.attr("id");

		if(!($(tile).hasClass(winningBoard[id][0]) && $(tile).hasClass(winningBoard[id][1]))) {
			return false;
		} 
	}
	return true;
}

function setWinningState() {
	$(".tile").addClass("dimboard");
	$(".tile").removeClass("moveable");
	$("#messageboard").text("YOU WIN!!");
}

function setClickCounter() {
	$("#clickCounter").html("Clicks: " + clickCounter);
}

function displayTimer() {
	var min = Math.floor(seconds / 60);
	var sec = seconds - (min * 60);

	// format minutes and seconds to have a leading zero if less than 10
	sec = (sec < 10) ? "0" + sec : sec;
	min = (min < 10) ? "0" + min : min;

	var timeToDisplay = min + ":" + sec;
	$("#timer").html("Time elapsed: " + timeToDisplay);	
}

function setTimer() {
	seconds = 0;
	displayTimer();
}

function tick() {
	seconds++;
	displayTimer();
}

function startTimer() {
	seconds = 0;
	timerIntervalHandle = setInterval(tick, 1000);
}

function setPhoto() {
	var selectedPhoto = $("input[name='photo']:checked").val();
	var selectedPhotoLocation = "url('img/" + selectedPhoto + ".jpg')";
	$(".tile").css("background-image", selectedPhotoLocation);	
}

function setDifficultyLevel() {
	var selectedLevel = $("input[name='level']:checked").val();
	if (selectedLevel == "easy") {
		return 10;
	} else if (selectedLevel == "medium") {
		return 500;
	} else {
		return 1000;
	}
}

function setShuffledPuzzleBoard() {
	$("#messageboard").empty();
	$("#puzzleboard").addClass("shuffled");
	$("#selectdifficultylevel, #selectphoto").addClass("dim");

	$("#shufflebutton").hide();
	$("#resetbutton").show();

	$("input[name='photo']").attr("disabled", true);
	$("input[name='level']").attr("disabled", true);
}

function setPuzzleBoard() {
	$("#puzzleboard").empty();
	createPuzzleBoard();
	setPhoto();
	emptyTile = [4, 4];		// start game with an empty tile in position (4, 4)

	clickCounter = 0;
	setClickCounter();
	clearInterval(timerIntervalHandle);
	setTimer();

	$("#messageboard").text("Click shuffle to play the game");

	$("#shufflebutton").show();
	$("#resetbutton").hide();

	$("input[name='photo']").attr("disabled", false);
	$("input[name='level']").attr("disabled", false);

	$("#selectdifficultylevel, #selectphoto").removeClass("dim");
}

$(document).ready(function() {
	setPuzzleBoard();

	// detect photo selection changes
	$("input[name='photo']").change(setPhoto);

	// shuffle puzzleboard
	$("#shufflebutton").click(function() {
		findMoveableTiles();
		var difficultyLevel = setDifficultyLevel();
		shufflePuzzleboard(difficultyLevel);
		setShuffledPuzzleBoard();
		startTimer();
	})

	// reset puzzleboard
	$("#resetbutton").click(function() {
		setPuzzleBoard();
	})

	// when a moveable tile is clicked, move it to the location of the empty tile 
	$("#puzzleboard").on("click", ".moveable", function() {
		swapTiles($(this));
		clickCounter++;
		setClickCounter();

		// check for winning board
		if($("#puzzleboard").hasClass("shuffled") && checkForWin()) {
			setWinningState();
			clearInterval(timerIntervalHandle);
		}
	})
})