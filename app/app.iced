Pack = require './Pack'
Hand = require './Hand'
Table = require './Table'
CardRow = require './CardRow'
Trick = require './Trick'
utils = require './utils'

appMode = 'dealing'

await pack = new Pack defer cards

table = new Table window.innerWidth, window.innerHeight, pack

buttons = ['document', 'flag-2', 'arrow-left', 'arrow-right']
buttonFragments = []
buttonPics = []

f = table.snapArea.filter Snap.filter.shadow 7,7,3,'black',.8
buttonAttrs = fill: 'white', stroke: 'black', strokeWidth: 1

await
	for b,i in buttons
		Snap.load "icons/#{b}.svg", defer buttonFragments[i]

for fragment, i in buttonFragments
	do (fragment) ->
		el = fragment.select('svg')
		button = table.snapArea.g()
		button.add el
		elWidth = button.getBBox().width
		elHeight = button.getBBox().height
		rect = table.snapArea.rect 0, 0, elWidth, elHeight
		rect.attr fill: 'transparent'
		button.add rect
		button.data 'currentTransform', "t#{10 + i * 58},10"
		button.transform "#{button.data 'currentTransform'}"
		el.attr buttonAttrs
		button.attr filter: f
		button.mousedown ->
			@data 'mousedown', yes
			@transform "#{button.data 'currentTransform'}s.95t2,2"
		button.mouseup ->
			@transform "#{button.data 'currentTransform'}"
		button.hover (->
			button[0].attr fill: '#f00')
			,(->
				button[0].attr fill: 'white'#, 'fill-opacity': 1
				if @data 'mousedown'
					@transform "#{button.data 'currentTransform'}"
					@data 'mousedown', no)
		buttonPics.push button

buttonPics[0].click ->
	startDealing()

buttonPics[1].click ->
	table.appMode = 'moving'
	table.deal = {}
	table.deal.tricks = []
	table.deal.trump = 'd'
	table.deal.firstHand = 'west'
	table.deal.tricks.push new Trick table, pack
	# console.log table.deal.tricks[table.deal.tricks.length - 1]
	for hand in table.deal.tricks[0].hands
		table.hands["#{hand}"].unSetHovers()
		# table["hand_#{hand}"].unbindHandCardsClicksToCardRow()
		table.hands["#{hand}"].unSetMouseupsToCardRow()
	# зняти оброблювачі з усіх рук!!!
	table.hands["#{table.deal.firstHand}"].bindMovesToTrick()
	buttonPics[1][0].attr fill: 'grey'
	# table.cardRow.cardRowGroup.clear()
	for el in table.cardRow.cardRowGroup
		el.remove()
	table.cardRow = null
	null

# pack.shuffle()

startDealing = ->
	table.appMode = 'dealing'
	for hand in table.hands
		hand.cardRowGroup.clear()
	table.cardRow = new CardRow table, pack
	table.hands.west = new Hand table, pack, 'west', appMode
	table.hands.east = new Hand table, pack, 'east', appMode
	table.hands.south = new Hand table, pack, 'south', appMode
	null

startDealing()

window.addEventListener 'resize', ->
	table.getCoords window.innerWidth, window.innerHeight
	for name, hand of table.hands
		hand.renderHand()
	table.cardRow?.renderCardRow()
