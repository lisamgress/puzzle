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

$(document).ready(function() {
	createPuzzleBoard();
})

