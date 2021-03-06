require './array-utils'
utils = require './utils'
Trick = require './Trick'

class Hand
	constructor: (@toolBar, @table, @pack, @seat, @cards, @isBlind, @isWidow) ->
		@shiftAngle = 12
		# випадкове сортування за зростанням або убуванням
		# номіналу карти на період "життя" руки
		# до цього було у @getSortOrders() тепер там тільки
		# сортування за мастями
		if Math.floor Math.random() * 2
			arr = @pack.sortValues.slice()
			@ranDirectionValues = arr.reverse()
		else
			@ranDirectionValues = @pack.sortValues

		@fanFrame = @table.snapArea.path ""
		@renderFanFrame()
		@grad = @table.snapArea.gradient "r(.5,.5,.95)#00f-#fff"
		@blurFilter = @table.snapArea.filter Snap.filter.blur 2, 2

		@fanFrame.attr strokeWidth: 4, stroke: 'green'
		, filter: @blurFilter, opacity: .3, fill: 'transparent'
		, visibility: 'hidden'
		# lorem = "Scott Glenn was born January 26, 1941, in Pittsburgh, Pennsylvania, to Elizabeth and Theodore Glenn, a salesman. As he grew up in Appalachia, his health was poor; he was bedridden for a year and doctors predicted he would limp for the rest of his life. During long periods of illness, Glenn was reading a lot and 'dreaming of becoming Lord Byron'"
		# caption = @table.snapArea.text 50, 50, lorem
		# caption.attr textpath: @fanFramePath

		@handCardsCounter = @table.snapArea.text 0, 0, ""
		@handCardsCounter.attr fill: 'white', 'text-anchor': 'middle'
			# .addClass 'cardsCounter'

		@cards = []
		@handGroup = []
		@tricks = []
		@tricksGroup = []
		@renderHand()

Hand::renderFanFrame = ->
	values = @table.coords["#{@seat}"]
	@fanFramePath = utils.describeSector values.sectorFanX
	, values.sectorFanY
	, @table.coords.fanInnerR, @table.coords.fanOuterR
	, -@shiftAngle * 3.8, @shiftAngle * 3.8

	@fanFrame.attr d: @fanFramePath

Hand::getTrickCoords = (index) ->
	startX = @table.coords[@seat].x
	startY = @table.coords[@seat].y
	height = @table.cardHeight
	width = @table.cardWidth
	size = height - width
	# offset = height * .2
	offset = 0
	# getting card right triangle
	angle = Snap.deg Math.atan width / height
	# getting the hypotenuse
	hypo = (Math.sqrt ((Math.pow width, 2) + (Math.pow height, 2))) / 2
	coords = [] # first two are cx and cy of the last trick, third is trstr
	if @seat is 'south' # horizontal placement
		xShift = hypo * Math.cos Snap.rad (-angle - 90 + 45)
		shift = index * 2 * (xShift + offset)
		unless index % 2
			tr = "s#{@table.cardSizeRatio},#{@table.cardSizeRatio}\
			r45T#{startX + shift},#{startY}"
		else
			tr = "s#{@table.cardSizeRatio},#{@table.cardSizeRatio}\
			r-45T#{startX + shift},#{startY}"
		coords.push (startX + shift + @pack.cardWidth / 2)
		coords.push (startY + @pack.cardHeight / 2)
	else # vertical placement
		yShift = hypo * Math.sin Snap.rad (-270 + angle + 45)
		shift = index * 2 * (yShift + offset)
		unless index % 2
			tr = "s#{@table.cardSizeRatio},#{@table.cardSizeRatio}\
			r45T#{startX},#{startY + shift}"
		else
			tr = "s#{@table.cardSizeRatio},#{@table.cardSizeRatio}\
			r-45T#{startX},#{startY + shift}"
		coords.push (startX + @pack.cardWidth / 2)
		coords.push (startY + shift + @pack.cardHeight / 2)
	coords.push tr
	coords

