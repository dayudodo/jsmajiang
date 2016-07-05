function isAAA_reg (str) { //正则版本，熟悉正则就会觉得这玩意儿才会比较方便
	var result=checkValidAndReturnArr(str)
	if (result.length!=3) {throw new Error(`str${str} must have three value`)};
	return /(..)\1\1/.test(str.replace(/\s+/g,''))
}
function is4A_reg (str) {
	var result=checkValidAndReturnArr(str)
	if (result.length!=4) {throw new Error(`str${str} must have three value`)};
	return /(..)\1\1\1/.test(str.replace(/\s+/g,''))
}