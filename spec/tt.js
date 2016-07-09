'use strict'
// 全局常量，所有的牌
var BING = ['b1','b2','b3','b4','b5','b6','b7','b8','b9']
var TIAO   = ['t1','t2','t3','t4','t5','t6','t7','t8','t9']
// 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
var ZHIPAI    = ['zh','fa','di']

var all_single_pai=BING.concat(TIAO).concat(ZHIPAI)


Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
	this.splice(index, 1);
	}
};
Array.prototype.equalArrays =function(b){
    if (this.length != b.length) return false; // Different-size arrays not equal
    for(var i = 0; i < this.length; i++)       // Loop through all elements
        if (this[i] !== b[i]) return false;    // If any differ, arrays not equal
    return true;                            // Otherwise they are equal
}

/*
可以把b1b1b1或者说b1 b1 b1转换成双字符规则数组["b1","b1","b1"]
*/
function checkValidAndReturnArr(str) { //todo: 检查牌的合法性，不能有五张相同的牌
	if (!str || str.length==0 ) {
		throw new Error('str is empty')
	}else if(str instanceof Array){
		return str
	}else	{
		let result = str.replace(/\s+/g,'') //首先去掉空格
		if (result.length==0) { throw new Error('str is empty') };
		result = result.match(/(..)/g)      //再二二分割
		if (result.length ==0 ) {
			throw new Error('result is empty')
		}else{
			return result.sort()
		}
	}
}
function isAA (str) {
	let result=checkValidAndReturnArr(str)
	if (result.length!=2) {throw new Error(`str${str} must have 2 values`)};
	//不支持Es6语法，奈何？
	// let s1=result[0]
	// let s2=result[1]
	let [s1,s2]=result
	return(s1==s2)
}

function isAAA (str) {
	let result=checkValidAndReturnArr(str)
	if (result.length!=3) {throw new Error(`str${str} must have 3 values`)};
	let [s1,s2,s3]=result
	return s1==s2 && s2==s3
}


function is4A (str) {
	let result=checkValidAndReturnArr(str)
	if (result.length!=4) {throw new Error(`str${str} must have 4 values`)};
	let [s1,s2,s3,s4]=result
	return s1==s2 && s2==s3 && s3==s4
}


function isABC(str){
	let result=checkValidAndReturnArr(str)
	if (result.length!=3) {throw new Error(`str${str} must have 3 values`)};
	let [s1,s2,s3] = result
	//判断首字母是否相同(判断相同花色)以及 是否是1，2，3这样的顺序
	let isABC = (s2[1]-1==s1[1] && s3[1]-1 == s2[1]) && (s1[0]==s2[0] && s2[0]==s3[0])
	return isABC
}

function isABCorAAA (str) {
	return isAAA(str) || isABC(str)
}
function is2ABC (str) { //like 123456 or 122334,233445这样的牌型
	let result = checkValidAndReturnArr(str)
	if (result.length!=6) {throw new Error(`str${str} must have 6 values`)};
	let [s1,s2,s3,s4,s5,s6] = result
	let frontThree = [s1,s2,s3]
	let lastThree  = [s4,s5,s6]
	//特殊情况，比如112233的情况？
	if (s1==s2 && s3==s4 && s5==s6) {
		return isABC([s1,s3,s5])
	};
	if (isABCorAAA(frontThree) && isABCorAAA(lastThree)) {
		return true
	}
	else{ //交换2,3 比如将122334中间的两个交换过来，再检查
		frontThree = [s1,s2,s4]
		lastThree  = [s3,s5,s6]
		// console.log(frontThree,lastThree)
		if (isABCorAAA(frontThree) && isABCorAAA(lastThree)) {
			return true
		}else{
			return false
		}
	}
}

