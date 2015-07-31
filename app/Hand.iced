require './array-utils'
utils = require './utils'
$ = require 'jquery'
Trick = require './Trick'

class Hand
	constructor: (@table, @pack, @seat, @cards, @isBlind, @isWidow) ->
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

		@getFanFramePath()
		@grad = @table.snapArea.gradient "r(.5,.5,.95)#00f-#fff"
		@blurFilter = @table.snapArea.filter Snap.filter.blur 2, 2
		@fanFrame = @table.snapArea.path ""
		@fanFrame.attr strokeWidth: 2, stroke: 'yellow'
		, filter: @blurFilter, opacity: .3, fill: 'transparent'
		@cards = []
		@handGroup = []
		@renderHand()

Hand::getFanFramePath = ->
	values = @table.coords["#{@seat}"]
	@fanFramePath = utils.describeSector values.sectorFanX, values.sectorFanY
		, @table.coords.fanInnerR, @table.coords.fanOuterR
		, -@shiftAngle * 3.8, @shiftAngle * 3.8

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

Hand::bindHandCardsClicksToTrick = (currentSuit) ->
	self = @
	lastTrick = @table.deal.tricks[(self.table.deal.tricks.length - 1)]
	for i, el of @handGroup when not Number.isNaN +i
		do (el) ->
			unless (self.allowedSuit and (el.data 'suit') isnt self.allowedSuit)
				$(el.node).on 'click', (e) ->
					picked = self.cards.splice (el.data 'handIndex'), 1
					currentTransform = el.data 'currentTransform'
					animClone = el.clone()
					self.table.snapArea.add animClone
					animClone.transform "t#{e.pageX - self.pack.cardWidth / 2}," +
					"#{e.pageY - self.pack.cardHeight / 2}," +
					"s#{self.table.cardSizeRatio}"
					el.remove()
					trickX = self.table.coords.center.x -
						lastTrick.shiftsRotations["#{self.seat}"].shift.x
					trickY = self.table.coords.north.y -
						lastTrick.shiftsRotations["#{self.seat}"].shift.y
					animToCenter = "t#{trickX},#{trickY}" +
					"s#{self.table.cardSizeRatio}" +
					"r#{lastTrick.shiftsRotations["#{self.seat}"].rotation}"
					animClone.stop().animate transform: animToCenter, 300
					setTimeout (->
							# animClone.remove()
							lastTrick.cards.push picked[0]
							self.renderHand()
							self.bindMovesToTrick lastTrick.cards[0].suit #??????? не остання, завжди перша
							# animClone.remove() # видаляти лише в цьому випадку
						), 301

Hand::unbindHandCardsClicksToTrick = ->
	for i, el of @handGroup when not Number.isNaN +i
		do (el) ->
			$(el.node).off 'click'

Hand::bindHandCardsClicksToCardRow = ->
	self = @
	for i, el of @handGroup when not Number.isNaN +i
		do (el) ->
			$(el.node).on 'click', ->
				picked = self.cards.splice (el.data 'handIndex'), 1
				animClone = el.clone()
				el.remove()
				self.table.snapArea.add animClone

				animToRow = "t#{self.table.coords.north.x},
					#{self.table.coords.lowerRow.y}
					s#{self.table.cardSizeRatio}" # а до цього було масштабування навколо 0,0
				animClone.stop().animate transform: animToRow, 180, mina.backout
				setTimeout (->
					animClone.remove()
					self.table.cardRow.cards.push picked[0]
					self.table.cardRow.renderCardRow()
					self.renderHand()
					self.bindMovesToCardRow()
					), 200

Hand::unbindHandCardsClicksToCardRow = ->
	# for i, el of @handGroup when not Number.isNaN +i
	# 	do (el) ->
	# 		$(el.node).off 'click'


Hand::bindHandCardsHovers = (currentSuit) ->
	self = @
	if @table.appMode is 'moving'
		lastTrick = @table.deal.tricks[(self.table.deal.tricks.length - 1)]
		if lastTrick.cards.length is 1# and @seat is lastTrick.hands[1]
			@getAllowedSuit currentSuit # достатньо зробити один раз для руки після 1-го ходу
	for i, el of @handGroup when not Number.isNaN +i
		do (el) ->
			unless (self.allowedSuit and (el.data 'suit') isnt self.allowedSuit)
				$(el.node).on 'mouseenter', ->
						el.stop().animate transform: "#{el.data 'currentTransform'}
							t0,#{-self.pack.cardHeight * .4}", 200, mina.elastic
				$(el.node).on 'mouseleave', ->
						el.stop().animate transform: "#{el.data 'currentTransform'}
							t0,0", 200, mina.backout

