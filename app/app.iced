cardSorter = (require "./utils").cardSorter
Pack = require './Pack'

hand = Snap window.innerWidth, window.innerHeight

window.addEventListener 'resize', ->
	hand.attr
		width: window.innerWidth
		height: window.innerHeight

cardWidth = 224.19670
cardHeight = 312.79669

await pack = new Pack defer cards

pack.shuffle()
tenCards = pack.cards.splice 20, 10
tenCards.sort cardSorter
numCards = tenCards.length
angle = 15
shiftAngle = 15
splitAngle = 3

handGroupNorth = hand.g()


handCenterX = (window.innerWidth - cardWidth) / 2
handCenterY = (window.innerHeight - cardHeight) / 2
cardRotations = []

for card, i in tenCards

	fanMove = "t#{handCenterX},#{handCenterY}"
	fanRotate = "r#{angle * (i - numCards / 2 + .5)}"
	cardRotations.push angle * (i - numCards / 2 + .5)
	fanRotateCenter = ",#{cardWidth * .25},#{cardHeight}"
	curTrans = fanMove + fanRotate + fanRotateCenter
	exponent = 1.7

	upperRect = hand
		.rect 0, 0, cardWidth, cardHeight
		.attr fill: 'transparent', strokeWidth: 0

	cardGroup = hand.g()

		# робочій варіант із поворотом навколо нижнього лівого кута першої карти із зміщенням
		# центру обертання на чверть ширини карти
	cardGroup
		.transform fanMove + fanRotate + fanRotateCenter
		.data 'curTrans', curTrans
		.data 'fanMove', fanMove
		.data 'fanRotate', fanRotate
		.data 'fanRotateCenter', fanRotateCenter
		.data 'handIndex', i
		.data 'suit', card.suit
		.data 'value', card.value
		.add card.pic
		.add upperRect
		# .click ->
		# 	currentIndex = @data 'handIndex'
		# 	handGroup = do @parent
		# 	startAngle = cardRotations[0]
		# 	endAngle = cardRotations[cardRotations.length - 1]
		# 	for i, el of handGroup when not Number.isNaN +i
		# 		if i < currentIndex
		# 			el.transform "#{fanMove}r#{cardRotations[i]}#{fanRotateCenter}
		# 			 r#{startAngle - cardRotations[i] - shiftAngle +
		# 			 Math.pow(i, exponent) * splitAngle}#{fanRotateCenter}"
		# 			console.log "#{fanMove}r#{cardRotations[i]}#{fanRotateCenter}
		# 			 r#{startAngle - cardRotations[i] - shiftAngle +
		# 			 Math.pow(i, exponent) * splitAngle}#{fanRotateCenter}"
		# 		if i > currentIndex
		# 			el.transform "#{fanMove}r#{cardRotations[i]}#{fanRotateCenter}
		# 			 r#{endAngle - cardRotations[i] + shiftAngle -
		# 			 Math.pow((cardRotations.length - i), exponent) * splitAngle}#{fanRotateCenter}"
		# 			console.log "#{fanMove}r#{cardRotations[i]}#{fanRotateCenter}
		# 			 r#{endAngle - cardRotations[i] + shiftAngle -
		# 			 Math.pow((cardRotations.length - i), exponent) * splitAngle}#{fanRotateCenter}"
		.hover( ( ->
							currentIndex = @data 'handIndex'
							handGroup = do @parent
							startAngle = cardRotations[0]
							endAngle = cardRotations[cardRotations.length - 1]
							@transform "#{@data 'fanMove'}#{@data 'fanRotate'}#{@data 'fanRotateCenter'}t0,-100"
							for i, el of handGroup when not Number.isNaN +i
								# console.log "#{i} : #{el.data 'fanRotate'} : #{el.data 'suit'} : #{el.data 'value'}"
								if i < currentIndex
									el.transform "#{fanMove}r#{cardRotations[i]}#{fanRotateCenter}
									 r#{startAngle - cardRotations[i] - shiftAngle +
									 Math.pow(i, exponent) * splitAngle}#{fanRotateCenter}"
									# console.log "#{fanMove}r#{cardRotations[i]}#{fanRotateCenter}
									#  r#{startAngle - cardRotations[i] - shiftAngle +
									#  Math.pow(i, exponent) * splitAngle}#{fanRotateCenter}"
								if i > currentIndex
									el.transform "#{fanMove}r#{cardRotations[i]}#{fanRotateCenter}
									 r#{endAngle - cardRotations[i] + shiftAngle -
									 Math.pow((cardRotations.length - i), exponent) * splitAngle}#{fanRotateCenter}"
									# console.log "#{fanMove}r#{cardRotations[i]}#{fanRotateCenter}
									#  r#{endAngle - cardRotations[i] + shiftAngle -
									#  Math.pow((cardRotations.length - i), exponent) * splitAngle}#{fanRotateCenter}"
							),
							( ->
								currentIndex = @data 'handIndex'
								handGroup = do @parent
								startAngle = cardRotations[0]
								endAngle = cardRotations[cardRotations.length - 1]
								for i, el of handGroup when not Number.isNaN +i
									el.transform "#{fanMove}r#{cardRotations[i]}#{fanRotateCenter}"
							)
			)
		# .hover( (-> @stop().animate transform: "#{@data 'curTrans'}t0,#{-cardHeight/2}", 200, mina.elastic),
		# 				(-> @stop().animate transform: "#{@data 'curTrans'}t0,0", 200, mina.backout) )
		.click -> console.log "Card #{@data 'value'}#{@data 'suit'} clicked!"

	handGroupNorth.add cardGroup

upperCircle = hand
	.circle window.innerWidth / 2 - .25 * cardWidth,
		window.innerHeight / 2 + .5 * cardHeight, cardHeight * .4, cardHeight * .4
	.attr fill: "orange", strokeWidth: 0, opacity: 0.2

# handGroupNorth.add upperCircle