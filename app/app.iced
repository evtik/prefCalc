Pack = require './Pack'
Hand = require './Hand'
Table = require './Table'

table = new Table window.innerWidth, window.innerHeight
console.log table

window.addEventListener 'resize', ->
	table.snapArea.attr
		width: window.innerWidth
		height: window.innerHeight

await pack = new Pack defer cards
pack.shuffle()
tenCards = pack.cards.splice 20, 10
handCenterX = (window.innerWidth - pack.cardWidth) / 2
handCenterY = (window.innerHeight - pack.cardHeight) / 2

handSouth = new Hand table.snapArea, pack, tenCards, handCenterX, handCenterY
table.snapArea.g handSouth.handGroup
