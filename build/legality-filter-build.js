var fs = require('fs')
var magic = require('./AllCards-x.json');

//Legality for Battle For Zendikar isn't set yet, assume all legal
var newSet = 'BFZ'
var allLegal = [ { format: 'Commander', legality: 'Legal' },{ format: 'Freeform', legality: 'Legal' },{ format: 'Legacy', legality: 'Legal' },{ format: 'Modern', legality: 'Legal' }, { format: 'Prismatic', legality: 'Legal' },{ format: 'Standard', legality: 'Legal' },{ format: 'Singleton 100', legality: 'Legal' },{ format: 'Tribal Wars Legacy', legality: 'Legal' },{ format: 'Tribal Wars Standard', legality: 'Legal' },{ format: 'Vintage', legality: 'Legal' } ]

function legalFilter(card, format) {
	var legalCheck = card.legalities.filter(function(arr, index) {
		return arr.format === format && arr.legality === 'Legal';
	})
	if(legalCheck.length === 0) {
		return false
 	} else {
 		return true
 	}
}

var masterLegal = {};
var standardLegal = [];
var commanderLegal = [];
var modernLegal = [];

function build(cardSet) {
	for(var key in cardSet) {
		var card = cardSet[key];
		if(card.printings.indexOf(newSet) >= 0) {
			card.legalities = allLegal 
		}
		masterLegal[card.name] = card.legalities;

		if(card.legalities !== undefined) {
			if(legalFilter(card, 'Standard')) {
				standardLegal.push(card.name);
			}
			if(legalFilter(card, 'Modern')) {
				modernLegal.push(card.name);
			}
			if(legalFilter(card, 'Commander')) {
				commanderLegal.push(card.name);
			}
		}
	}
}

build(magic)
console.log("Standard Cards:", standardLegal.length);
console.log("Modern Cards:", modernLegal.length);
console.log("Commander Cards", commanderLegal.length);

var legal = {
	standard: standardLegal,
	modern: modernLegal,
	commander: commanderLegal
}

// fs.writeFile('dist/master-legal.json', JSON.stringify(masterLegal));
// fs.writeFile('dist/standard-legal.json', JSON.stringify(standardLegal));
// fs.writeFile('dist/commander-legal.json', JSON.stringify(commanderLegal));
// fs.writeFile('dist/modern-legal.json', JSON.stringify(modernLegal));

fs.writeFile('dist/legality.json', JSON.stringify(legal))