Hand::renderTricks = ->
	if @tricksGroup.length
		for t in @tricksGroup
			t.remove()
		@tricksGroup = []

	if @tricks.length
		for trick, i in @tricks
			backGroup = @table.snapArea.g().attr visibility:'hidden'
			back = @table.snapArea.g().add @pack.backBlue.clone()
			backGroup.add back

			trArr = @getTrickCoords i
			back.transform trArr[2]

			if i is (@tricks.length - 1) # the last trick
				size = @table.cardHeight - @table.cardWidth
				circle = @table.snapArea.circle 0,0
				, (@table.cardHeight - @table.cardWidth) * .6
					.attr fill: 'white', stroke: 'black', strokeWidth: 1
				number = @table.snapArea.text 0, size * .8 / 2, i + 1
					.attr fill:'black', 'font-size': size * .8
					, 'text-anchor': 'middle'

				# aligning number of tricks vertically
				box = number.getBBox()
				alignTr = "t0,-#{box.y + box.h / 2}"

				lastTrickCenter = "t#{trArr[0]},#{trArr[1]}"
				circle.transform lastTrickCenter
				number.transform "#{lastTrickCenter}#{alignTr}"
				backGroup.add circle, number

			backGroup.attr visibility: 'visible'

			@tricksGroup.push backGroup

Hand::getSortOrders = ->
	sameColors = ['d', 'h']
	currentSuits = (card.suit for card in @cards)
	uniqueSuits = currentSuits.unique()
	@sortedUniqueSuits = []

	if uniqueSuits.length <= 2
		@sortedUniqueSuits = uniqueSuits
	else
		checks = (sameColors.exists suit for suit in uniqueSuits)
		if checks[0] is not checks[1]
			if checks[1] is not checks[2]
				@sortedUniqueSuits = uniqueSuits
			else
				@sortedUniqueSuits.push uniqueSuits[1], uniqueSuits[0], uniqueSuits[2], uniqueSuits[3]
				# @sortedUniqueSuits.push uniqueSuits[3] if uniqueSuits.length is 4
		else
			@sortedUniqueSuits.push uniqueSuits[0], uniqueSuits[2], uniqueSuits[1], uniqueSuits[3]
			# @sortedUniqueSuits.push uniqueSuits[3] if uniqueSuits.length is 4

Hand::getAllowedSuit = (currentSuit) ->
	@allowedSuit = null
	if @table.appMode is 'moving'
		handSuits = (card.suit for card in @cards)
		uniqueHandSuits = handSuits.unique()
		if uniqueHandSuits.exists currentSuit
			@allowedSuit = currentSuit
		else
			if uniqueHandSuits.exists @table.deal.trump
				@allowedSuit = @table.deal.trump

Hand::setHovers = (currentSuit) ->
	if currentSuit and @table.appMode is 'moving'
		lastTrick = @table.deal.tricks[(@table.deal.tricks.length - 1)]
		if lastTrick.cards.length is 1
			@getAllowedSuit currentSuit # достатньо зробити один раз для руки після 1-го ходу
	for el in @handGroup
		unless (@allowedSuit and (el.data 'suit') isnt @allowedSuit)
			el.hover @hoverInCard, @hoverOutCard

Hand::unSetHovers = ->
	for el in @handGroup
		el.unhover @hoverInCard, @hoverOutCard

Hand::setDrags = ->
	# if @table.appMode is 'dealing'
	for el in @handGroup
		unless (@allowedSuit and (el.data 'suit') isnt @allowedSuit)
			el.drag @dragMoveCard, @dragStartCard, @dragEndCard

Hand::unSetDrags = ->
	for el in @handGroup
		el.undrag()

Hand::hoverInCard = ->
	@stop().animate transform: "#{@data 'currentTransform'}t0
	,#{-(@data 'hand').pack.cardHeight * .4}", 200, mina.elastic

Hand::hoverOutCard = ->
	@stop().animate transform: "#{@data 'currentTransform'}t0
	,0", 200, mina.backout

Hand::dragMoveCard = (dx, dy, x, y) ->
	hand = @data 'hand'
	if !hand.table.dragClone and (dx or dy)
		hand.table.dragClone = @clone()
		hand.table.mouseDownCard = null
		hand.table.snapArea.add hand.table.dragClone
		@attr visibility: 'hidden'
		if hand.table.appMode is 'dealing'
			for name, tableHand of hand.table.hands when tableHand isnt hand
					tableHand.fanFrame.attr visibility: 'visible'
	if hand.table.appMode is 'dealing'
		hand.table.dragClone?.transform "t\
		#{x - hand.table.pack.cardWidth / 2 }
		,#{y - hand.table.pack.cardHeight / 2 }\
		s#{hand.table.cardSizeRatio}"

