cardSorter = require './card-sorter'

class CardRow
	constructor: (@table, @pack) ->
		@pack.cards.sort cardSorter ['s', 'd', 'c', 'h']
		@renderCardRow yes

CardRow::renderCardRow = (isInitial) ->
	self = @
	# shiftX = @table.cardWidth / 5
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
									@stop().animate transform: "#{@data 'currentTransform'}
										t0,#{-self.pack.cardHeight * .4}", 200, mina.elastic
								),
								(->
									@stop().animate transform: "#{@data 'currentTransform'}
										t0,0", 200, mina.backout
								)
							)

			@cardRowGroup.add cardGroup

	for i, el of @cardRowGroup when not Number.isNaN +i
		shift = @table.coords.lowerRow.x * i
		# shift = @table.cardWidth / 5 * i
		# shift =
		@cardShifts.push shift
		el.data 'currentTransform', "t#{@table.coords.lowerRow.x *
			@table.cardSizeRatio}
			,#{@table.coords.lowerRow.y}
			s#{@table.cardSizeRatio},0,0"
		el.transform el.data 'currentTransform'
		nextTransform = "#{el.data 'currentTransform'}t#{shift},0"
		el.stop().animate transform: nextTransform, 500, mina.backout
		el.data 'currentTransform', nextTransform



module.exports = CardRow