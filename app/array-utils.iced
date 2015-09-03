Array::unique = ->
	n = {}
	r = []
	for el, i in @
		unless n[@[i]]
			n[@[i]] = on
			r.push @[i]
	r

Array::exists = (val) ->
	if @indexOf(val) >= 0 then yes else no

Array::getNextOrFirstItem = (item) ->
	if @[(@.indexOf item) + 1]
		return @[(@.indexOf item) + 1]
	else
		return @[0]