exports.getRandomInt = (min, max) -> # min включаючи min, виключаючи max
	(Math.floor Math.random() * (max - min)) + min