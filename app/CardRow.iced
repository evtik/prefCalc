class CardRow
	constructor: (@table, @pack) ->
		@pack.cards.sort @pack.cardSorter ['s', 'd', 'c', 'h']
		@cards = (suit: card.suit, value: card.value, packIndex: i for card, i in @pack.cards)
		@cardRowGroup = []
		@renderCardRow()

CardRow::setHovers = ->
	for el in @cardRowGroup
		el.hover @hoverInCard, @hoverOutCard

CardRow::unSetHovers = ->
	for el in @cardRowGroup
		el.unhover @hoverInCard, @hoverOutCard

CardRow::renderCardRow = ->
	if @cards.length
		for el, i in @cardRowGroup
			el.remove()
		@cardRowGroup = []
		self = @
		@cardShifts = []
		@cards.sort @pack.cardSorter ['s', 'd', 'c', 'h']
		for card, i in @cards
			cardGroup = @table.snapArea.g()
			cardGroup
				.data 'packIndex', card.packIndex
				.data 'rowIndex', i
				.data 'cardRow', self
				.add self.pack.cards[card.packIndex].pic.select('svg').clone()
				# .mouseup @mouseUpCard
				.drag @dragMoveCard, @dragStartCard, @dragEndCard
				.hover @hoverInCard, @hoverOutCard

			@cardRowGroup.push cardGroup

		# for i, el of @cardRowGroup when not Number.isNaN +i
		for el, i in @cardRowGroup
			# наступні 2 рядки не можу винести у клас Table
			# всередині цього класу чомусь немає доступу
			# до зовні доданих нових властивостей
			cardSpacingX = ((@table.width - @table.cardWidth) / (@cards.length + 1)) / @table.cardSizeRatio
			cardSpacingY = @table.cardHeight * .5
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

CardRow::hoverInCard = ->
	@stop().animate transform: "#{@data 'currentTransform'}t0
	,#{-(@data 'cardRow').pack.cardHeight * .4}", 200, mina.elastic

CardRow::hoverOutCard = ->
	@stop().animate transform: "#{@data 'currentTransform'}t0
	,0", 200, mina.backout

CardRow::dragMoveCard = (dx, dy, x, y) ->
	cardRow = @data 'cardRow'
	# для одночасної роботи і click'у і drag'у довелося
	# використати подію mouseup замість click, бо одразу
	# після натискання миші на елементі не є зрозумілим,
	# чи це буде клік, чи це початок дрегу.
	# ОНОВЛЕНО: навіть mouseup не годиться, т.я. все одно
	# стартують події і дрегу і кліку кожного разу при
	# натисканні кнопки миші. Вирішив використати обро-
	# блювачі тільки для дрегу. Алгоритм такий:
	# після натискання кнопки миші одразу отримуємо еле-
	# мент - mouseDownCard;
	# якщо після натискання і до відпускання кнопки миші
	# змінилося dx або dy - значить це дрег, mouseDownCard
	# одразу видаляється, клон для дрегу створюється
	# за причини неможливості змінити z-індекс елемента при
	# перетягуванні, тобто карта рухається "за" іншими,
	# пізніше доданими, а також за картами рук, що, по-перше,
	# не естетично, а, по-друге, викликає різні події миші.
	# основний елемент на час тягання клона робиться невидимим

	if !cardRow.table.dragClone and (dx or dy)
		cardRow.table.dragClone = @clone()
		# якщо почався дрег, вважаємо, що це вже точно не клік
		# either dragClone or mouseDownCard may exist
		cardRow.table.mouseDownCard = null
		cardRow.table.snapArea.add cardRow.table.dragClone
		@attr visibility: 'hidden'
		# show fan frames only when drag movement starts
		for name, hand of cardRow.table.hands
			hand.fanFrame.attr visibility: 'visible'
	cardRow.table.dragClone?.transform "t\
	#{x - cardRow.table.pack.cardWidth / 2 }
	,#{y - cardRow.table.pack.cardHeight / 2 }\
	s#{cardRow.table.cardSizeRatio}"

CardRow::dragStartCard = ->
	cardRow = @data 'cardRow'
	cardRow.table.mouseDownCard = @ # needed for tracking "click"
	cardRow.unSetHovers()
	for name, hand of cardRow.table.hands
		hand.unSetHovers()

CardRow::dragEndCard = (e) ->
	card = @
	cardRow = @data 'cardRow'
	unless cardRow.table.dragClone # there has been no drag
		# and click was not made elsewhere
		if @ is cardRow.table.mouseDownCard
			currentHand = 'west'
			if e.ctrlKey
				if e.shiftKey
					currentHand = 'east'
				else
					currentHand = 'south'
			# if cardRow.table.hands["#{currentHand}"].cards.length < 10
			picked = cardRow.cards.splice (@data 'rowIndex'), 1
			# aninClone - це копія карти, яка видаляється із ряду,
			# для симуляції руху по столу від ряду до руки
			# можна, звичайно, використати не клон, а поточний
			# екземпляр, але він анімується "під" карти руки,
			# що не дуже естетично
			animClone = @clone()
			@remove()
			# без цього рядка клон додається "під" ряд і руку
			cardRow.table.snapArea.add animClone
			animToHand = "t#{cardRow.table.coords[currentHand].x},
				#{cardRow.table.coords[currentHand].y}
				s#{cardRow.table.cardSizeRatio},0,0"
			animClone.stop().animate transform: animToHand, 180, mina.backout
			setTimeout (->
				animClone.remove()
				picked[0].hand = currentHand # ATTENTION!!!
				selectedHand = cardRow.table.hands["#{currentHand}"]
				selectedHand.cards.push picked[0]
				cardRow.renderCardRow()
				selectedHand.renderHand()
				for name, tableHand of cardRow.table.hands
					tableHand.setHovers()
				selectedHand.setDrags()
				), 200
	else
		for name, hand of cardRow.table.hands
			if Snap.path.isPointInside hand.fanFramePath, e.pageX, e.pageY
				selectedHand = hand
				break
		if selectedHand
			picked = cardRow.cards.splice (@data 'rowIndex'), 1
			picked[0].hand = selectedHand.seat
			selectedHand.cards.push picked[0]
			cardRow.table.dragClone.remove()
			cardRow.table.dragClone = null
			cardRow.renderCardRow()
			selectedHand.renderHand()
			for name, tableHand of cardRow.table.hands
				tableHand.setHovers()
				tableHand.setDrags()
		else
			if cardRow.table.dragClone
				cardRow.table.dragClone.stop()
				.animate transform: "#{@data 'currentTransform'}t0,0"
				, 400, mina.backout
				setTimeout (->
					cardRow.table.dragClone.remove()
					cardRow.table.dragClone = null
					card.transform "#{card.data 'currentTransform'}t0,0"
					card.attr visibility: 'visible'
					# cardRow.table.mouseDownCard = null
					cardRow.setHovers()
					), 401

	for name, hand of cardRow.table.hands
		hand.fanFrame.attr visibility: 'hidden'

module.exports = CardRow