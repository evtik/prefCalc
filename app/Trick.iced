utils = require './utils'

class Trick
	constructor: (@table, @pack) ->
		@cards = []
		@hands = []
		@hands.push @table.deal.firstHand
		@hands.push @table.getNextHand @hands[0]
		@hands.push @table.getNextHand @hands[1]
		@trickGroup = @table.snapArea.g()
		@shiftsRotations = {}
		@getRandoms()

Trick::renderTrick = ->

Trick::getRandoms = ->

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

Trick::getWinnerHand = ->
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