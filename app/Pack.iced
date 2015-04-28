class Pack
	constructor: (cb) ->
		@cardNames =	[ '7c', '8c', '9c', '10c', 'jc', 'qc', 'kc', 'ac',
										'7d', '8d', '9d', '10d', 'jd', 'qd', 'kd', 'ad',
										'7h', '8h', '9h', '10h', 'jh', 'qh', 'kh', 'ah',
										'7s', '8s', '9s', '10s', 'js', 'qs', 'ks', 'as' ]
		@cards = []
		@getPack ->
			cb()

Pack::getPack = (cb) ->
	pack = []
	for c, i in @cardNames
		await Snap.load "cards/#{c}.svg", defer cardPic
		pack.push suit: c.slice(-1), value: c.slice(-3, -1), pic: cardPic
	@cards = pack
	cb()

Pack::shuffle = ->
	m = @cards.length
	while m
		i = Math.floor (Math.random() * m--)
		t = @cards[m]
		@cards[m] = @cards[i]
		@cards[i] = t

module.exports = Pack