Pack = require './Pack'
Hand = require './Hand'
Table = require './Table'

await pack = new Pack defer cards

showMe = ->
	console.log "table: #{Math.floor table.width} x #{Math.floor table.height}
	, snap area: #{table.snapArea.node.parentNode.clientWidth} x #{table.snapArea.node.parentNode.clientHeight}
	, upper right: #{Math.floor table.coords.center.x} x #{Math.floor table.coords.center.y}
	, card was: #{Math.floor pack.cardWidth} x #{Math.floor pack.cardHeight}
	, card size: #{Math.floor table.cardWidth} x #{Math.floor table.cardHeight}
	, card ratio: #{table.cardSizeRatio}
	, card rot center #{Math.floor table.coords.center.rotX} x #{Math.floor table.coords.center.rotY}"

table = new Table window.innerWidth, window.innerHeight, pack
showMe()

pack.shuffle()
tenCards = pack.cards.splice 20, 10
# handCenterX = (window.innerWidth - pack.cardWidth) / 2
# handCenterY = (window.innerHeight - pack.cardHeight) / 2

handSouth = new Hand table, pack, tenCards, "center"
table.snapArea.g handSouth.handGroup

window.addEventListener 'resize', ->
	table.getCoords window.innerWidth, window.innerHeight
	showMe()
	handSouth.renderHand()

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
