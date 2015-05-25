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

	console.log @snapArea

	# if @snapArea then @snapArea.attr width: @width, height: @height
	# else
	# 	@snapArea = Snap @width, @height
	# @snapArea.attr width: @width, height: @height

	@cardWidth = @width * 0.12
	# @cardHeight = @pack.cardHeight * @cardWidth / @pack.cardWidth
	@cardSizeRatio = @cardWidth / @pack.cardWidth
	@cardHeight = @pack.cardHeight * @cardSizeRatio
	# console.log "card #{@cardWidth}x#{@cardHeight}"

	@coords =
						center:
							x: (@width - @cardWidth) / 2
							y: (@height - @cardHeight) / 2
							rotX: @pack.cardWidth / 4
							rotY: @pack.cardHeight
						# south:
						# 	x: 5
						# 	y: 6
						# 	rotX: 1
						# 	rotY: 2
						# west:
						# 	x: 5
						# 	y: 6
						# 	rotX: 1
						# 	rotY: 2
						# north:
						# 	x: 7
						# 	y: 8
						# 	rotX: 1
						# 	rotY: 2
						# east:
						# 	x: 10
						# 	y: 11
						# 	rotX: 1
						# 	rotY: 2
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
