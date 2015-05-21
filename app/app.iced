Pack = require './Pack'
Hand = require './Hand'
Table = require './Table'

await pack = new Pack defer cards

table = new Table window.innerWidth, window.innerHeight, pack

pack.shuffle()
tenCards = pack.cards.splice 20, 10
# handCenterX = (window.innerWidth - pack.cardWidth) / 2
# handCenterY = (window.innerHeight - pack.cardHeight) / 2

handSouth = new Hand table, pack, tenCards, "center"
table.snapArea.g handSouth.handGroup

window.addEventListener 'resize', ->
	table.getCoords window.innerWidth, window.innerHeight
	console.log table
	handSouth.renderHand()
