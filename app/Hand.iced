class Hand
	constructor: (windowWidth, windowHeight, seat, isBlind, isWidow) ->
		@tableSeat = seat
		@getCenterXY windowWidth, windowHeight
		@isBlind = isBlind
		@isWidow = isWidow

Hand::getCenterXY = (width, height) ->
	@centerX = width
	@centerY = height

Hand::buildHand = ->
	# some code to build a fan of cards
	# depending on whether a hand is blind
	# or visible and is being a widow hand