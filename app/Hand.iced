require './Array_utils'

class Hand
	constructor: (@table, @pack, @cards, @seat, @isBlind, @isWidow) ->
		@sortValues = ['7', '8', '9', '10', 'j', 'q', 'k', 'a']
		do @getSortOrders
		@renderHand yes

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

	if Math.floor Math.random() * 2
		arr = @sortValues.slice()
		@ranDirectionValues = arr.reverse()
	else
		@ranDirectionValues = @sortValues

Hand::sortHand = (sortSuits, sortValues) ->
	(current, next) ->
		if sortSuits.indexOf(current.suit) < sortSuits.indexOf(next.suit)
			return -1
		if sortSuits.indexOf(current.suit) > sortSuits.indexOf(next.suit)
			return 1
		if sortValues.indexOf(current.value) < sortValues.indexOf(next.value)
			return 1
		if sortValues.indexOf(current.value) > sortValues.indexOf(next.value)
			return -1

Hand::renderHand = (isInitial) ->
	self = @
	angle = 15

	if isInitial
		@cardRotations = []
		@handGroup = @table.snapArea.g()
		@cards.sort @sortHand @sortedUniqueSuits, @ranDirectionValues

		for card, i in @cards
			upperRect = @table.snapArea
			.rect 0, 0, @pack.cardWidth, @pack.cardHeight
			.attr fill: 'transparent', strokeWidth: 0, opacity: 0.1

			cardGroup = @handGroup.g()
			cardGroup
				.data 'currentTransform', "s#{@table.cardSizeRatio}t#{@table.coords[@seat].x},#{@table.coords[@seat].y}"
				.transform cardGroup.data 'currentTransform'
				.add @cards[i].pic
				.add upperRect
				.hover( (->
									@stop().animate transform: "#{@data 'currentTransform'}t0,#{-self.table.cardHeight/2}", 200, mina.elastic
								),
								(->
									@stop().animate transform: "#{@data 'currentTransform'}t0,0", 200, mina.backout
								)
							)

			@handGroup.add cardGroup

	for i, el of @handGroup when not Number.isNaN +i
		rotationAngle = angle * (i - @cards.length / 2 + .5)
		cardRotation = "r#{rotationAngle}"
		@cardRotations.push rotationAngle
		cardRotationCenter = ",#{@table.coords[@seat].rotX},#{@table.coords[@seat].rotY}"
		nextTransform = "s#{@table.cardSizeRatio}#{el.data 'currentTransform'}#{cardRotation}#{cardRotationCenter}"
		el.stop().animate transform: nextTransform, 500, mina.backout
		el.data 'currentTransform', nextTransform

module.exports = Hand