Hand::unbindHandCardsHovers = ->
	for i, el of @handGroup when not Number.isNaN +i
		do (el) ->
			$(el.node).off 'mouseenter'
			$(el.node).off 'mouseleave'

Hand::bindMovesToTrick = (currentSuit) ->
	lastTrick = @table.deal.tricks[(@table.deal.tricks.length - 1)]
	switch lastTrick.cards.length
		when 0
			@table["hand_#{lastTrick.hands[0]}"].bindHandCardsHovers()
			@table["hand_#{lastTrick.hands[0]}"].bindHandCardsClicksToTrick()
		when 1
			@table["hand_#{lastTrick.hands[0]}"].unbindHandCardsHovers()
			@table["hand_#{lastTrick.hands[0]}"].unbindHandCardsClicksToTrick()
			@table["hand_#{lastTrick.hands[1]}"].bindHandCardsHovers(currentSuit)
			@table["hand_#{lastTrick.hands[1]}"].bindHandCardsClicksToTrick(currentSuit)
			@table["hand_#{lastTrick.hands[2]}"].bindHandCardsHovers(currentSuit)
		when 2
			@table["hand_#{lastTrick.hands[1]}"].unbindHandCardsHovers()
			@table["hand_#{lastTrick.hands[1]}"].unbindHandCardsClicksToTrick()
			@table["hand_#{lastTrick.hands[2]}"].bindHandCardsClicksToTrick(currentSuit)
		when 3
			@table["hand_#{lastTrick.hands[2]}"].unbindHandCardsHovers()
			@table["hand_#{lastTrick.hands[2]}"].unbindHandCardsClicksToTrick()
			winner = lastTrick.getWinnerHand().hand
			winnerHand = @table["hand_#{winner}"]
			winnerHand.allowedSuit = null
			@table.deal.firstHand = winnerHand.seat
			@table.deal.tricks.push new Trick @table, @pack
			winnerHand.bindMovesToTrick()

Hand::bindMovesToCardRow = ->
	console.log "3..." + @
	for el, i in @handGroup
		console.log "4...#{@}"
		el.click @clickCardToRow @ # оце жерсть! :-)

Hand::unBindMovesToCardRow = ->
	console.log "1...#{@}"
	for el, i in @handGroup
		console.log "2...#{@}"
		el.unclick @clickCardToRow @

Hand::clickCardToRow = (hand) ->
	->
		console.log "5...#{@}"
		picked = hand.cards.splice (@data 'handIndex'), 1
		animClone = @clone()
		@remove()
		hand.table.snapArea.add animClone

		animToRow = "t#{hand.table.coords.north.x},
			#{hand.table.coords.lowerRow.y}
			s#{hand.table.cardSizeRatio}" # а до цього було масштабування навколо 0,0
		animClone.stop().animate transform: animToRow, 180, mina.backout
		setTimeout (->
			animClone.remove()
			hand.table.cardRow.cards.push picked[0]
			hand.table.cardRow.renderCardRow()
			hand.renderHand()
			hand.bindMovesToCardRow()
			), 200

Hand::renderHand = ->
	@getFanFramePath() # має сенс тільки після рісайзу :-( ще подумати
	@fanFrame.attr d: @fanFramePath
	if @cards.length
		for el, i in @handGroup
			el.remove()
		@handGroup = []
		self = @
		@cardRotations = []
		do @getSortOrders
		@cards.sort @pack.cardSorter @sortedUniqueSuits, @ranDirectionValues

		for card, i in @cards
			cardGroup = @table.snapArea.g()
			cardGroup
				.data 'packIndex', card.packIndex
				.data 'handIndex', i
				.data 'suit', card.suit
				.data 'value', card.value
				.add self.pack.cards[card.packIndex].pic.select('svg').clone()
			@handGroup.push cardGroup

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

module.exports = Hand

