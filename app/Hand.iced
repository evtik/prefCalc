class Hand
	constructor: (@table, @pack, @cards, @centerX, @centerY, @seat, @isBlind, @isWidow) ->
		@renderHand @pack, yes

Hand::sortHand = (current,next) ->
	# sorts hand cards
	sortSuits = ['s', 'd', 'c', 'h']
	sortValues = ['7', '8', '9', '10', 'j', 'q', 'k', 'a']
	if sortSuits.indexOf(current.suit) < sortSuits.indexOf(next.suit)
		return -1
	if sortSuits.indexOf(current.suit) > sortSuits.indexOf(next.suit)
		return 1
	if sortValues.indexOf(current.value) < sortValues.indexOf(next.value)
		return 1
	if sortValues.indexOf(current.value) > sortValues.indexOf(next.value)
		return -1

Hand::renderHand = (@pack, isInitial) ->
	self = @
	angle = 15

	if isInitial
		@cardRotations = []
		@handGroup = @table.g()
		@cards.sort @sortHand

		upperRect = @table
			.rect 0, 0, @pack.cardWidth, @pack.cardHeight
			.attr fill: 'transparent', strokeWidth: 0

		for card, i in @cards
			cardGroup = @handGroup.g()
			cardGroup
				.data 'currentTransform', "t#{@centerX},#{@centerY}"
				.transform cardGroup.data 'currentTransform'
				.add @cards[i].pic
				.add upperRect
				.hover( (->
									@stop().animate transform: "#{@data 'currentTransform'}t0,#{-self.pack.cardHeight/2}", 200, mina.elastic
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
		cardRotationCenter = ",#{@pack.cardWidth * .25},#{@pack.cardHeight}"
		nextTransform = "#{el.data 'currentTransform'}#{cardRotation}#{cardRotationCenter}"
		el.stop().animate transform: nextTransform, 2000, mina.elastic
		el.data 'currentTransform', nextTransform

module.exports = Hand

