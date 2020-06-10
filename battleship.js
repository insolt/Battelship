var view={

	displayMessage: function(msg) {
		var comments=document.getElementById("comments");
		comments.innerHTML=msg;
	},
	
	displayHit: function(locations) {
		var cell=document.getElementById(locations);
		cell.setAttribute("class", "hit");
	},
	
	displayMiss: function(locations) {
		var cell=document.getElementById(locations);
		cell.setAttribute("class", "miss");
	}
	
};

var model={
	
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,

	ships: [{locations: [0, 0, 0], hits: ["", "", ""]},
			{locations: [0, 0, 0], hits: ["", "", ""]},
			{locations: [0, 0, 0], hits: ["", "", ""]}],

	fire: function(guess) {
		for (var i=0; i<this.numShips; i++) {
			var ship=this.ships[i];
			var index=ship.locations.indexOf(guess);
			if (index>=0) {
				ship.hits[index]="hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
				if (this.isSunk(ship)) {
					console.log(this.isSunk(ship));
					view.displayMessage("Ship is sung!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("MISSED!")
		return false;
	},
	
	isSunk: function(ship) {
		console.log(ship);
		for (var i=0; i<this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				
				return false;
			}
			return true;
		}
	},
	
	generateShipLocations: function() {
		var locations;
		for (var i=0; i<this.numShips; i++) {
			do {
				locations=this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations=locations;
		}
	},
	
	generateShip: function() {
		var direction=Math.floor(Math.random()*2);
		var row, col;
		if (direction===1) {
			row=Math.floor(Math.random()*this.boardSize);
			col=Math.floor(Math.random()*(this.boardSize-this.shipLength));
		}else {
			row=Math.floor(Math.random()*(this.boardSize-this.shipLength));
			col=Math.floor(Math.random()*this.boardSize);
		}
		var newShipLocations=[];
		for (var i=0;i<this.shipLength; i++) {
			if (direction===1) {
				newShipLocations.push(row+""+(col+i));
			} else {
				newShipLocations.push((row+i)+""+col);
			}
		}
		return newShipLocations;
	},
	
	collision: function(locations) {
		for (var i=0; i<this.numShips;i++) {
			var ship=model.ships[i];
			for (var j=0; j<locations.length; j++) {
				if (ship.locations.indexOf(locations[j])>=0) {
					return true;
				}
			}
		}
		return false;
	}
};
	
var controller={
	guesses: 0,
	
	
	processGuess: function(guess) {
		var location=parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit=model.fire(location);
			if (hit && model.shipsSunk===model.sumShip) {
				view.displayMessage("You sunk all the ships after "+this.guesses+" hits.");
			}
		}
	}
};

function parseGuess(guess) {
	var alphabet=["A", "B", "C", "D", "E", "F", "G"];
	var secondFigure=["1", "2", "3", "4", "5", "6", "7"];
	if (guess===null || guess.length!=2) {
		alert("Ups... type letter and number");
	} else {
		var firstChar=guess.charAt(0);
		var row=alphabet.indexOf(firstChar);

		var secondChar=guess.charAt(1);
		var column=secondFigure.indexOf(secondChar);

		if (isNaN(row) || isNaN(column)) {
			alert("Wrong coordinates");
		} else if (row<0 || row>=model.boardSize || column<0 || column>=model.boardSize) {
			alert("Coordinates out of range");
		} else {
			return row+''+column;
		}
	}
	return null;
};

function handleFireButton() {
	var guessInput=document.getElementById("guessInput");
	var guess=guessInput.value;
	controller.processGuess(guess);
	guessInput.value="";
};

function handlKeyPress(e) {
	var fireButton=document.getElementById("fireButton");
	if (e.keyCode===13) {
		fireButton.click();
		return false;
	}
};

function init() {
	var fireButton=document.getElementById("fireButton");
	fireButton.onclick=handleFireButton;
	var guessInput=document.getElementById("guessInput");
	guessInput.onkeypress=handlKeyPress;
	model.generateShipLocations();
};