require './array-utils'

class Hand
	constructor: (@table, @pack, @seat, @cards, @isBlind, @isWidow) ->

		# випадкове сортування за зростанням або убуванням
		# номіналу карти на період "життя" руки
		# до цього було у @getSortOrders() тепер там тільки
		# сортування за мастями
		if Math.floor Math.random() * 2
			arr = @pack.sortValues.slice()
			@ranDirectionValues = arr.reverse()
		else
			@ranDirectionValues = @pack.sortValues

		@cards = []
		@handGroup = @table.snapArea.g()
		@renderHand()

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

Hand::bindCardHoverIn = (el, hand) ->
	el.stop().animate transform: "#{el.data 'currentTransform'}
		t0,#{-hand.pack.cardHeight * .4}", 200, mina.elastic

Hand::bindCardHoverOut = (el) ->
	el.stop().animate transform: "#{el.data 'currentTransform'}
		t0,0", 200, mina.backout

Hand::bindCardClickToTrick = (el, hand) ->
	picked = hand.cards.splice (el.data 'handIndex'), 1
	animClone = el.clone()
	el.remove()
	hand.table.snapArea.add animClone
	animToCenter = "t#{hand.table.coords.center.x},
		#{hand.table.coords.center.y}
		s#{hand.table.cardSizeRatio}"
	animClone.stop().animate transform: animToCenter, 180, mina.backout
	# setTimeout (->

	# 		hand.table.deal.tricks[hand.table.deal.tricks.length - 1].cards.push picked[0]
	# 		animClone.remove() # видаляти лише в цьому випадку
	# 	), 200

Hand::bindCardClickToCardRow = (el, hand) ->
	picked = hand.cards.splice (el.data 'handIndex'), 1
	animClone = el.clone()
	el.remove()
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

Hand::bindHandCardsClicksToTrick = (currentSuit) ->
	allowedSuit = null
	handSuits = (card.suit for card in @cards)
	uniqueHandSuits = handSuits.unique()
	if uniqueHandSuits.exists currentSuit
		allowedSuit = currentSuit
	else
		if uniqueHandSuits.exists @table.deal.trump
			allowedSuit = @table.deal.trump

	self = @
	for i, el of @handGroup when not Number.isNaN +i
		if not allowedSuit? or el.data 'suit' is allowedSuit
			el.click @bindCardClickToTrick el, self

Hand::unbindHandCardsClicksToTrick = ->
	self = @
	for i, el of @handGroup when not Number.isNaN +i
		el.unclick @bindCardClickToTrick el, self

Hand::bindHandCardsClicksToCardRow = ->
	self = @
	for i, el of @handGroup when not Number.isNaN +i
		el.click @bindCardClickToCardRow el, self
	null

Hand::unbindHandCardsClicksToCardRow = ->
	sefl = @
	# console.log "unbindHandCardsClicksToCardRow"
	for i, el of @handGroup when not Number.isNaN +i
		el.unclick @bindCardClickToCardRow el, self
	null

Hand::bindHandCardsHovers = (currentSuit) ->
	self = @
	for i, el of @handGroup when not Number.isNaN +i
		el.hover (@bindCardHoverIn el, self), (@bindCardHoverOut el)

Hand::unbindHandCardsHovers = ->
	self = @
	console.log "unbindHandCardsHovers"
	for i, el of @handGroup when not Number.isNaN +i
		el.unhover (@bindCardHoverIn el, self), (@bindCardHoverOut el)
	null

