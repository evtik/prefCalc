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
showMe()

# pack.shuffle()
table.hands = []
# eastCards = pack.cards.splice 0, 10
# southCards = pack.cards.splice 0, 2
# westCards = pack.cards.splice 0, 10
# northCards = pack.cards.splice 0, 10

# table.hands.push new Hand table, pack, eastCards, "east"
# table.hands.push new Hand table, pack, southCards, "south"
# table.hands.push new Hand table, pack, westCards, "west"
# table.hands.push new Hand table, pack, northCards, "north"

table.cardRow = new CardRow table, pack
table.snapArea.add table.cardRow.cardRowGroup

for hand, i in table.hands
	table.snapArea.add hand.handGroup

window.addEventListener 'resize', ->
	table.getCoords window.innerWidth, window.innerHeight
	showMe()
	for hand, i in table.hands
		hand.renderHand()
	table.cardRow.renderCardRow()

# rect1 = table.snapArea.rect 500, 200, 50, 50, 3, 3
# rect1.attr fill: 'transparent', stroke: 'red', strokeWidth: 2
# rect2 = rect1.clone()
# rect2.attr fill: 'transparent', stroke: 'green', strokeWidth: 2
# rect3 = table.snapArea.rect 500, 800, 50, 50
# rect3.attr fill: 'transparent', stroke: 'red', strokeWidth: 2
# rect4 = table.snapArea.rect 500, 800, 50, 50
# rect4.attr fill: 'transparent', stroke: 'green', strokeWidth: 2
# rect1.transform "s2S2"
# rect3.transform "s2"
# rect3.transform "t100"
