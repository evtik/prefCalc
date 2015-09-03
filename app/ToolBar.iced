class ToolBar
	constructor: (@table, cb) ->
		@height = 48
		@margin = 4
		@buttons = {} # maybe array?
		@shadow = @table.snapArea.filter \
			Snap.filter.shadow 7,7,3,'black', .8
		@getButtons ->
			cb()

ToolBar::getButtons = (cb) ->
	enabledButtonAttrs = fill: 'white', stroke: 'black'
	, strokeWidth: 1, visibility: 'hidden'
	disabledButtonAttrs = fill: '#444', stroke: 'black'
	, strokeWidth: 1, visibility: 'hidden'

	await # waiting for loading all images
		Snap.load "icons/document.svg", defer newImage
		Snap.load "icons/flag-2.svg", defer startImage
		Snap.load "icons/arrow-left.svg", defer backImage
		Snap.load "icons/arrow-right.svg", defer forwardImage
		Snap.load "icons/clubs.svg", defer clubs_suit
		Snap.load "icons/diamonds.svg", defer diamonds_suit
		Snap.load "icons/hearts.svg", defer hearts_suit
		Snap.load "icons/spades.svg", defer spades_suit

	# 'new deal' button
	newsvg = newImage.select('svg').attr enabledButtonAttrs
	@buttons.newDeal = @table.snapArea.g newsvg
	.data 'toolBarIndex', 1
	.data 'isActive', yes

	# 'start' button
	startsvg = startImage.select('svg').attr disabledButtonAttrs
	@buttons.start = @table.snapArea.g startsvg
	.data 'toolBarIndex', 3
	.data 'isActive', no

	# 'back' button
	backsvg = backImage.select('svg').attr disabledButtonAttrs
	@buttons.back = @table.snapArea.g backsvg
	.data 'toolBarIndex', 4
	.data 'isActive', no

	# 'forward' button
	forwardsvg = forwardImage.select('svg').attr disabledButtonAttrs
	@buttons.forward = @table.snapArea.g forwardsvg
	.data 'toolBarIndex', 5
	.data 'isActive', no

	# 'suit' button
	suitButtonAttrs = visibility: 'hidden', stroke:'white'
	, strokeWidth: .3
	spadessvg = spades_suit.select('svg').attr(suitButtonAttrs).data 'suit', 's'
	clubssvg = clubs_suit.select('svg').attr(suitButtonAttrs).data 'suit', 'c'
	diamondssvg = diamonds_suit.select('svg').attr(suitButtonAttrs).data 'suit', 'd'
	heartssvg = hearts_suit.select('svg').attr(suitButtonAttrs).data 'suit', 'h'
	@buttons.suit = @table.snapArea.g spadessvg, clubssvg, diamondssvg, heartssvg
	@buttons.suit.data 'toolBarIndex', 2
	.data 'isActive', yes
	.data 'imagesCount', 4
	.data 'activeImage', 0


	# for all of the buttons:
	# 1) add transparent rect to take mouse events, add shadow
	#		 placing it above all the other in the group to easily
	#		 deal with a multi-imaged button, i.e. 'multi' starts
	#		 from index 0 till index = groupLength - 1
	# 2) move to the index corresponding position
	# 3) make visible
	# 4) set hover in, hover out, mouse down, mouse up behaviour
	# 5) click handler will be set in app.iced to deal with the
	#		 button functionality within the application

	for n, b of @buttons
		upperRect = @table.snapArea.rect 0, 0, @height, @height
		.attr fill: 'transparent'
		b.add upperRect
		xShift = @margin * 2 + ((b.data 'toolBarIndex') - 1) * (48 + @margin)
		tr = "t#{xShift},#{@margin * 2}"
		b.transform tr
		b.data 'currentTransform', tr
		b.data 'toolBar', @
		b[0].attr visibility: 'visible'
		b.attr filter: @shadow

		b.hover ( ->
				if @data 'isActive'
					# @transform "#{@data 'currentTransform'}s1.15"
					@stop().animate transform: "#{@data 'currentTransform'}s1.15"
					, 50, mina.easein
			),
			( ->
				if @data 'isActive'
					# @transform "#{@data 'currentTransform'}s1"
					@stop().animate transform: "#{@data 'currentTransform'}s1"
					, 150, mina.easeout
			)

			b.mousedown ->
				if @data 'isActive'
					@transform "#{@data 'currentTransform'}s.95t2,2"

			b.mouseup ->
				if @data 'isActive'
					@transform "#{@data 'currentTransform'}s1.15"
					if @data 'imagesCount'
						count = @data 'imagesCount'
						current = @data 'activeImage'
						if current is count - 1
							next = 0
						else
							next = current + 1
						@[current].attr visibility: 'hidden'
						@[next].attr visibility: 'visible'
						@data 'activeImage', next
				else
					@transform "#{@data 'currentTransform'}"

	cb()

module.exports = ToolBar