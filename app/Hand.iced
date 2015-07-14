require './array-utils'
$ = require 'jquery'
Trick = require './Trick'

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

Hand::getAllowedSuit = (currentSuit) ->
	console.log 'getAllowedSuit fired!'
	console.log @table.deal.tricks[(@table.deal.tricks.length - 1)]
	# console.log @seat
	@allowedSuit = null
	# console.log "поточна масть #{currentSuit}" if currentSuit?
	# console.log "козир #{@table.deal.trump}" if @table.deal?.trump?
	if @table.appMode is 'moving'
		handSuits = (card.suit for card in @cards)
		# console.log "масті руки #{handSuits}"
		uniqueHandSuits = handSuits.unique()
		# console.log "унікальні #{uniqueHandSuits}"
		# console.log "масть існує #{uniqueHandSuits.exists currentSuit}"
		if uniqueHandSuits.exists currentSuit
			@allowedSuit = currentSuit
		else
			# console.log "рука має козир #{uniqueHandSuits.exists @table.deal.trump}"
			if uniqueHandSuits.exists @table.deal.trump
				@allowedSuit = @table.deal.trump
	# console.log "дозволена масть #{@allowedSuit}"

Hand::bindHandCardsClicksToTrick = (currentSuit) ->
	self = @
	lastTrick = @table.deal.tricks[(self.table.deal.tricks.length - 1)]
	# @getAllowedSuit currentSuit if lastTrick.cards.length is 1 # вже відомо після bindHandCardsHovers()
	# console.log "кліки для руки #{@seat} масть ходу #{currentSuit}
		# дозволена масть #{@allowedSuit}"
	for i, el of @handGroup when not Number.isNaN +i
		do (el) ->
			unless (self.allowedSuit and (el.data 'suit') isnt self.allowedSuit)
			# if (self.allowedSuit and (el.data 'suit') is self.allowedSuit) or
			# not self.allowedSuit
			# if not self.allowedSuit or el.data 'suit' is self.allowedSuit
				$(el.node).on 'click', ->
					picked = self.cards.splice (el.data 'handIndex'), 1
					animClone = el.clone()
					el.remove()
					self.table.snapArea.add animClone
					animToCenter = "t#{self.table.coords.center.x},
						#{self.table.coords.center.y}
						s#{self.table.cardSizeRatio}"
					animClone.stop().animate transform: animToCenter, 180, mina.backout
					setTimeout (->
							animClone.remove()
							lastTrick.cards.push picked[0]
							self.renderHand()
							self.bindMovesToTrick lastTrick.cards[0].suit #??????? не остання, завжди перша
							# animClone.remove() # видаляти лише в цьому випадку
						), 200

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
	for i, el of @handGroup when not Number.isNaN +i
		do (el) ->
			$(el.node).off 'click'

Hand::bindHandCardsHovers = (currentSuit) ->
	self = @
	if @table.appMode is 'moving'
		lastTrick = @table.deal.tricks[(self.table.deal.tricks.length - 1)]
		if lastTrick.cards.length is 1# and @seat is lastTrick.hands[1]
			@getAllowedSuit currentSuit # достатньо зробити один раз для руки після 1-го ходу
	# console.log "ховери для руки #{@seat} масть ходу #{currentSuit}
		# дозволена масть #{@allowedSuit}"
	for i, el of @handGroup when not Number.isNaN +i
		do (el) ->
			# console.log "масть карти #{el.data 'suit'}
				# {unless (el.data 'suit') is self.allowedSuit then "не "}
				# співпадає з дозволеною мастю #{self.allowedSuit}"
			unless (self.allowedSuit and (el.data 'suit') isnt self.allowedSuit)
			# if (self.allowedSuit and (el.data 'suit') is self.allowedSuit) or
			# not self.allowedSuit
			# if el.data 'suit' is self.allowedSuit or not self.allowedSuit
				# console.log 'came here!' if self.table.appMode is 'moving'
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
			console.log "порожня взятка"
			@table["hand_#{lastTrick.hands[0]}"].bindHandCardsHovers()
			@table["hand_#{lastTrick.hands[0]}"].bindHandCardsClicksToTrick()
		when 1
			console.log "у взятці одна карта"
			@table["hand_#{lastTrick.hands[0]}"].unbindHandCardsHovers()
			@table["hand_#{lastTrick.hands[0]}"].unbindHandCardsClicksToTrick()
			@table["hand_#{lastTrick.hands[1]}"].bindHandCardsHovers(currentSuit)
			@table["hand_#{lastTrick.hands[1]}"].bindHandCardsClicksToTrick(currentSuit)
			@table["hand_#{lastTrick.hands[2]}"].bindHandCardsHovers(currentSuit)
		when 2
			console.log "у взятці дві карти"
			@table["hand_#{lastTrick.hands[1]}"].unbindHandCardsHovers()
			@table["hand_#{lastTrick.hands[1]}"].unbindHandCardsClicksToTrick()
			@table["hand_#{lastTrick.hands[2]}"].bindHandCardsClicksToTrick(currentSuit)
		when 3
			console.log "у взятці три карти"
			@table["hand_#{lastTrick.hands[2]}"].unbindHandCardsHovers()
			@table["hand_#{lastTrick.hands[2]}"].unbindHandCardsClicksToTrick()
			lastTrick.winnerHand = lastTrick.getWinnerHand()
			@table.deal.tricks.push new Trick @table, @pack
			@table.deal.firstHand = lastTrick.winnerHand
			@bindMovesToTrick()

Hand::bindMovesToCardRow = ->
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
				.data 'suit', card.suit
				.data 'value', card.value
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

