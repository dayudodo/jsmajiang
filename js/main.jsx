import React from 'react';
import ReactDOM from 'react-dom';

import Images from './components'

var MJInput=React.createClass({
 getInitialState:function(){
 	return {
 		text: ''
 	  , single: ''
 	  , results: []
    , paiCount: 0
    , userAnswer:[]
    , isCorrect: false
 	}
 },
 onChange:function(e){
 	this.setState({text: e.target.value})
 },
 sendMe: function(item){
    // console.log(item)
    // let all_pai_clone = [].concat(all_single_pai)
    // all_pai_clone.remove(item)
    let userAnswer = this.state.userAnswer
    userAnswer.push(item)
    userAnswer = userAnswer.sort()
    this.setState({userAnswer})
 },
 handleSubmit: function(e){
 	e.preventDefault()
 	// this.setState({single: imgSrc})
 	if (this.state.text || this.state.text=='') {
    let results = checkValidAndReturnArr(this.state.text)
		this.setState( {results} )
    this.setState({paiCount: results.length})
	}
  this.redo();
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
    }
  }
 },
 redo:function(){
  //这儿就能体现出react的好处了，改变状态即可，界面自动变化！
   this.setState({userAnswer: []})
   this.setState({isCorrect: false})
 },
 render: function(){
    return(
      <div>
            <h2>有如下一手牌</h2>
              <form onSubmit={this.handleSubmit}>
                <input onChange={this.onChange} value={this.state.text} /> 一共{ this.state.paiCount }张牌，自动排序为:{ this.state.results.join(' ')}
              </form>
              <Images results={this.state.results} />
              <h2>胡哪些牌呢？<button onClick={this.redo}>重选</button> </h2> 
              <Images results={all_single_pai} canClick={true} lineBreak={12} sendMe={this.sendMe}/>
              <h2>我的答案：</h2>
              <Images results={this.state.userAnswer}  />
              <button onClick={this.IamSure}>确定</button>
              { this.state.isCorrect? <h1>回答正确</h1>:null }

      </div>
   )
 }
});

ReactDOM.render( <MJInput />,  document.getElementById('app') );