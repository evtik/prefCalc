require './array-utils'

class Hand
	constructor: (@table, @pack, @seat, @appMode, @cards, @isBlind, @isWidow) ->

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

Hand::bindClicks = (hand) -> ->
	picked = hand.cards.splice (@data 'handIndex'), 1
	animClone = @clone()
	@remove()
	hand.table.snapArea.add animClone
	animToRow = "t#{hand.table.coords.north.x},
		#{hand.table.coords.lowerRow.y}
		s#{hand.table.cardSizeRatio},0,0"
	animClone.stop().animate transform: animToRow, 180, mina.backout
	setTimeout (->
		animClone.remove()
		hand.table.cardRow.cards.push picked[0]
		hand.table.cardRow.renderCardRow()
		hand.renderHand()
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
				.add self.pack.cards[card.packIndex].pic.select('svg').clone()
				.add upperRect
				.hover( (->
									@stop().animate transform: "#{@data 'currentTransform'}
										t0,#{-self.pack.cardHeight * .4}", 200, mina.elastic
								),
								(->
									@stop().animate transform: "#{@data 'currentTransform'}
										t0,0", 200, mina.backout
								)
							)
				.click @bindClicks self
					# console.log self.appMode
					# picked = self.cards.splice (@data 'handIndex'), 1
					# animClone = @clone()
					# @remove()
					# self.table.snapArea.add animClone
					# animToRow = "t#{self.table.coords.north.x},
					# 	#{self.table.coords.lowerRow.y}
					# 	s#{self.table.cardSizeRatio},0,0"
					# animClone.stop().animate transform: animToRow, 180, mina.backout
					# setTimeout (->
					# 	animClone.remove()
					# 	self.table.cardRow.cards.push picked[0]
					# 	self.table.cardRow.renderCardRow()
					# 	self.renderHand()
					# 	), 200


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

