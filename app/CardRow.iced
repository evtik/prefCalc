cardSorter = require './card-sorter'

class CardRow
	constructor: (@table, @pack) ->
		@pack.cards.sort cardSorter ['s', 'd', 'c', 'h']
		@cards = (suit: card.suit, value: card.value, packIndex: i for card, i in @pack.cards)
		@cardRowGroup = @table.snapArea.g()
		@renderCardRow()

CardRow::renderCardRow = ->
	if @cards.length
		@cardRowGroup.clear()
		self = @
		@cardShifts = []
		for card, i in @cards
			upperRect = @table.snapArea
				.rect 0, 0, @pack.cardWidth, @pack.cardHeight, 10, 10
				.attr fill: 'transparent', strokeWidth: 0, opacity: 0.5
			cardGroup = @table.snapArea.g()
			cardGroup
				.data 'packIndex', card.packIndex
				.data 'rowIndex', i
				.add self.pack.cards[card.packIndex].pic.select('svg').clone()
				.add upperRect
				.click ->
					picked = self.cards.splice (@data 'rowIndex'), 1
					self.table.handNorth.cards.push picked[0]
					self.table.handNorth.renderHand()
					self.renderCardRow()
			@cardRowGroup.add cardGroup

		for i, el of @cardRowGroup when not Number.isNaN +i
			shift = @table.coords.lowerRow.x * i
			@cardShifts.push shift
			el.data 'currentTransform', "t#{@table.coords.lowerRow.x *
				@table.cardSizeRatio}
				,#{@table.coords.lowerRow.y}
				s#{@table.cardSizeRatio},0,0"
			el.transform el.data 'currentTransform'
			nextTransform = "#{el.data 'currentTransform'}t#{shift},0"
			el.stop().animate transform: nextTransform, 500, mina.backout
			el.data 'currentTransform', nextTransform
			el.hover( (->
									@stop().animate transform: "#{@data 'currentTransform'}
										t0,#{-self.pack.cardHeight * .4}", 200, mina.elastic
								),
								(->
									@stop().animate transform: "#{@data 'currentTransform'}
										t0,0", 200, mina.backout
								)
							)

module.exports = CardRow