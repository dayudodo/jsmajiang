// import React from 'react';
// var react= require('react');

function tt (argument) {
	if (argument=='1') {	return "abc";};
	// return name.split("").reverse().join("");

}
function checkNullAndReturnArr(str) {
	if (!str) {
		throw new Error('str is null or undefined')
	}else if(str instanceof Array){
		return str
	}else	{
		return str.split(/\s+/).sort()
	}
}
function validAA (str) {
	var result=checkNullAndReturnArr(str)
	if (result.length!=2) {throw new Error(`str${str} must have 2 values`)};
	//不支持Es6语法，奈何？
	// let s1=result[0]
	// let s2=result[1]
	let [s1,s2]=result
	return(s1==s2)
}

function validAAA (str) {
	var result=checkNullAndReturnArr(str)
	if (result.length!=3) {throw new Error(`str${str} must have 3 values`)};
	let [s1,s2,s3]=result
	return s1==s2 && s2==s3
}


function valid4A (str) {
	var result=checkNullAndReturnArr(str)
	if (result.length!=4) {throw new Error(`str${str} must have 4 values`)};
	let [s1,s2,s3,s4]=result
	return s1==s2 && s2==s3 && s3==s4
}


function validABC(str){
	var result=checkNullAndReturnArr(str)
	if (result.length!=3) {throw new Error(`str${str} must have 3 values`)};
	let [s1,s2,s3] = result
	//判断首字母是否相同(判断相同花色)以及 是否是1，2，3这样的顺序
	let isABC = (s2[1]-1==s1[1] && s3[1]-1 == s2[1]) && (s1[0]==s2[0] && s2[0]==s3[0])
	return isABC
}

function isABCorAAA (str) {
	return validAAA(str) || validABC(str)
}
function valid2ABC (str) { //like 123456 or 122334,233445这样的牌型
	var result = checkNullAndReturnArr(str)
	if (result.length!=6) {throw new Error(`str${str} must have 6 values`)};
	let [s1,s2,s3,s4,s5,s6] = result
	let frontThree = [s1,s2,s3]
	let lastThree  = [s4,s5,s6]
	//特殊情况，比如112233的情况？
	if (s1==s2 && s3==s4 && s5==s6) {
		return validABC([s1,s3,s5])
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

function valid3ABC (str) {
	var result = checkNullAndReturnArr(str)
	if (result.length!=9) {throw new Error(`str${str} must have 9 values`)};
	let frontThree = result.slice(0,3)
	let lastSix = result.slice(3,9)
	let frontSix = result.slice(0,6)
	let lastThree = result.slice(6,9)
	// console.log(frontThree,lastSix)
	if (isABCorAAA(frontThree) && valid2ABC(lastSix)) {
		return true
	}else if (valid2ABC(frontSix) && isABCorAAA(lastThree)) {
		return true
	}else{
		return false
	}
}
function valid4ABC (str) {
	var result = checkNullAndReturnArr(str)
	if (result.length!=12) {throw new Error(`str${str} must have 9 values`)};
	let frontThree = result.slice(0,3)
	let lastNine = result.slice(3,12)
	let frontNine = result.slice(0,9)
	let lastThree = result.slice(9,12)
	let frontSix = result.slice(0,6)
	let lastSix = result.slice(6,12)
	if (valid2ABC(frontSix) && valid2ABC(lastSix)) {
		return true
	}
	if (isABCorAAA(frontThree) && valid3ABC(lastNine)) {
		return true
	}else if (valid3ABC(frontNine) && isABCorAAA(lastThree)) {
		return true
	}else{
		return false
	}
}
