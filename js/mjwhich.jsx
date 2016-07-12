import React from 'react';
import ReactDOM from 'react-dom';
import Images from './Images'

import LevelData from './level_data';
let all_level = []
for(let item in LevelData){
  all_level = all_level.concat(LevelData[item])
}

let firstChangeText= true;
let nextShouPaiWaitTime = 1;


var MJWhich=React.createClass({
    // mixins: [TimerMixin],
    getInitialState:function(){
    // let all_level= 
    	return {
    		  text: all_level[0]
    	  , single: ''
    	  , results: []
    , paiCount: 0
    , userAnswer:[]
    , isCorrect: false
    , index : 0
    , all_level_data: all_level
    	}
    },
 onChange:function(e){
   	this.setState({ text: e.target.value })
 },
 sendMeToUser: function(item){
    // console.log(item)
    // let all_pai_clone = [].concat(all_single_pai)
    // all_pai_clone.remove(item)
    let userAnswer = this.state.userAnswer
    userAnswer.push(item)
    userAnswer = userAnswer.sort()
    this.setState({userAnswer})
 },
 changeTextAndMakeResults:function(){
    if ( this.state.text || this.state.text !='') {
      let results = checkValidAndReturnArr(this.state.text)
      this.setState({ results })
      this.setState({ paiCount: results.length })
    }
    this.redo();
 },
 handleSubmit: function(e){
 	e.preventDefault()
 	// this.setState({single: imgSrc})
  this.changeTextAndMakeResults();
 },
 IamSure: function(){
  // console.log('sure')
    let hu_pai_zhang = whoIsHu(this.state.results)
    console.log("hu_pai_zhang",hu_pai_zhang)
    if (hu_pai_zhang) {
      let isCorrect = hu_pai_zhang.equalArrays(this.state.userAnswer)
      if(isCorrect)
      {
        this.setState({isCorrect})
        setTimeout(this.nextShouPai,nextShouPaiWaitTime * 1000)

      }
    }
 },
 deleteMe:function(item){ //从项目中删除某一项
   var userAnswer = this.state.userAnswer;
   userAnswer.remove(item)
   userAnswer = userAnswer.sort()
   this.setState({userAnswer})
 },
 redo:function(){
  //这儿就能体现出react的好处了，改变状态即可，界面自动变化！
   this.setState({userAnswer: []})
   this.setState({isCorrect: false})
 },
 asShouPai:function(){
  this.setState({results: this.state.userAnswer})
 },
 prevShouPai:function(){
  // console.log(level["1"]) //或者就来个随机的
  let index = this.state.index
  let all_level_data = this.state.all_level_data
  if (index==0) {
    index = all_level_data.length -1
  }else
  {
    -- index
  }
  this.setState({index})
  let text = all_level_data[index]
  this.setState({text },function(){
    this.changeTextAndMakeResults()
  })
 },
 nextShouPai:function(){
    let index = this.state.index
    let all_level_data = this.state.all_level_data
    if (index==all_level_data.length -1) {
      index = 0
    }else
    {
      ++ index
    }
    this.setState({index})
    let text = all_level_data[index]
    this.setState({text },function(){
      this.changeTextAndMakeResults()
    })
 },
 randomPai(times){
  //给用户出牌多一个，即在userAnswer里面多添加一张牌，不过不能超过4张？
  let how_many= all_single_pai.length-1
  var userAnswer = this.state.userAnswer;
  var added = [];
  if (userAnswer.length!=14) {
    for (var i = 0; i < times; i++) {
       let index = Math.floor(Math.random()*how_many)
       added.push(all_single_pai[index]) 
    }
    userAnswer = userAnswer.concat(added).sort()
  }
  this.setState({userAnswer})

 },
 componentWillMount:function(){
    if (firstChangeText) {
      console.log(this.state.text)
      this.changeTextAndMakeResults();
      firstChangeText = false;
    }
 },
 render: function(){
    return(
      <div>
            <h2>有如下一手牌
              <button onClick={this.prevShouPai}>上</button>
              <button onClick={this.nextShouPai}>下</button>
            </h2>
              <form onSubmit={this.handleSubmit}>
                <input onChange={this.onChange} value={this.state.text} /> 
                一共{ this.state.paiCount }张牌，自动排序为:{ this.state.results.join(' ')}
              </form>
              <Images results={this.state.results} />
              <h2>胡哪些牌呢？</h2> 
              <Images results={all_single_pai}  lineBreak={12} sendMeToUser={this.sendMeToUser}/>
              <h2>
                <button onClick={ this.randomPai.bind(null,13) }>随机一手牌</button>
                我的答案：
                <button onClick={ this.redo }>重选</button>
                <button onClick={ this.asShouPai }>作为手牌</button> 
                <button onClick={ this.randomPai.bind(null,1) }>发牌</button>
                一共{ this.state.userAnswer.length }张牌，{ this.state.userAnswer.join(' ')} 
              </h2>
              <Images results={ this.state.userAnswer }   deleteMe={ this.deleteMe } />
              <button onClick={ this.IamSure }>确定</button>
              { this.state.isCorrect? <h1>回答正确,{ nextShouPaiWaitTime }秒后下一题</h1>:null }

      </div>
   )
 }
});

module.exports = MJWhich;