Hand::dragStartCard = ->
	hand = @data 'hand'
	hand.table.mouseDownCard = @
	hand.table.cardRow?.unSetHovers()
	for name, tableHand of hand.table.hands
		tableHand.unSetHovers()

Hand::dragEndCard = (e) ->
	card = @
	hand = @data 'hand'
	unless hand.table.dragClone # handling "click"
		if @ is hand.table.mouseDownCard
			picked = hand.cards.splice (@data 'handIndex'), 1
			animClone = @clone()
			@remove()
			hand.table.snapArea.add animClone
			if hand.table.appMode is 'moving' # moving cards
				lastTrick = hand.table.deal.tricks[(hand.table.deal.tricks.length - 1)]
				currentTransform = @data 'currentTransform'
				animClone.transform "t#{e.pageX - hand.pack.cardWidth / 2}," +
				"#{e.pageY - hand.pack.cardHeight / 2}," +
				"s#{hand.table.cardSizeRatio}"
				trickX = hand.table.coords.center.x -
					lastTrick.shiftsRotations["#{hand.seat}"].shift.x
				trickY = hand.table.coords.north.y -
					lastTrick.shiftsRotations["#{hand.seat}"].shift.y
				animToCenter = "t#{trickX},#{trickY}" +
				"s#{hand.table.cardSizeRatio}" +
				"r#{lastTrick.shiftsRotations["#{hand.seat}"].rotation}"
				animClone.stop().animate transform: animToCenter, 300
				setTimeout (->
						animClone.remove()
						lastTrick.cards.push picked[0]
						lastTrick.renderTrick()
						hand.bindMovesToTrick lastTrick.cards[0].suit #??????? не остання, завжди перша
						hand.renderHand()
					), 310
			else # dealing cards
				animToRow = "t#{hand.table.coords.north.x},
					#{hand.table.coords.lowerRow.y}
					s#{hand.table.cardSizeRatio}" # а до цього було масштабування навколо 0,0
				animClone.stop().animate transform: animToRow, 180, mina.backout
				setTimeout (->
					animClone.remove()
					hand.table.cardRow.cards.push picked[0]
					hand.table.cardRow.renderCardRow()
					hand.renderHand()
					for name, tableHand of hand.table.hands
						tableHand.setHovers()
					hand.setDrags()
					), 200
	else # handling drag
		for name, tableHand of hand.table.hands when tableHand isnt hand
			if Snap.path.isPointInside tableHand.fanFramePath, e.pageX, e.pageY
				selectedHand = tableHand
				break
		if selectedHand # target exists
			picked = hand.cards.splice (@data 'handIndex'), 1
			picked[0].hand = selectedHand.seat
			selectedHand.cards.push picked[0]
			hand.table.dragClone.remove()
			hand.table.dragClone = null
			hand.table.cardRow?.setHovers()
			hand.renderHand()
			selectedHand.renderHand()
			for name, tableHand of hand.table.hands
				tableHand.fanFrame.attr visibility: 'hidden'
				tableHand.setHovers()
				tableHand.setDrags()
		else # no target
			if hand.table.dragClone
				hand.table.dragClone.stop()
				.animate transform: "#{@data 'currentTransform'}t0,0"
				, 400, mina.backout
				setTimeout (->
					hand.table.dragClone.remove()
					hand.table.dragClone = null
					card.transform "#{card.data 'currentTransform'}t0,0"
					card.attr visibility: 'visible'
					hand.table.mouseDownCard = null
					for name, tableHand of hand.table.hands
						tableHand.fanFrame.attr visibility: 'hidden'
						tableHand.setHovers()
					), 401

