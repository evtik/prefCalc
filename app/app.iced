Pack = require './Pack'
Hand = require './Hand'
Table = require './Table'
CardRow = require './CardRow'

await pack = new Pack defer cards

showMe = ->
	console.log "table: #{Math.floor table.width} x #{Math.floor table.height}
	, snap area: #{table.snapArea.node.parentNode.clientWidth} x #{table.snapArea.node.parentNode.clientHeight}
	, card was: #{Math.floor pack.cardWidth} x #{Math.floor pack.cardHeight}
	, card size: #{Math.floor table.cardWidth} x #{Math.floor table.cardHeight}
	, card ratio: #{table.cardSizeRatio}
	, card rot center #{Math.floor table.coords.rotX} x #{Math.floor table.coords.rotY}
	, row: #{Math.floor table.coords.lowerRow.x} x #{Math.floor table.coords.lowerRow.y}"

table = new Table window.innerWidth, window.innerHeight, pack
# showMe()

# pack.shuffle()

table.cardRow = new CardRow table, pack
table.snapArea.add table.cardRow.cardRowGroup

table.handNorth = new Hand table, pack, 'north'


window.addEventListener 'resize', ->
	table.getCoords window.innerWidth, window.innerHeight
	table.handNorth.renderHand()
	table.cardRow.renderCardRow()
	console.log table.rowLength
