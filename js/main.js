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

function findMoveableTiles(emptyTile) {
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

function swapTiles(tile, emptyTile) {
	var tileRow = $(tile).attr("data-row");
	var tileCol = $(tile).attr("data-col");

	var emptyTileRow = emptyTile[0];
	var emptyTileCol = emptyTile[1];

	// if the tile is moveable, swap the tile with the empty tile.              
	// update the empty tile and the moveable tiles.
	if($(tile).hasClass("moveable")) {
		$(tile).attr("class", "tile " + "row" + emptyTileRow + " " + "col" + emptyTileCol);
		$(tile).attr("data-row", emptyTileRow);
		$(tile).attr("data-col", emptyTileCol);
		emptyTileRow = tileRow;
		emptyTileCol = tileCol;
		findMoveableTiles([emptyTileRow, emptyTileCol]);	
	}
	return [emptyTileRow, emptyTileCol];
}

function shufflePuzzleboard(emptyTile) {
	for(var i = 0; i <= 10; i++) {
		var neighbors = $(".moveable");
		var randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

		emptyTile = swapTiles(randomNeighbor, emptyTile)
	}
	return emptyTile;
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

function clearLastGame() {
	$(".tile").removeClass("winningboard");
	$("#messageboard").empty();
}

function setWinningState() {
	$(".tile").addClass("winningboard");
	$(".tile").removeClass("moveable");
	$("#messageboard").append("<p>YOU WIN!!</p>");
}

function setClickCounter(clickCounter) {
	$("#clickCounter").html("Clicks: " + clickCounter)
}

$(document).ready(function() {
	// start game with an empty tile in position (4, 4)
	var emptyTile = [4, 4];
	var clickCounter = 0;

	createPuzzleBoard();

	// shuffle puzzle board and clear last game
	$("#shufflebutton").click(function() {
		clearLastGame();
		clickCounter = 0;
		setClickCounter(clickCounter);
		findMoveableTiles(emptyTile);
		emptyTile = shufflePuzzleboard(emptyTile);
		$(this).addClass("shuffled");
	})

	// when a tile is clicked, move it to the location of the empty tile
	$("#puzzleboard").on("click", ".moveable", function() {
		emptyTile = swapTiles($(this), emptyTile);
		var win = checkForWin();
		clickCounter++;
		setClickCounter(clickCounter);

		if($("#shufflebutton").hasClass("shuffled") && win) {
			setWinningState();
		}
	})
})

