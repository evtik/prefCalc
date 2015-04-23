shuffle = (array) ->
	m = array.length
	while m
		i = Math.floor (Math.random() * m--)
		t = array[m]
		array[m] = array[i]
		array[i] = t
	array

module.exports.shuffle = shuffle

cardSorter = (current, next) ->
	sortSuits = ['s', 'd', 'c', 'h']
	sortValues = ['7', '8', '9', '10', 'j', 'q', 'k', 'a']
	if sortSuits.indexOf(current.suit) < sortSuits.indexOf(next.suit)
		return -1
	if sortSuits.indexOf(current.suit) > sortSuits.indexOf(next.suit)
		return 1
	if sortValues.indexOf(current.value) < sortValues.indexOf(next.value)
		return 1
	if sortValues.indexOf(current.value) > sortValues.indexOf(next.value)
		return -1

module.exports.cardSorter = cardSorter

