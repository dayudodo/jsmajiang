var React = require('react');
var ReactDOM = require('react-dom');
// var _ = require('lodash');
import io from 'socket.io-client'
import PlayerImages from './PlayerImages';



var Play=React.createClass({
  getInitialState() {
      return {
            status: 'disconnect'
          , text: ''
          , username: ''
          , ArrayPlayer: []
          , info_room: ''
      };
  },
  onChange:function(e){
      this.setState({ text: e.target.value })
  },
  handleSubmit: function(e){
    e.preventDefault()
    let isEmpty = this.state.text.replace(/\s+/g).length == 0
    if (isEmpty) { 
      alert("用户名不能为空") 
    }else {
      this.socket.emit('player_enter',{
        username: this.state.text
      })
    }
  },
  startGame(){
    console.log(this.state.username + "start game")
    this.socket.emit('start game')
  },
  componentWillMount() {
      this.socket = io('http://localhost:3000');

      this.socket.on('connect',()=>{ this.setState({ status: '服务器连接成功'})})

      this.socket.on('disconnect',()=>{ 
        this.setState({ status: '服务器已经断开'}) 
        this.setState({ username: '', info_room: ''})
      })

      this.socket.on('room_full',()=>{ this.setState({ info_room: '房间已满'})})

      this.socket.on('joined', (ArrayPlayer)=>{ 
        let filtered = ArrayPlayer.filter(item=>item.username!=this.state.username)
        let allNames= filtered.map(item=>item.username)
        this.setState({ info_room: allNames.join(',') + '进入房间' })
      })

      this.socket.on('login',()=>{ this.setState({username: this.state.text }) })
  },
  render: function(){
    
     return(
       <div>
        <h1>{ this.state.status }</h1>
        <h1>{ this.state.info_room }</h1>
        { (this.state.username.length == 0) ? 
           <form onSubmit={this.handleSubmit}  >
             用户名：<input onChange={this.onChange} value={this.state.text} /> 
           </form> : 
           <div>{ this.state.username } 登入
             <button onClick={ this.startGame }>开始</button> 
           </div>
        }

        <PlayerImages results={ ['b1','b2','b3','b4','zh','zh','fa','fa'] } />
       </div>
     );
  }
});

module.exports = Play