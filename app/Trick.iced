utils = require './utils'

class Trick
	constructor: (@table, @pack) ->
		@cards = []
		@hands = []
		@hands.push @table.deal.firstHand
		@hands.push @table.getNextHand @hands[0]
		@hands.push @table.getNextHand @hands[1]
		@trickGroup = []
		@shiftsRotations = {}
		@getRandoms()

Trick::renderTrick = ->
	if @cards.length
		for el in @trickGroup
			el.remove()
		@trickGroup = []
		self = @

		for card in @cards
			cardGroup = @table.snapArea.g()
			cardGroup
				.data 'packIndex', card.packIndex
				.data 'hand', card.hand
				.data 'trick', self
				.add self.pack.cards[card.packIndex].pic.select('svg').clone()
			@trickGroup.push cardGroup

		for el in @trickGroup
			el.transform "t0,0s1,0,0r0,0,0"
			handName = el.data 'hand'
			hand = @table.hands["#{handName}"]
			trickX = hand.table.coords.center.x -
				@shiftsRotations["#{hand.seat}"].shift.x
			trickY = hand.table.coords.north.y -
				@shiftsRotations["#{hand.seat}"].shift.y
			tr = "t#{trickX},#{trickY}" +
			"s#{hand.table.cardSizeRatio}" +
			"r#{@shiftsRotations["#{hand.seat}"].rotation}"
			el.transform tr

Trick::animateTrickToHand = (animDuration, hand) ->
	self = @
	if @cards.length is 3
		# initializing back object
		back = @table.snapArea.g()
		# moves all 3 trick cards to heap
		setTimeout (->
			for el in self.trickGroup
				el.stop()
				.animate transform: "T#{self.table.coords.center.x}
				,#{self.table.coords.north.y}S#{self.table.cardSizeRatio}R0"
				, animDuration * .2, mina.easein
			), animDuration * .2
		# removes first two lower cards since there's no need of them
		setTimeout (->
				for el, i in self.trickGroup when i isnt 2
					el.remove()
			), animDuration * .4
		# shrinks the remaining upper card, 1st phase of folding
		setTimeout (->
			self.trickGroup[2].stop()
			.animate transform: "t#{self.table.coords.center.x}
			,#{self.table.coords.north.y}s.0001
			,#{self.table.cardSizeRatio}r0", animDuration * .2
			# removes the last trick card
			setTimeout (->
				self.trickGroup[2].remove()
				self.trickGroup = []
				), animDuration * .2 + 10
			), animDuration * .6
		# adds animating back
		setTimeout (->
			back.add self.pack.backBlue.clone()
			back.attr visibility: 'hidden'
			back.transform "s.0001,#{self.table.cardSizeRatio}r0\
			T#{self.table.coords.center.x},#{self.table.coords.north.y}"

			back.attr visibility:'visible'
			back.stop().animate transform: "s#{self.table.cardSizeRatio}
			,#{self.table.cardSizeRatio}r0T#{self.table.coords.center.x}
			,#{self.table.coords.north.y}", animDuration * .2
			), animDuration * .8
		# moves back to hand tricks
		setTimeout (->
			tr = hand.getTrickCoords (hand.tricks.length - 1)
			back.stop().animate transform: tr[2], animDuration * .2
			setTimeout (->
				back.remove()
				), animDuration * .2 + 10
			), animDuration

Trick::getRandoms = ->
	# think using @table.cardWidth/Height instead!!! bad looking on different screen sizes
	@shiftsRotations.west = # було зміщення .15, зараз .35
		rotation: (utils.getRandomInt 1, 5) * 360 - 54 - (utils.getRandomInt 0, 9) * 1.5
		shift:
			x: (@pack.cardWidth * .35) - (utils.getRandomInt 0, 6) * 0.03 * @pack.cardWidth
			y: 0
	@shiftsRotations.south =
		rotation: (utils.getRandomInt 1, 5) * 354 + (utils.getRandomInt 0, 9) * 1.5
		shift:
			x: 0
			y: (@pack.cardHeight * .35) - (utils.getRandomInt 0, 6) * 0.03 * @pack.cardHeight
	@shiftsRotations.east =
		rotation: (utils.getRandomInt 1, 5) * 360 + 54 + (utils.getRandomInt 0, 9) * 1.5
		shift:
			x: (@pack.cardWidth * -.35) + (utils.getRandomInt 0, 6) * 0.03 * @pack.cardWidth
			y: 0

Trick::getWinnerCard = ->
	self = @
	compareCards = (first, second) ->
		if first.suit isnt self.table.deal.trump
			if second.suit isnt self.table.deal.trump
				if second.suit is first.suit
					if (self.pack.sortValues.indexOf first.value) > (self.pack.sortValues.indexOf second.value)
						return first
					else
						return second
				else
					return first
			else
				return second
		else
			if second.suit isnt self.table.deal.trump
				return first
			else
				if (self.pack.sortValues.indexOf first.value) > (self.pack.sortValues.indexOf second.value)
					return first
				else
					return second
	compareCards (compareCards @cards[0], @cards[1]), @cards[2]

module.exports = Trick