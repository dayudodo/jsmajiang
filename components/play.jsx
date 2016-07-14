var React = require('react');
var ReactDOM = require('react-dom');
// var _ = require('lodash');
import io from 'socket.io-client'
import PlayerImages from './PlayerImages';



var Play=React.createClass({
  getInitialState() {
      return {
            status: 'disconnect'
          , player: ''
          , username:''
      };
  },
  onChange:function(e){
      this.setState({ username: e.target.value })
  },
  handleSubmit: function(e){
    e.preventDefault()
    this.socket.emit('player',{
      username: this.state.username
    })
  },
  componentWillMount() {
      this.socket = io('http://localhost:3000');
      this.socket.on('connect',()=>{ this.setState({ status: '服务器连接成功'})})
      this.socket.on('disconnect',()=>{ this.setState({ status: '服务器已经断开'})})
      this.socket.on('joined',(serverState)=>{ this.setState({ player: serverState.id })} )
      this.socket.on('room_full',()=>{ this.setState({ status: '房间已满'})})
  },
  render: function(){


     return(
       <div>
        <h1>{ this.state.player}{ this.state.status }</h1>
        <form onSubmit={this.handleSubmit}>
          用户名：<input onChange={this.onChange} value={this.state.username} /> 
        </form>
        <PlayerImages results={ ['b1','b2','b3','b4','zh','zh','fa','fa'] } />
       </div>
     );
  }
});

module.exports = Play