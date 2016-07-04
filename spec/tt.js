// import React from 'react';
// var react= require('react');

function tt (argument) {
	if (argument=='1') {	return "abc";};
	// return name.split("").reverse().join("");

}
function validAA (str) {
	let result=str.split(/\s+/)
	if (result.length!=2) {throw new Error(`str${str} must have two value`)};
	//不支持Es6语法，奈何？
	// let s1=result[0]
	// let s2=result[1]
	let [s1,s2]=result
	return(s1==s2)
}

function validAAA (str) {
	var result=str.split(/\s+/)
	if (result.length!=3) {throw new Error(`str${str} must have three value`)};
	// var {s1,s2,s3}=result
	// let s1=result[0]
	// let s2=result[1]
	// let s3=result[2]
	let [s1,s2,s3]=result
	return s1==s2 && s2==s3
}

function valid4A (str) {
	var result=str.split(/\s+/)
	if (result.length!=4) {throw new Error(`str${str} must have three value`)};
	// var {s1,s2,s3}=result
	// let s1=result[0]
	// let s2=result[1]
	// let s3=result[2]
	let [s1,s2,s3,s4]=result
	return s1==s2 && s2==s3 && s3==s4
}

function validABC(str){
	if (!str) {
		throw new Error('str is null or undefined')
	}
	var result=str.split(/\s+/)
	if (result.length!=3) {throw new Error('str must have three value')};
	let [s1,s2,s3] = result
	//判断首字母是否相同以及 是否是1，2，3这样的顺序
	let isABC = (s2[1]-1==s1[1] && s3[1]-1 == s2[1]) && (s1[0]==s2[0] && s2[0]==s3[0])
	return isABC
}
