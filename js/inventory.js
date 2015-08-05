Deck.prototype.checkin = function(cardName) {
	if(this.cards[cardName] !== undefined) {
		if(this.cards[cardName].inDeck === false) {
			this.cards[cardName].inDeck = true;
		} else {
			console.log(cardName + " is already checked in.");
		}
	} else {
		console.log(cardName + " is not in this deck.")
	}
}

Deck.prototype.checkout = function(cardName) {
	if(this.cards[cardName] !== undefined) {
		if(this.cards[cardName].inDeck === true) {
			this.cards[cardName].inDeck = false;
		} else {
			console.log(cardName + " is already checked out.");
		}
	} else {
		console.log(cardName + " is not in this deck.")
	}
}