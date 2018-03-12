var _ = require('lodash')
// import _ from 'lodash'

var users = [
  { 'user': 'barney',  'age': 36, 'active': true },
  { 'user': 'fred',    'age': 40, 'active': false },
  { 'user': 'ange',    'age': 39, 'active': false },
  { 'user': 'pebbles', 'age': 1,  'active': true }
];

var english=["this","that","what",'why']
var chinese=['这个','那个','什么','如何']


// console.log(_(users).remove({'active':true}).value())
// console.log(_.sample(english,2))
// console.log(_.without(users, { active:true}))
// console.log(_.remove(users, { active:true}))
// console.log(english.splice(english.indexOf('what'),1))
// console.log(english)
// console.log(_.remove(english, i=>i=='this'))
// console.log(english)
// console.log(_.remove(english,'this', english) )
// console.log(_.filter(english, 'this'))
// console.log(_.without(english,'this'))
// console.log(english)
// var zipped= _.zip(english,chinese)
// console.log(_.without(english, "what","why"))
// console.log(zipped)
// console.log(_.unzip(zipped))
// console.log(_.unzip([[1,2],[3,4]]))
// var SimpleUsers = [
//   { 'user': 'barney' },
//   { 'user': 'fred' },
//   { 'user': 'rose' },
//   { 'user': 'jack' }
// ];

// console.log(_.first(SimpleUsers))
// console.log(_.last(SimpleUsers))
// console.log(_.remove(SimpleUsers, {user: 'rose'}))
// console.log(_.remove(SimpleUsers, function(item){
// 	return item.user == 'rose'
// }))
// console.log(SimpleUsers)
// var anotherUsers = _.clone(SimpleUsers)
// console.log(anotherUsers[0]=== SimpleUsers[0])

// console.log(anotherUsers == SimpleUsers)
// console.log(_.sum(users,'age'))
// console.log(_.random(0,5))
// console.log(_.max(users,'age'))
// console.log(_.floor(60450,-2)) //60400
// console.log(_.floor(60450,-3)) //60000
// console.log(_.isArray(users))
// console.log(_.VERSION)
// console.log(_.isString(users[0].user)) //true
// console.log(_.isNumber(users[0].age)) //true
// console.log(_.isBoolean(users[0].active)) //true
// console.log(_.isObject(users[0])) //true
// console.log(_.isDate(new Date())) //true
// console.log(_.isEmpty('')) //true
// console.log(_.isFunction(()=>{})) //true
// console.log(_.isNaN(NaN)) //true
// console.log(_.toArray({ 'user': 'barney',  'age': 36, 'active': true }))
// console.log(_.toArray('string'))
// console.log(_.isRegExp(/\s+/))
// console.log(_.isElement('<html></html>'))
// console.log(_.findIndex(users, (user)=>{
// 	user.age == 1
// }))
// console.log( _.findWhere(users, {'active':true })) 
// users.forEach(item=>{
// 	console.log(item)
// })

// console.log(_.includes([1,2,3,'abc'],'abc'))
// console.log(_.includes('this is abc book','abc'))
// console.log(_.includes(users[2],'ange'))

// console.log( users.map(item=>item.user) )
// console.log(_.uniq(users, 'active'))
// console.log(_.fill(users, 'test'))
