const newGame = document.querySelector('#reset_game');
const fireLocation = document.querySelectorAll('input');
const allLocations = document.querySelectorAll('td');

/**
 * Model
 */
let model = {
	
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,

	ships: [{locations: [null, null, null], hits: ["", "", ""]},
			{locations: [null, null, null], hits: ["", "", ""]},
			{locations: [null, null, null], hits: ["", "", ""]}],

	generateShipLocations: function() {
		let location;
		for (let i=0; i<this.numShips; i++) {
			do 
			{
				location=this.generateShip();
			} while (this.collision(location));

			this.ships[i].locations=location;
		}		
	},
	
	generateShip: function() {
		let direction = Math.floor(Math.random()*2);
		let row, col;
		if (direction === 1) {
			row = Math.floor(Math.random()*this.boardSize);
			col = Math.floor(Math.random()*(this.boardSize-this.shipLength));
		} else {
			row = Math.floor(Math.random()*(this.boardSize-this.shipLength));
			col = Math.floor(Math.random()*this.boardSize);
		}
		let newShipLocations=[];
		for (let i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row+""+(col+i));
			} else {
				newShipLocations.push((row+i)+""+col);
			}
		}
		return newShipLocations;
	},
	
	collision: function(location) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i];
			for (let j = 0; j < location.length; j++) {
				if (ship.locations.indexOf(location[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	},

	/**
	 * Action
	 */
	fire: function(guess) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i];
			let index = ship.locations.indexOf(guess);
			if (index >= 0) {
				ship.hits[index]="hit";
				view.displayAim(guess, "hit");
				view.displayMessage("Trafiony!");
				if (this.isSunk(ship)) {
					view.displayMessage("Statek zatopiony! Brawo!");
					this.shipsSunk++;
				}
				return;
			} else {
				view.displayAim(guess, "miss");
				view.displayMessage("Pudlo!")
			}
		}
		return true;
	},
	
	isSunk: function(ship) {
		console.log(ship);
		if (ship.hits.includes("")) {
				return false;
			}
			return true;
	}
};

/**
 * Viewer
 */
 let view = {
	displayMessage: function(msg) {
		let comments=document.getElementById("comments");
		comments.innerHTML=msg;
	},
	
	displayAim: function(location, addedClass) {
		const area=document.getElementById(location);
		area.classList.add(addedClass);
	}
};

/**
 * Controller
 */
let controller = {
	guesses: 0,
	processFire: function(e) {
		let guess = e.target.dataset.position;
		if (guess) {
			controller.guesses++;
			let hit = model.fire(guess);
			if (hit && (model.shipsSunk === model.numShips)) {
				view.displayMessage("Zatopiles wszystkie okrety za pomoca " + (controller.guesses - 1) + " strzalow");
			}
		}
	}
};

/**
 * Game reset/restart
 */
function startNewGame(e) {
	model.shipsSunk = 0;
	model.ships = [{locations: [null, null, null], hits: ["", "", ""]},
	{locations: [null, null, null], hits: ["", "", ""]},
	{locations: [null, null, null], hits: ["", "", ""]}]
	controller.guesses = 0;
	for (let i=0; i<allLocations.length; i++) {
		allLocations[i].classList.remove("miss");
		allLocations[i].classList.remove("hit");
	}
	for (let i=0; i<fireLocation.length; i++) {
		fireLocation[i].checked = false;
	}
	view.displayMessage("");
	model.generateShipLocations();
}

newGame.addEventListener('click', startNewGame);

for (let i=0; i<fireLocation.length; i++) {
	fireLocation[i].checked = true;
}

for (let i=0; i<fireLocation.length; i++) {
	fireLocation[i].addEventListener('change', controller.processFire);
}