Pack = require './Pack'
Hand = require './Hand'
Table = require './Table'
CardRow = require './CardRow'

await pack = new Pack defer cards

table = new Table window.innerWidth, window.innerHeight, pack

# pack.shuffle()

table.cardRow = new CardRow table, pack
# table.snapArea.add table.cardRow.cardRowGroup

table.handNorth = new Hand table, pack, 'north'
table.snapArea.add pack.club

window.addEventListener 'resize', ->
	table.getCoords window.innerWidth, window.innerHeight
	table.handNorth?.renderHand()
	table.cardRow?.renderCardRow()
