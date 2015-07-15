utils = require './utils'

class Trick
	constructor: (@table, @pack) ->
		@cards = []
		@hands = []
		@hands.push @table.deal.firstHand
		@hands.push @table.getNextHand @hands[0]
		@hands.push @table.getNextHand @hands[1]
		console.log "trick cards are #{@hands}"
		@trickGroup = @table.snapArea.g()
		firstRot = utils.getRandomInt 1, 5 * 360 - 54 - utils.getRandomInt 0, 9 * 1.5
		secondRot = utils.getRandomInt 1, 5 * 354 + utils.getRandomInt 0, 9 * 1.5
		thirdRot = utils.getRandomInt 1, 5 * 360 + 54 + utils.getRandomInt 0, 9 * 1.5
		@cardRotations = []
		@cardRotations.push firstRot, secondRot, thirdRot
		# @cardRotations.push -66, 6, 66
		@cardShifts = []
		@cardShifts.push shiftX: (@pack.cardWidth * -.15) - (utils.getRandomInt 0, 6) * 0.03, shiftY: 0
		@cardShifts.push shiftX: 0, shiftY: (@pack.cardHeight * -.15) - (utils.getRandomInt 0, 6) * 0.03
		@cardShifts.push shiftX: (@pack.cardWidth * .15) + (utils.getRandomInt 0, 6) * 0.03, shiftY: 0
		console.log @cardShifts

Trick::renderTrick = ->

Trick::getWinnerHand = ->
	# console.log @
	self = @
	# console.log @table.deal.startHand
	# if @table.deal.startHand
	# 	return @table.deal.startHand
	# else
	# 	@table.deal.startHand = null
	compareCards = (first, second) ->
		# console.log self
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
	console.log "карти взятки є"
	console.log @cards
	compareCards (compareCards @cards[0], @cards[1]), @cards[2]

module.exports = Trick