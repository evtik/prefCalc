class Pack
	constructor: (cb) ->
		@cardNames =	[ '7c', '8c', '9c', '10c', 'jc', 'qc', 'kc', 'ac',
										'7d', '8d', '9d', '10d', 'jd', 'qd', 'kd', 'ad',
										'7h', '8h', '9h', '10h', 'jh', 'qh', 'kh', 'ah',
										'7s', '8s', '9s', '10s', 'js', 'qs', 'ks', 'as' ]
		@cards = []
		@sortValues = ['7', '8', '9', '10', 'j', 'q', 'k', 'a']
		@getPack ->
			cb()

Pack::getPack = (cb) ->
	pack = []
	for c, i in @cardNames
		await Snap.load "cards/#{c}.svg", defer cardPic
		pack.push suit: c.slice(-1), value: c.slice(-3, -1), pic: cardPic
	@cards = pack
	await
		Snap.load "cards/back_blue.svg", defer back_blue
		Snap.load "cards/back_red.svg", defer back_red
		Snap.load "cards/clubs.svg", defer clubs_card
		Snap.load "cards/diamonds.svg", defer diamonds_card
		Snap.load "cards/hearts.svg", defer hearts_card
		Snap.load "cards/spades.svg", defer spades_card
	@backBlue = back_blue.select('svg')
	@backRed = back_red.select('svg')
	@clubs = clubs_card.select('svg')
	@diamonds = diamonds_card.select('svg')
	@hearts = hearts_card.select('svg')
	@spades = spades_card.select('svg')
	# getBBox ???? and ...pic: cardPic.select('svg') ???
	@cardWidth = @cards[0].pic.node.children[0].attributes.width.value
	@cardHeight = @cards[0].pic.node.children[0].attributes.height.value
	cb()

Pack::shuffle = ->
	m = @cards.length
	while m
		i = Math.floor (Math.random() * m--)
		t = @cards[m]
		@cards[m] = @cards[i]
		@cards[i] = t

Pack::cardSorter = (sortSuits, sortValues = @sortValues) ->
	(current, next) ->
		if sortSuits.indexOf(current.suit) < sortSuits.indexOf(next.suit)
			return -1
		if sortSuits.indexOf(current.suit) > sortSuits.indexOf(next.suit)
			return 1
		if sortValues.indexOf(current.value) < sortValues.indexOf(next.value)
			return 1
		if sortValues.indexOf(current.value) > sortValues.indexOf(next.value)
			return -1

	# винесено окремо, бо сортувати потрібно не лише руки,
	# а й початковий ряд карт, з якого вони формуюються,
	# бо назви мастей clubs, diamonds, hearts, spades
	# призводять до послідовності чорний-червоний-червоний-чорний
	# при читанні зображень з диску, що виглядає не дуже


module.exports = Pack