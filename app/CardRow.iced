class CardRow
	constructor: (@table, @pack) ->
		@renderCardRow yes

CardRow::renderCardRow = (isInitial) ->
	console.log 'renderCardRow'
	self = @
	shiftX = @table.cardWidth / 5
	if isInitial
		@cardShifts = []
		@cardRowGroup = @table.snapArea.g()
		for card, i in @pack.cards
			upperRect = @table.snapArea
			.rect 0, 0, @pack.cardWidth, @pack.cardHeight, 10, 10
			.attr fill: 'transparent', strokeWidth: 0, opacity: 0.5
			cardGroup = @cardRowGroup.g()
			cardGroup
				.add @pack.cards[i].pic
				.add upperRect
				.hover( (->
									@stop().animate transform: "#{@data 'currentTransform'}t0,#{-self.pack.cardHeight * .4}", 200, mina.elastic
								),
								(->
									@stop().animate transform: "#{@data 'currentTransform'}t0,0", 200, mina.backout
								)
							)

			@cardRowGroup.add cardGroup

	for i, el of @cardRowGroup when not Number.isNaN +i
		shift = shiftX * i
		@cardShifts.push shift
		el.data 'currentTransform', "t#{@table.coords.lowerRow.x},#{@table.coords.lowerRow.y}s#{@table.cardSizeRatio},0,0"
		el.transform el.data 'currentTransform'
		nextTransform = "#{el.data 'currentTransform'}t#{shift}"
		el.stop().animate transform: nextTransform, 500, mina.backout
		el.data 'currentTransform', nextTransform



module.exports = CardRow