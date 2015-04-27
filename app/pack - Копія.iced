cardNames =	[ '7c', '8c', '9c', '10c', 'jc', 'qc', 'kc', 'ac',
							'7d', '8d', '9d', '10d', 'jd', 'qd', 'kd', 'ad',
							'7h', '8h', '9h', '10h', 'jh', 'qh', 'kh', 'ah',
							'7s', '8s', '9s', '10s', 'js', 'qs', 'ks', 'as' ]
class Pack
	constructor: ->
		await @getPack defer cardsPack
		@cards = cardsPack


	getPack = (cb) ->
		pack = []
		for c, i in cardNames
			await Snap.load "cards/#{c}.svg", defer cardPic
			pack.push suit: c.slice(-1), value: c.slice(-3, -1), pic: cardPic
		cb pack

module.exports.getPack = Pack