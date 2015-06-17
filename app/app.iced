Pack = require './Pack'
Hand = require './Hand'
Table = require './Table'
CardRow = require './CardRow'

appMode = 'dealing'

await pack = new Pack defer cards

table = new Table window.innerWidth, window.innerHeight, pack

bNew = document.getElementById 'bNew'
bStart = document.getElementById 'bStart'
bForward = document.getElementById 'bForward'
bBack = document.getElementById 'bBack'

bNew.addEventListener 'click', ->
	startDealing()

bStart.addEventListener 'click', ->
	appMode = 'moving'
	bStart.disabled = yes
	table.cardRow.cardRowGroup.clear()
	table.cardRow = null
	null

# pack.shuffle()

startDealing = ->
	appMode = 'dealing'
	bStart.disabled = no
	bForward.disabled = yes
	bBack.disabled = yes
	table.snapArea.clear()
	table.cardRow = new CardRow table, pack
	table.hand_west = new Hand table, pack, 'west', appMode
	table.hand_north = new Hand table, pack, 'north', appMode
	table.hand_east = new Hand table, pack, 'east', appMode
	table.hand_south = new Hand table, pack, 'south', appMode
	null

startDealing()

someGroup = table.snapArea.g()
anotherGroup = table.snapArea.g()
someGroup.add pack.heart
anotherGroup.add pack.backBlue
tr = "t#{table.coords.center.x},
	#{table.coords.center.y}
	s#{table.cardSizeRatio}"
someGroup.transform tr
anotherGroup.transform "#{tr}s.0001,1"
anotherGroup.drag()
someGroup.stop().animate transform: "#{tr}s.0001,1", 400, mina.easein
setTimeout (-> anotherGroup.stop().animate transform: tr, 400, mina.easeout), 400

window.addEventListener 'resize', ->
	table.getCoords window.innerWidth, window.innerHeight
	table.hand_west?.renderHand()
	table.hand_north?.renderHand()
	table.hand_east?.renderHand()
	table.hand_south?.renderHand()
	table.cardRow?.renderCardRow()
