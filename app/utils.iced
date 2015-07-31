exports.getRandomInt = (min, max) -> # min включаючи min, виключаючи max
	(Math.floor Math.random() * (max - min)) + min

# це функція, яка приймає координати центру,
# радіус (гіпотенуза), та кут, а повертає
# відповідну точку
polarToCartesian = (cx, cy, r, angle) ->
	angle = (angle - 90) * Math.PI / 180
	# наступне означає: повернути такий об'єкт
	x: cx + r * Math.cos angle
	y: cy + r * Math.sin angle

# а ця функція, власне, малює дугу, отримуючи
# координати її початку, кінця, кут береться із
# розрахунку його залишку від поділення на 360,
# тобто 420=60, в залежності від різності кутів
# завжди малюємо маленьку дугу
# щоб намалювати саме сектор, треба додати ще 6й
# bool аргумент, який визначає, чи малювати
# продовження шляху, чи це початок малювання (L або М)
describeArc = (x, y, r, startAngle, endAngle, continueLine) ->
	start = polarToCartesian x, y, r, startAngle %= 360
	end = polarToCartesian x, y, r, endAngle %= 360
	large = Math.abs(endAngle - startAngle) >= 180
	alter = endAngle > startAngle
	"#{if continueLine then 'L' else 'M'}#{start.x},#{start.y}
	A#{r},#{r},0,
	#{if large then 1 else 0},
	#{if alter then 1 else 0}, #{end.x},#{end.y}"

exports.describeSector = (x, y, r, r2, startAngle, endAngle) ->
	"#{describeArc x, y, r, startAngle, endAngle}
	#{describeArc x, y, r2, endAngle, startAngle, on}Z"