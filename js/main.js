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

function findMoveableTiles(row, col) {
	// clear any existing moveable tags
	$(".tile").removeClass("moveable");

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

$(document).ready(function() {
	createPuzzleBoard();

	// start game with an empty tile in position (4, 4)
	var emptyTileRow = "row4";
	var emptyTileCol = "col4";

	findMoveableTiles(emptyTileRow, emptyTileCol);

	// when a tile is clicked, move it to the location of the empty tile
	$(".tile").click(function() {
		var tileCurrentLocation = $(this).attr("class").split(" ");
		var currentTileRow = tileCurrentLocation[1];
		var currentTileCol = tileCurrentLocation[2];

		// if the tile is moveable, move the tile.
		// find the new empty tile and the new moveable tiles.
		if($(this).hasClass("moveable")) {
			$(this).attr("class", "tile " + emptyTileRow + " " + emptyTileCol);
			emptyTileRow = currentTileRow;
			emptyTileCol = currentTileCol;
			findMoveableTiles(emptyTileRow, emptyTileCol);
		}
	})
})

