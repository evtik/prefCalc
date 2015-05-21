class Table
	constructor: (width, height, @pack) ->
		@getCoords width, height, @pack.cardWidth

Table::getCoords = (width, height) ->
	@prevWidth = @width

	@width = width
	@height = height
	# @width = if width > 640 then width else 640
	# @height = if height > 480 then height else 480
	# console.log "#{@width}x#{@height}"

	if @snapArea then @snapArea.attr width: @width, height: @height
	else
		@snapArea = Snap @width, @height

	if @cardSizeRatio
		@cardSizeRatio = @width / @prevWidth
		@cardWidth *= @cardSizeRatio
		@cardHeight *= @cardSizeRatio
	else
		@cardWidth = @width * 0.12
		@cardSizeRatio = @cardWidth / @pack.cardWidth
		@cardHeight = @pack.cardHeight * @cardSizeRatio
	# console.log "card #{@cardWidth}x#{@cardHeight}"

	@coords =
						center:
							x: (@width - @cardWidth) / 2
							y: (@height - @cardHeight) / 2
							rotX: @cardWidth / 4
							rotY: @cardHeight
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
