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

function findMoveableTiles(emptyRow, emptyCol) {
	// clear any existing moveable tags
	$(".tile").removeClass("moveable");

	// check each tile to see if it is moveable and if it is, tag it.
	$(".tile").each(function() {
		var tile = $(this).attr("class").split(" ");
		var tileRow = parseInt(tile[1][3], 10);
		var tileCol = parseInt(tile[2][3], 10);

		var emptyTileRow = parseInt(emptyRow[3], 10);
		var emptyTileCol = parseInt(emptyCol[3], 10);

		if((Math.abs(tileRow - emptyTileRow) == 1 && Math.abs(tileCol - emptyTileCol) == 0 )||
			(Math.abs(tileRow - emptyTileRow) == 0 && Math.abs(tileCol - emptyTileCol) == 1)) {
			$(this).addClass("moveable");
		}
	})
}


$(document).ready(function() {
	createPuzzleBoard();

	// start game with an empty tile in position (4, 4)
	var emptyTileRowClass = "row4";
	var emptyTileColClass = "col4";

	findMoveableTiles(emptyTileRowClass, emptyTileColClass);

	// when a tile is clicked, move it to the location of the empty tile
	$(".tile").click(function() {
		var tileCurrentLocation = $(this).attr("class").split(" ");
		$(this).attr("class", "tile " + emptyTileRowClass + " " + emptyTileColClass);
		emptyTileRowClass = tileCurrentLocation[1];
		emptyTileColClass = tileCurrentLocation[2];
		findMoveableTiles(emptyTileRowClass, emptyTileColClass);
	})
})

