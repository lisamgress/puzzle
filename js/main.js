function createPuzzleBoard() {
	var row = 1;
	var col = 1;

	for(i = 1; i <= 15; i++) {
		var newTile = $("<div>" + i + "</div>");
		newTile.attr("id", i);
		newTile.addClass("tile");

		if (col > 4) {
			col = 1;
			row++;
		}

		newTile.addClass("row" + row);
		newTile.addClass("col" + col);
		col++;

		$("#puzzleboard").append(newTile);
	}
}

function findMoveableTiles(emptyTile) {
	// clear any existing moveable tags
	$(".tile").removeClass("moveable");

	var row = emptyTile[0];
	var col = emptyTile[1];

	// check each tile to see if it is moveable and if it is, tag it.
	$(".tile").each(function() {
		var tile = $(this).attr("class").split(" ");
		var tileRow = parseInt(tile[1][3], 10);
		var tileCol = parseInt(tile[2][3], 10);

		var emptyTileRowNum = parseInt(row[3], 10);
		var emptyTileColNum = parseInt(col[3], 10);

		if((Math.abs(tileRow - emptyTileRowNum) == 1 && Math.abs(tileCol - emptyTileColNum) == 0 )||
			(Math.abs(tileRow - emptyTileRowNum) == 0 && Math.abs(tileCol - emptyTileColNum) == 1)) {
			$(this).addClass("moveable");
		}
	})
}

function swapTiles(tile, emptyTile) {
	var tileRow = $(tile).attr("class").split(" ")[1];
	var tileCol = $(tile).attr("class").split(" ")[2];

	var emptyTileRow = emptyTile[0];
	var emptyTileCol = emptyTile[1];

	// if the tile is moveable, swap the tile with the empty tile.              
	// update the empty tile and the moveable tiles.
	if($(tile).hasClass("moveable")) {
		$(tile).attr("class", "tile " + emptyTileRow + " " + emptyTileCol);
		emptyTileRow = tileRow;
		emptyTileCol = tileCol;
		findMoveableTiles([emptyTileRow, emptyTileCol]);	
	}
	return [emptyTileRow, emptyTileCol];
}

function shufflePuzzleboard(emptyTile) {
	for(var i = 0; i <= 1000; i++) {
		var neighbors = $(".moveable");
		var randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

		emptyTile = swapTiles(randomNeighbor, emptyTile)
	}
	return emptyTile;
}

function checkForWin() {
	var winningBoard = {
		1 : ["row1", "col1"],
		2 : ["row1", "col2"],
		3 : ["row1", "col3"],
		4 : ["row1", "col4"],
		5 : ["row2", "col1"],
		6 : ["row2", "col2"],
		7 : ["row2", "col3"],
		8 : ["row2", "col4"],
		9 : ["row3", "col1"],
		10 : ["row3", "col2"],
		11 : ["row3", "col3"],
		12 : ["row3", "col4"],
		13 : ["row4", "col1"],
		14 : ["row4", "col2"],
		15 : ["row4", "col3"],
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

$(document).ready(function() {
	// start game with an empty tile in position (4, 4)
	var emptyTile = ["row4", "col4"];

	createPuzzleBoard();
	findMoveableTiles(emptyTile);

	// shuffle puzzle board
	$("#shufflebutton").click(function() {
		emptyTile = shufflePuzzleboard(emptyTile);
		$(this).addClass("shuffled");
	})

	// when a tile is clicked, move it to the location of the empty tile
	$(".tile").click(function() {
		emptyTile = swapTiles($(this), emptyTile);
		var win = checkForWin();

		if($("#shufflebutton").hasClass("shuffled") && win) {
			$("#messageboard").append("<p>YOU WIN!!</p>");
		}
	})
})

