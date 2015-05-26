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

# винесено окремо, бо сортувати потрібно не лише руки,
# а й початковий ряд карт, з якого вони формуюються,
# бо назви мастей clubs, diamonds, hearts, spades
# призводять до послідовності чорний-червоний-червоний-чорний
# при читанні зображень з диску, що виглядає не дуже