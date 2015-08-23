Pack = require './Pack'
Hand = require './Hand'
Table = require './Table'
CardRow = require './CardRow'
Trick = require './Trick'
utils = require './utils'

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
	for hand in table.deal.tricks[0].hands
		table.hands["#{hand}"].unSetHovers()
		table.hands["#{hand}"].unSetDrags()
	# зняти оброблювачі з усіх рук!!!
	table.hands["#{table.deal.firstHand}"].bindMovesToTrick()
	buttonPics[1][0].attr fill: 'grey'
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
	table.hands.west = new Hand table, pack, 'west', table.appMode
	table.hands.east = new Hand table, pack, 'east', table.appMode
	table.hands.south = new Hand table, pack, 'south', table.appMode
	null

startDealing()

window.addEventListener 'resize', ->
	table.getCoords window.innerWidth, window.innerHeight
	table.cardRow?.renderCardRow()
	lastTrick = table.deal?.tricks[table.deal.tricks.length - 1]
	lastTrick?.renderTrick()
	for name, hand of table.hands
		if table.appMode is 'moving'
			hand.renderTricks()

		# no need to render fanFrame in 'moving' mode
		# implemented not through "if...else..." since
		# 1) tricks should be under a hands' cards
		# so renderHand() should go after renderTricks()
		# 2) in 'dealing' mode hovers and drags can be
		# set right after rendering cards
		# 3) though in 'moving' mode hovers/drags are
		# set depending on the current trick's cards
		# number

		hand.renderHand()

		if table.appMode is 'dealing'
			hand.renderFanFrame()
			hand.setHovers()
			hand.setDrags()

	if table.appMode is 'moving'
		switch lastTrick.cards.length
			# there's no need to unset event handlers
			# as a hand's fan is built from scratch
			# also no need to get allowed suit for a
			# hand as it has been set upon first
			# Hand.setHovers()
			when 0
				# empty trick, setting for the 1st hand
				table.hands["#{lastTrick.hands[0]}"].setHovers()
				table.hands["#{lastTrick.hands[0]}"].setDrags()
			when 1
				# set for the the second and third
				table.hands["#{lastTrick.hands[1]}"].setHovers()
				table.hands["#{lastTrick.hands[1]}"].setDrags()
				table.hands["#{lastTrick.hands[2]}"].setHovers()
			when 2
				# the 3rd
				table.hands["#{lastTrick.hands[2]}"].setHovers()
				table.hands["#{lastTrick.hands[2]}"].setDrags()
			# when 3
				# suppose user'll have no time to resize till
				# animation finishes
