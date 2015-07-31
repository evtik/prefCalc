class Table
	constructor: (width, height, @pack) ->
		@mouseDownClone = null
		@dragClone = null
		@snapArea = Snap()
		@fanShiftFactor = 1.8
		@getCoords width, height
		@cardRow = {}

Table::getCoords = (width, height) ->
	# @width = if width > 640 then width else 640
	# @height = if height > 480 then height else 480
	# console.log "#{@width}x#{@height}"
	@width = width
	@height = height

	# if @snapArea then @snapArea.attr width: @width, height: @height
	# else
	# 	@snapArea = Snap @width, @height
	# @snapArea.attr width: @width, height: @height

	@cardWidth = @width * 0.11
	# @cardHeight = @pack.cardHeight * @cardWidth / @pack.cardWidth
	@cardSizeRatio = @cardWidth / @pack.cardWidth
	@cardHeight = @pack.cardHeight * @cardSizeRatio

	@coords =
						# чому саме @pack.cardWidth, а не
						# @cardWidth для мене загадка
						rotX: @pack.cardWidth / 4
						rotY: @pack.cardHeight
						center:
							x: (@width - @pack.cardWidth) / 2
							y: (@height - @pack.cardHeight) / 2
						# fanInnerR: @cardHeight * .2
						fanInnerR: @cardHeight * .55
						fanOuterR: @cardHeight * 1.95

						# усі координати підбиралися емпірично, т.я.
						# обертання кожної карти у "віялі" робиться
						# навколо "несиметричної" точки
						south:
							x: (@width - @cardWidth) / 2 + @cardWidth / 4
							y: (@height - @cardHeight * 1.2) * .88
							sectorFanX: (@width - @cardWidth) / 2 + @cardWidth / 2
							sectorFanY: (@height - @cardHeight * 1.2) * .88 + @cardHeight * @fanShiftFactor
						north:
							x: (@width - @cardWidth) / 2 + @cardWidth / 4
							y: (@height - @cardHeight * 1.2) * .12
							sectorFanX: (@width - @cardWidth) / 2 + @cardWidth / 2
							sectorFanY: (@height - @cardHeight * 1.2) * .12 + @cardHeight * @fanShiftFactor
						west:
							x: (@width - @cardWidth * .8) * .2 + @cardWidth / 4
							y: (@height - @cardHeight) / 2
							sectorFanX: (@width - @cardWidth * .8) * .2 + @cardWidth / 2
							sectorFanY: (@height - @cardHeight) / 2 + @cardHeight * @fanShiftFactor
						east:
							x: (@width - @cardWidth * .8) * .8 + @cardWidth / 4
							y: (@height - @cardHeight) / 2
							sectorFanX: (@width - @cardWidth * .8) * .8 + @cardWidth / 2
							sectorFanY: (@height - @cardHeight) / 2 + @cardHeight * @fanShiftFactor
						lowerRow:
							# x: ((@width - @cardWidth) / (rowLength + 1)) / @cardSizeRatio
							y: @cardHeight * .5 # ??? хєрня якась, потім повернуся...

Table::getNextHand = (currentHand) ->
	# лише варіант "гусарик" не оброблено: там той, хто здає,
	# не є "на прикупі", є окремо "здаючий", "прикуп" і "болван"
	# як не крути - все одно "малювати" доводиться усі 4 руки
	# у будь-якому варіанті: 2, 3 або 4 гравця; можна домо-
	# витись: при грі втрьох прикуп постійно на "півдні" і
	# грають лише 3 руки "захід-північ-схід", при грі удвох -
	# грають "північ-південь", прикуп-болван чергуються на
	# "схід-захід"

	# поки що немає потреби реалізовувати для різної кількості
	# гравців
	# (currentHand, playersNumber, dealer
	# if playersNumber is 4
	# 	hands = ['north', 'east', 'south', 'west']
	# else
	# 	hands = ['east', 'north', 'west']
	# if (hands.indexOf currentHand) < (hands.length - 1)
	# 	nextHand = hands[(hands.indexOf currentHand) + 1]
	# else
	# 	nextHand = hands[0]
	# if playersNumber is 4 and nextHand is dealer
	# 	furtherHand = @getNextHand nextHand, playersNumber
	# 	return furtherHand
	# nextHand

	# для аналізатора розкладів і симулятора роздач буде завжди 3
	hands = ['west', 'east', 'south']
	if (hands.indexOf currentHand) < (hands.length - 1)
		nextHand = hands[(hands.indexOf currentHand) + 1]
	else
		nextHand = hands[0]
	nextHand

module.exports = Table
