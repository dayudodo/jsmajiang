var React = require('react');
var ReactDOM = require('react-dom');
// var _ = require('lodash');
import io from 'socket.io-client'
import Images from './Images';
import PlayerImages from './PlayerImages';


var Play=React.createClass({
  getInitialState() {
      return {
            status: '服务器已经断开'
          , text: ''
          , chatText: ''
          , username: ''
          , ready: false
          , ArrayPlayer: []
          , left_info: ''
          , info_room: ''
          , results: []
          , tablePai: ''
          , paiFromTable: ''
      };
  },
  onChange:function(e){
      this.setState({ text: e.target.value })
  },
  chatChange:function(e){
      this.setState({ chatText: e.target.value })
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
  handleChatSubmit:function(e){
    e.preventDefault()
    let isEmpty = this.state.chatText.replace(/\s+/g).length == 0
    if (isEmpty) { 
      alert("用户名不能为空") 
    }else {
      this.socket.emit('chat_cast',{
         username: this.state.username
       , chatText: this.state.chatText
      })
    }
  },
  startGame: function(){
    // console.log(this.state.username + "ready_server")
    this.socket.emit('ready_server')
  },
  show_info_room:function(ArrayPlayer){
    let filtered = ArrayPlayer.filter(item=>item.username!=this.state.username)
    let allNames= filtered.map(item=>item.username)
    this.setState({ info_room: allNames.join(',') + '进入房间' })
  },
  componentWillMount() {
      this.socket = io('http://localhost:3000');
      this.socket.on('connect',()=>{ this.setState({ status: '服务器连接成功'})})

      this.socket.on('disconnect',()=>{ 
        // this.setState({ 
        //     status: '服务器已经断开'
        //   , username: ''
        //   , info_room: ''
        //   , ready: false
        //   , results: []
        //   , left_info: ''
        //   , tablePai: ''
        // }) 
        this.setState( this.getInitialState() )
        
      })

      this.socket.on('player_left', (username)=>{ //用户离开的时候会给服务器发信息，服务器也会广播player_left
        this.setState({ left_info: username})
        setTimeout(()=>{ this.setState({ left_info: ''}) }, 2000)
      })

      this.socket.on('room_full',()=>{ this.setState({ info_room: '房间已满'})})

      this.socket.on('joined', (ArrayPlayer)=>{ 
        this.show_info_room(ArrayPlayer)
      })

      this.socket.on('login',(ArrayPlayer)=>{ 
        this.setState({username: this.state.text }) 
        this.show_info_room(ArrayPlayer)
      })

      this.socket.on('room_enter',(info)=>{
        console.log("new user entered", info)
      })
      this.socket.on('chat_cast',(info)=>{
        console.log("%s : %s", info.username, info.chatText)
      })

      this.socket.on('ready_client', (info)=>{
        this.setState({ 
            ready: true
          , status: this.state.username +'已准备，等待其它玩家加入'
        })
        console.log('%s is ready to start', info)
      })

      this.socket.on('game_start', (serverData)=>{
        this.setState({ 
            status: '游戏开始'
          , results: serverData
        })
      })
      this.socket.on('dapai', (one_pai)=>{ this.setState({ tablePai: one_pai}) })
      this.socket.on('table_fa_pai', (one_pai)=>{ this.setState({ paiFromTable: one_pai}) })
  },
  handleImgClick( item,index ){
    // console.log( 'user clicked, item:%s index:%s', item, index )
    let results = this.state.results.remove(item)
    this.setState({ 
        results: results
    })
    this.socket.emit('dapai', item)
  },
  render: function(){
     return(
       <div>
        <h1>{ this.state.status }</h1>
        <h1>  { this.state.info_room }  
              { this.state.left_info.length==0 ? null : '|'+this.state.left_info+'已经离开'}
        </h1>
        { (this.state.username.length == 0) ? 
           <form onSubmit={ this.handleSubmit }  >
             用户名：<input onChange={ this.onChange } value={ this.state.text } /> 
           </form> : 
           <div>{ this.state.username } 登入
             { this.state.ready? null : <button onClick={ this.startGame }>开始</button> }
             <form onSubmit={ this.handleChatSubmit }  >
             发信息：<input onChange={ this.chatChange } value={ this.state.chatText } /> 
             </form>
           </div>
        }
        <center><Images results={ [this.state.tablePai] } /></center>
        <PlayerImages results={ this.state.results.sort() } imgClick={ this.handleImgClick }/>
        <Images results={ [this.state.paiFromTable] } />
       </div>
     );
  }
});

module.exports = Play