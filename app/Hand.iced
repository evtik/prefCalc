class Hand
	constructor: (@table, @pack, @cards, @centerX, @centerY, @seat, @isBlind, @isWidow) ->
		@renderHand @pack, yes

Hand::sortHand = ->
	# sorts hand cards

Hand::renderHand = (@pack, isInitial) ->
	self = @
	if isInitial
		@cardRotations = []
		@handGroup = @table.g()

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

module.exports = Hand

