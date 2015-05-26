class Table
	constructor: (width, height, @pack) ->
		@snapArea = Snap()
		@getCoords width, height

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
	# console.log "card #{@cardWidth}x#{@cardHeight}"

	@coords =
						rotX: @pack.cardWidth / 4
						rotY: @pack.cardHeight
						# center:
						# 	x: (@width - @cardWidth) / 2
						# 	y: (@height - @cardHeight) / 2

						# усі координати підбиралися емпірично, т.я.
						# обертання кожної карти у "віялі" робиться
						# навколо "несиметричної" точки
						south:
							x: (@width - @cardWidth) / 2
							y: (@height - @cardHeight * 1.2) / 10 * 8.62
						north:
							x: (@width - @cardWidth) / 2
							y: (@height - @cardHeight * 1.2) / 10 * 1.38
						west:
							x: (@width - @cardWidth * .8) / 10 * 1.8
							y: (@height - @cardHeight) / 2
						east:
							x: (@width - @cardWidth * .8) / 10 * 8.2
							y: (@height - @cardHeight) / 2
						lowerRow:
							x: 20
							y: @height - @cardHeight - 20

						# spades:
						# 	x: 15
						# 	y: 18
						# clubs:
						# 	x: 15
						# 	y: 18
						# diamonds:
						# 	x: 15
						# 	y: 18
						# hearts:
						# 	x: 15
						# 	y: 18
						# cardSize:
						# 	width: 10
						# 	height: 20

module.exports = Table
