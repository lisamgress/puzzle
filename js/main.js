function createPuzzleBoard() {
	var row = 1;
	var col = 1;

	for(i = 1; i <= 15; i++) {
		var newTile = $("<div>" + i + "</div>");
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

$(document).ready(function() {
	// start game with an empty tile in position (4, 4)
	var emptyTile = ["row4", "col4"];
	
	createPuzzleBoard();
	findMoveableTiles(emptyTile);

	// shuffle puzzle board
	$("#shufflebutton").click(function() {
		emptyTile = shufflePuzzleboard(emptyTile);
	})

	// when a tile is clicked, move it to the location of the empty tile
	$(".tile").click(function() {
		emptyTile = swapTiles($(this), emptyTile);
	})
})