Hand::bindMovesToTrick = (currentSuit) ->
	self = @
	lastTrick = @table.deal.tricks[(@table.deal.tricks.length - 1)]
	switch lastTrick.cards.length
		# there's no need to unset hovers for the hands
		# that moves have been made from, e.g. for first
		# hand after its move since Hand.unSetHovers was
		# made for every hand on the table in Hand.dragStartCard;
		# another trick is not to forget to setHovers for the
		# third hand twice (the second time after the second's
		# hand move) for the same reason
		when 0
			@table.hands["#{lastTrick.hands[0]}"].setHovers()
			@table.hands["#{lastTrick.hands[0]}"].setDrags()
		when 1
			@table.hands["#{lastTrick.hands[1]}"].setHovers(currentSuit)
			@table.hands["#{lastTrick.hands[1]}"].setDrags()
			@table.hands["#{lastTrick.hands[2]}"].setHovers(currentSuit)
		when 2
			@table.hands["#{lastTrick.hands[1]}"].unSetDrags()
			@table.hands["#{lastTrick.hands[2]}"].setHovers()
			@table.hands["#{lastTrick.hands[2]}"].setDrags()
		when 3
			@table.hands["#{lastTrick.hands[2]}"].unSetDrags()
			winner = lastTrick.getWinnerCard().hand
			winnerHand = @table.hands["#{winner}"]
			winnerHand.allowedSuit = null
			cloneLastTrick = Object.create lastTrick
			winnerHand.tricks.push cloneLastTrick
			self.table.deal.firstHand = winnerHand.seat
			self.table.deal.tricks.push new Trick @table, @pack
			lastTrick.animateTrickToHand 1000, winnerHand
			setTimeout (->
				winnerHand.renderTricks()
				winnerHand.renderHand()
				winnerHand.bindMovesToTrick()
				), 1200

Hand::renderHand = ->
	# setting 'start' button active/inactive
	if @table.appMode is 'dealing'
		if @cards.length
			# compare hands' cards' number
			numbers = []
			for n, h of @table.hands
				numbers.push h.cards.length
			areTheSame = yes
			for el, i in numbers
				if numbers[i + 1] >= 0 # if next el exists
				# cannot use if numbers[i + 1] as cards num can be 0
				# which gives 'false'
					if el isnt numbers[i + 1]
						areTheSame = no
						break
			# if numbers.length is 3 and areTheSame # there always three playing hands
			if areTheSame
				@toolBar.buttons.start[0].attr fill: 'white'
				@toolBar.buttons.start.data 'isActive', yes
			else
				if @toolBar.buttons.start.data 'isActive'
					@toolBar.buttons.start[0].attr fill: '#444'
					@toolBar.buttons.start.data 'isActive', no
		else
			if @toolBar.buttons.start.data 'isActive'
				@toolBar.buttons.start[0].attr fill: '#444'
				@toolBar.buttons.start.data 'isActive', no

	if @cards.length
		for el in @handGroup
			el.remove()
		@handGroup = []
		self = @
		@cardRotations = []
		@getSortOrders()
		@cards.sort @pack.cardSorter @sortedUniqueSuits, @ranDirectionValues

		for card, i in @cards
			cardGroup = @table.snapArea.g()
			cardGroup
				.data 'packIndex', card.packIndex
				.data 'handIndex', i
				.data 'suit', card.suit
				.data 'value', card.value
				.data 'hand', self
				.add self.pack.cards[card.packIndex].pic.select('svg').clone()
			@handGroup.push cardGroup

		@handCardsCounter
			.transform "t#{@table.coords[@seat].sectorFanX}
			,#{@table.coords[@seat].sectorFanY - @table.cardHeight / 4 }"
			.attr text: @cards.length, 'font-size': @table.cardHeight / 4
			, visibility: 'visible'

		for el, i in @handGroup
			rotationAngle = self.shiftAngle * (i - @cards.length / 2 - .5)# - self.shiftAngle / 2
			cardRotation = "r#{rotationAngle}"
			@cardRotations.push rotationAngle
			el.transform "t0,0s1,0,0r0,0,0"
			el.data 'currentTransform', "t#{@table.coords[@seat].x}" +
			",#{@table.coords[@seat].y}s#{@table.cardSizeRatio},0,0"
			el.transform "#{el.data 'currentTransform'}"
			cardRotationCenter = ",#{@table.coords.rotX},#{@table.coords.rotY}"
			nextTransform = "#{el.data 'currentTransform'}#{cardRotation}" +
			"#{cardRotationCenter}"
			el.stop().animate transform: nextTransform, 500, mina.backout
			el.data 'currentTransform', nextTransform
	else
		@handCardsCounter.attr visibility: 'hidden'

module.exports = Hand