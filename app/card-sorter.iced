module.exports  = (sortSuits, sortValues = ['7', '8', '9', '10', 'j', 'q', 'k', 'a']) ->
	(current, next) ->
		if sortSuits.indexOf(current.suit) < sortSuits.indexOf(next.suit)
			return -1
		if sortSuits.indexOf(current.suit) > sortSuits.indexOf(next.suit)
			return 1
		if sortValues.indexOf(current.value) < sortValues.indexOf(next.value)
			return 1
		if sortValues.indexOf(current.value) > sortValues.indexOf(next.value)
			return -1
