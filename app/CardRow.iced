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
					# aninClone - це копія карти, яка видаляється із ряду,
					# для симуляція руху по столу від ряду до руки
					animClone = @.clone()
					animClone.transform @transform().string
					@.remove()
					self.table.snapArea.add animClone
					animToHand = "t#{self.table.coords.north.x},
						#{self.table.coords.north.y}
						s#{self.table.cardSizeRatio},0,0"
					animClone.stop().animate transform: animToHand, 300, mina.backout
					setTimeout (->
						animClone.remove()
						self.table.handNorth.cards.push picked[0]
						self.table.handNorth.renderHand()
						self.renderCardRow()
						), 200


			@cardRowGroup.add cardGroup

		for i, el of @cardRowGroup when not Number.isNaN +i
			# наступні 2 рядки не можу винести у клас Table
			# всередині цього класу чомусь немає доступу
			# до зовні доданих нових властивостей
			cardSpacingX = ((@table.width - @table.cardWidth) / (@cards.length + 1)) / @table.cardSizeRatio
			cardSpacingY = @table.height - @table.cardHeight * 1.175
			shift = cardSpacingX * i
			@cardShifts.push shift
			el.data 'currentTransform', "t#{cardSpacingX *
				@table.cardSizeRatio}
				,#{cardSpacingY}
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