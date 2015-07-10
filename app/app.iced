Pack = require './Pack'
Hand = require './Hand'
Table = require './Table'
CardRow = require './CardRow'
Trick = require './Trick'

appMode = 'dealing'

await pack = new Pack defer cards

table = new Table window.innerWidth, window.innerHeight, pack

# await Snap.load "icons/document.svg", defer new_icon
# newIcon = new_icon.select('svg')
# newIcon.attr fill:'white'
# newIcon.click ->
# 	console.log 'doc clicked!'
# iconsGroup = table.snapArea.g()
# iconsGroup.add newIcon
# console.log newIcon.getBBox()
# iconsGroup.transform "t100,100"

bNew = document.getElementById 'bNew'
bStart = document.getElementById 'bStart'
bForward = document.getElementById 'bForward'
bBack = document.getElementById 'bBack'

bNew.addEventListener 'click', ->
	startDealing()

bStart.addEventListener 'click', ->
	table.appMode = 'moving'
	table.deal = {}
	table.deal.tricks = []
	table.deal.trump = 'diamond'
	table.deal.startHand = table.deal.firstHand = 'west'
	table.deal.tricks.push new Trick table, pack
	for hand in table.deal.tricks[0].hands
		table["hand_#{hand}"].unbindHandCardsHovers()
		table["hand_#{hand}"].unbindHandCardsClicksToCardRow()
	# зняти оброблювачі з усіх рук!!!
	table["hand_#{table.deal.firstHand}"].bindMovesToTrick()
	bStart.disabled = yes
	table.cardRow.cardRowGroup.clear()
	table.cardRow = null
	null

# pack.shuffle()

startDealing = ->
	table.appMode = 'dealing'
	bStart.disabled = no
	bForward.disabled = yes
	bBack.disabled = yes
	table.cardRow?.cardRowGroup?.clear()
	table.hand_west?.handGroup.clear()
	table.hand_north?.handGroup.clear()
	table.hand_east?.handGroup.clear()
	table.hand_south?.handGroup.clear()
	table.cardRow = new CardRow table, pack
	table.hand_west = new Hand table, pack, 'west', appMode
	table.hand_north = new Hand table, pack, 'north', appMode
	table.hand_east = new Hand table, pack, 'east', appMode
	table.hand_south = new Hand table, pack, 'south', appMode
	null

startDealing()

# myCircle = table.snapArea.circle 300,300,60,60
# myRect = table.snapArea.rect 400,400,60,60
# myRect.hover setHoverIn, setHoverOut
# # myRect.hover (
# # 	(->
# # 		console.log '1'
# # 	),
# # 	(->
# # 		console.log '2'
# # 	)
# # 		)
# myRect.click ->
# 	console.log '1'
# myGroup = table.snapArea.g myCircle, myRect
# for i, el of myGroup when not Number.isNaN +i
# 	console.log el
# 	el.hover do setHoverIn, do setHoverOut

# setHoverIn = -> ->
# 	console.log '1'
# 	@attr fill:'yellow'
# 	null
# setHoverOut = -> ->
# 	console.log '2'
# 	@attr fill:'red'
# 	null

# someGroup = table.snapArea.g()
# anotherGroup = table.snapArea.g()
# someGroup.add pack.heart
# anotherGroup.add pack.backBlue
# tr = "t#{table.coords.center.x},
# 	#{table.coords.center.y}
# 	s#{table.cardSizeRatio}"
# someGroup.transform tr
# anotherGroup.transform "#{tr}s.0001,1"
# anotherGroup.drag()
# someGroup.stop().animate transform: "#{tr}s.0001,1", 400, mina.easein
# setTimeout (-> anotherGroup.stop().animate transform: tr, 400, mina.easeout), 400

window.addEventListener 'resize', ->
	table.getCoords window.innerWidth, window.innerHeight
	table.hand_west?.renderHand()
	table.hand_north?.renderHand()
	table.hand_east?.renderHand()
	table.hand_south?.renderHand()
	table.cardRow?.renderCardRow()