Hand::bindMovesToTrick = (currentSuit) ->
	lastTrick = @table.deal.tricks[(@table.deal.tricks.length - 1)]
	switch lastTrick.cards.length
		when 0
			# @table["hand_#{lastTrick.hands[1]}"].unbindHandCardsHovers()
			# @table["hand_#{lastTrick.hands[1]}"].unbindHandCardsClicksToTrick()
			# @table["hand_#{lastTrick.hands[2]}"].unbindHandCardsHovers()
			# @table["hand_#{lastTrick.hands[2]}"].unbindHandCardsClicksToTrick()
			@table["hand_#{lastTrick.hands[0]}"].bindHandCardsHovers()
			@table["hand_#{lastTrick.hands[0]}"].bindHandCardsClicksToTrick()
		when 1
			@table["hand_#{lastTrick.hands[0]}"].unbindHandCardsHovers()
			@table["hand_#{lastTrick.hands[0]}"].unbindHandCardsClicksToTrick()
			@table["hand_#{lastTrick.hands[1]}"].bindHandCardsHovers()
			@table["hand_#{lastTrick.hands[1]}"].bindHandCardsClicksToTrick()
			@table["hand_#{lastTrick.hands[2]}"].bindHandCardsHovers()
		when 2
			@table["hand_#{lastTrick.hands[1]}"].unbindHandCardsHovers()
			@table["hand_#{lastTrick.hands[1]}"].unbindHandCardsClicksToTrick()
			@table["hand_#{lastTrick.hands[2]}"].bindHandCardsClicksToTrick()
		when 3
			@table["hand_#{lastTrick.hands[2]}"].unbindHandCardsHovers()
			@table["hand_#{lastTrick.hands[2]}"].unbindHandCardsClicksToTrick()
			lastTrick.winnerHand = lastTrick.getWinnerHand()
			@table.deal.tricks.push new Trick @table, @pack
			@table.deal.firstHand = lastTrick.winnerHand
			@bindMovesToTrick()

Hand::bindMovesToCardRow = ->
	self = @
	console.log self
	for i, el of @handGroup when not Number.isNaN +i
		el.click @bindCardClickToCardRow(el, self)
		# el.click ->
		# 	picked = self.cards.splice (@data 'handIndex'), 1
		# 	animClone = @clone()
		# 	@remove()
		# 	self.table.snapArea.add animClone

		# 	animToRow = "t#{self.table.coords.north.x},
		# 		#{self.table.coords.lowerRow.y}
		# 		s#{self.table.cardSizeRatio}" # а до цього було масштабування навколо 0,0
		# 	animClone.stop().animate transform: animToRow, 180, mina.backout
		# 	setTimeout (->
		# 		animClone.remove()
		# 		self.table.cardRow.cards.push picked[0]
		# 		self.table.cardRow.renderCardRow()
		# 		self.renderHand()
		# 		self.bindMovesToCardRow()
		# 		), 200

Hand::renderHand = ->
	if @cards.length
		@handGroup.clear()
		self = @
		angle = 12
		@cardRotations = []
		do @getSortOrders
		@cards.sort @pack.cardSorter @sortedUniqueSuits, @ranDirectionValues

		for card, i in @cards
			upperRect = @table.snapArea
				.rect 0, 0, @pack.cardWidth, @pack.cardHeight, 10, 10
				.attr fill: 'transparent', strokeWidth: 0, opacity: 0.5
			cardGroup = @table.snapArea.g()
			cardGroup
				.data 'handIndex', i
				.add self.pack.cards[card.packIndex].pic.select('svg').clone()
				.add upperRect
			@handGroup.add cardGroup

		for i, el of @handGroup when not Number.isNaN +i
			rotationAngle = angle * (i - @cards.length / 2 + .5)
			cardRotation = "r#{rotationAngle}"
			@cardRotations.push rotationAngle
			el.data 'currentTransform', "t#{@table.coords[@seat].x}
				,#{@table.coords[@seat].y}s#{@table.cardSizeRatio},0,0"
			el.transform el.data 'currentTransform'
			cardRotationCenter = ",#{@table.coords.rotX},#{@table.coords.rotY}"
			nextTransform = "#{el.data 'currentTransform'}#{cardRotation}
				#{cardRotationCenter}"
			el.stop().animate transform: nextTransform, 500, mina.backout
			el.data 'currentTransform', nextTransform

module.exports = Hand