function is3ABC (str) {
	let result = checkValidAndReturnArr(str)
	if (result.length!=9) {throw new Error(`str${str} must have 9 values`)};
	let frontThree = result.slice(0,3)
	let lastSix = result.slice(3,9)
	let frontSix = result.slice(0,6)
	let lastThree = result.slice(6,9)
	// console.log(frontThree,lastSix)
	if (isABCorAAA(frontThree) && is2ABC(lastSix)) {
		return true
	}else if (is2ABC(frontSix) && isABCorAAA(lastThree)) {
		return true
	}else{
		return false
	}
}
function is4ABC (str) {
	let result = checkValidAndReturnArr(str)
	if (result.length!=12) {throw new Error(`str${str} must have 9 values`)};
	let frontThree = result.slice(0,3)
	let lastNine = result.slice(3,12)
	let frontNine = result.slice(0,9)
	let lastThree = result.slice(9,12)
	let frontSix = result.slice(0,6)
	let lastSix = result.slice(6,12)
	if (is2ABC(frontSix) && is2ABC(lastSix)) {
		return true
	}
	if (isABCorAAA(frontThree) && is3ABC(lastNine)) {
		return true
	}else if (is3ABC(frontNine) && isABCorAAA(lastThree)) {
		return true
	}else{
		return false
	}
}
/*
返回所有的将，比如"b1b2b2b3b3b4b4b5b5b5b6b7b7b7"会返回
["b2b2", "b3b3", "b4b4", "b5b5", "b7b7"]
*/
function getAllJiangArr (result) {
	return result.join('').match(/(..)\1/g)
}
function isPihu (str) {
	let result = checkValidAndReturnArr(str)
	let allJiang = getAllJiangArr(result)
	let bool_hu = false
	let reg_four = /(..)\1\1\1/g
	let reg_three = /(..)\1\1/g
	// console.log(allJiang)
	//循环的目的是因为可能胡不止一张牌
	if (allJiang) {
		allJiang.forEach(function(item){
			// console.log(item)
			var newstr = result.join('')
			//首先去掉四个一样的牌，杠可能有多个
			newstr = newstr.replace(item,'')
			var origin = newstr
			newstr = newstr.replace(reg_four,'')
			// console.log(newstr)
			for (var i = 0; i < 2; i++) {
				if (newstr.length == 0) {
					console.log('检查str, 可能不是一手牌')
					return false
				}
				let last_result = checkValidAndReturnArr(newstr)
				// console.log(last_result)
				switch (last_result.length)
				{
					case 3:
					  if(isABCorAAA(last_result)){ bool_hu = true}
					  break;
					case 6:
					  if(is2ABC(last_result)){ bool_hu = true}
					  break;
					case 9:
					  if(is3ABC(last_result)){ bool_hu = true}
					  break;
					case 12:
					  if(is4ABC(last_result)){ bool_hu = true}
					  break;
				}
				if (false == bool_hu) {
					newstr = origin.replace(reg_three,'')
				}
			}
		})
	return bool_hu
	}else{ //连将都没有，自然不是屁胡
		return false;
	}
}

function isQidui(str){ //判断是否是七对
	let result = checkValidAndReturnArr(str)
	if (result.length!=14) {throw new Error(`str${str} must have 14 values`)};
	// console.log(result)
	for (var i = 0; i < result.length; i+=2) {
		if (result[i] == result[i+1]){
			continue
		}else{
			return false
		}
	}
	return true
}
function isNongQiDui (str) {
	let result = checkValidAndReturnArr(str)
	if (result.length!=14) {throw new Error(`str:${str} must have 14 values`)};
	if (isQidui(str)) {
		let uniq= new Set(result)
		return uniq.size < 7
	}else{
		return false
	}
}
function isYise (str) { //判断是否是一色
	let result = checkValidAndReturnArr(str)
	if (result.length < 14) {throw new Error(`str:${str}  must larger than 14 values`)};
	let first = result.map( item=>item[0] )
	let isUniq = new Set(first).size
	return isUniq == 1
}
function isPengpeng (str) {
	let result = checkValidAndReturnArr(str)
	if (result.length < 13) {throw new Error(`str:${str} must larger than 13 values`)};
	//把所有三个或四个相同的干掉，看最后剩下的是否是将
	let reg=/(..)\1\1\1?/g
	let jiang = (result.join('')).replace(reg,'')
	if (jiang.length !=4) { return false};
	return isAA(jiang)
}

function whoIsHu(str) {
	let result = checkValidAndReturnArr(str)
	let hupai_zhang = []
	
	for(var i=0;i<all_single_pai.length; i++){
		let single_pai = all_single_pai[i]
			let newstr = (result.concat(single_pai)).sort().join('')
			// console.log(newstr)
			let isFiveRepeat = /(..)\1\1\1\1/g.test(newstr)
			if(isFiveRepeat){ 
				continue
				// console.log(newstr.match(/(..)\1\1\1\1/g))
				// throw new Error('irregular Pai, record in database, maybe Hacker.')
			}
			else if( isPihu(newstr) || isPengpeng(newstr) ){
			  hupai_zhang.push(single_pai)
			}
		
	}
	if (hupai_zhang.length==0) { //如果没有找到，就返回false,便于判断
		return false
	}else{
		return hupai_zhang.sort()
	}
	
}

function isKaWuXinG (str, na_pai) {
	let yi_shou_pai= str + na_pai
	let result = checkValidAndReturnArr(yi_shou_pai)
	if (result.length < 14) {throw new Error(`str${str} must larger than 14 values`)};
	//胡牌但是并不是碰胡也不是将牌，就是卡五星,或者胡牌并且两边有4，5，也是卡五星，如果是45556的情况？
	if (isPihu(yi_shou_pai)) {
	  if (na_pai[1]==5) {
	  	let four = na_pai[0]+'4'
	  	let six = na_pai[0]+'6'
	  	if (result.includes(four) && result.includes(six)) {
	  		return true;
	  	}
	  }
	}
	return false
}