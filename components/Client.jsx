var React = require("react");
var ReactDOM = require("react-dom");
// var _ = require('lodash');
import io from "socket.io-client";
import Images from "./Images";
import PlayerImages from "./PlayerImages";
import * as config from "./../config";
import _ from "lodash";

// var can_da_pai = false //客户端能否打牌，是由服务器发牌所改变

var Play = React.createClass({
  getInitialState() {
    return {
      status: "服务器已经断开",
      text: "",
      chatText: "",
      username: "",
      ready: false,
      can_da_pai: false,
      ArrayPlayer: [],
      left_info: "",
      info_room: "",
      results: [],
      tablePai: [],
      paiFromTable: [],
      room_name: "",
      room_id: "roomAnge",
      player_names: ""
    };
  },
  propTypes: {
    results: React.PropTypes.array,
    tablePai: React.PropTypes.array,
    paiFromTable: React.PropTypes.array
  },
  onChange: function(e) {
    this.setState({ text: e.target.value });
  },
  onRoomChange(e) {
    this.setState({ room_id: e.target.value });
  },
  chatChange: function(e) {
    this.setState({ chatText: e.target.value });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    let isUsernameEmpty = this.state.text.replace(/\s+/g).length == 0;
    if (isUsernameEmpty) {
      alert("用户名不能为空");
    } else {
      //登录之后再选择房间号的！
      this.socket.emit("login", {
        username: this.state.text
      });
      //监听服务器的login事件，有则成功登录服务器
      this.socket.on("login", () => {
        this.setState({ username: this.state.text });
        // this.show_info_room(ArrayPlayer);
      });
    }
  },
  //给服务器发消息，要创建一个房间，同时可以把接收服务器的消息放在这儿，权当是返回值了！放在一起其实更好阅读
  create_room() {
    this.socket.emit("create_room", data => {
      if (data.error) {
        alert(data.error);
      } else {
        this.setState({ room_name: data.room_name });
      }
    });
    // //服务器已经创建好房间，但是貌似多次执行后会重复的接收
    // this.socket.once("server_made_room", room_name => {});
    // //没有可用的房间了
    // this.socket.once("server_room_sold_out", () => {
    //   alert("很抱歉，无可用房间，请联系客服！");
    // });
  },
  join_room() {
    let isRoomTextEmpty = this.state.room_id.replace(/\s+/g).length == 0;
    if (isRoomTextEmpty) {
      alert("房间号不能为空");
    } else {
      //玩家想要加入房间room_id, 给服务器发join_room消息，并带有房间号数据
      //因为服务器的连接中保存了相关了用户信息，所以并不需要再传递用户名
      console.log("room_id:", this.state.room_id);
      this.socket.emit("join_room", this.state.room_id);
    }
  },
  handleChatSubmit: function(e) {
    e.preventDefault();
    let isChatTextEmpty = this.state.chatText.replace(/\s+/g).length == 0;
    if (isChatTextEmpty) {
      alert("用户名不能为空");
    } else {
      this.socket.emit("chat_cast", {
        username: this.state.username,
        chatText: this.state.chatText
      });
    }
  },
  startGame: function() {
    console.log(this.state.username + " click startGame");
    this.socket.emit("player_ready", data => {
      console.log(`我自己准备好了`);
      this.setState({ ready: true });
    });
  },
  show_info_room: function(ArrayPlayer) {
    let filtered = ArrayPlayer.filter(
      item => item.username != this.state.username
    );
    let allNames = filtered.map(item => item.username);
    this.setState({ info_room: allNames.join(",") + "进入房间" });
  },
  componentWillMount() {
    this.socket = io(`http://localhost:${config.PORT}`);
    this.socket.on("connect", () => {
      this.setState({ status: "服务器连接成功" });
    });

    this.socket.on("disconnect", () => {
      // this.setState({
      //     status: '服务器已经断开'
      //   , username: ''
      //   , info_room: ''
      //   , ready: false
      //   , results: []
      //   , left_info: ''
      //   , tablePai: ''
      // })
      this.setState(this.getInitialState());
    });

    this.socket.on("player_left", username => {
      //用户离开的时候会给服务器发信息，服务器也会广播player_left
      this.setState({ left_info: username });
      setTimeout(() => {
        this.setState({ left_info: "" });
      }, 2000);
    });

    this.socket.on("server_room_full", () => {
      this.setState({ info_room: "房间已满" });
    });
    this.socket.on("server_no_such_room", room_name => {
      alert(`无此房间号:${room_name}`);
    });

    //接收服务器发来的room_enter消息，表明服务器已经将本玩家加入房间中。
    this.socket.on("server_player_enter_room", data => {
      console.log(`进入房间的玩家们：${data.player_names}`);
      this.setState({
        player_names: data.player_names,
        room_name: data.room_name
      });
    });

    this.socket.on("server_chat_cast", info => {
      console.log("%s : %s", info.username, info.chatText);
    });

    this.socket.on("server_receive_ready", username => {
      this.setState({
        status: username + "已准备"
      });
      // console.log("%s 准备开始", username);
    });

    this.socket.on("server_game_start", serverData => {
      this.setState({
        status: "游戏开始",
        results: serverData.sort()
      });
    });
    this.socket.on("dapai", one_pai => {
      this.setState({ tablePai: one_pai });
    });
    this.socket.on("table_fa_pai", pai => {
      // 服务器发牌后添加到手牌最后, 客户端设置个能否打牌的标识
      // can_da_pai = true
      let results = this.state.results.concat(pai);
      this.setState({ results: results, can_da_pai: true });
    });
    this.socket.on("game over", () => {
      this.setState({
        ready: false,
        results: [],
        tablePai: []
      });
    });
  },
  handleImgClick(item, index) {
    // console.log( 'user clicked, item:%s index:%s', item, index )
    // 如果有服务器发的牌，你可以打出一张，否则就不能打
    let results = this.state.results;
    if (this.state.can_da_pai) {
      // can_da_pai = false
      results.remove(item).sort();
      this.setState({ results: results, can_da_pai: false });
      this.socket.emit("dapai", [item]);
    }
  },
  render: function() {
    let isRoomValid = this.state.room_name.length != 0;
    return (
      <div>
        <h1>{this.state.status}</h1>
        <h1>
          {" "}
          {this.state.info_room}
          {this.state.left_info.length == 0
            ? null
            : "|" + this.state.left_info + "已经离开"}
        </h1>
        {this.state.username.length == 0 ? (
          <form onSubmit={this.handleSubmit}>
            用户名：<input onChange={this.onChange} value={this.state.text} />
          </form>
        ) : (
          <div>
            {this.state.username} 登入，房间内全部玩家：{
              this.state.player_names
            }
            <form onSubmit={this.handleChatSubmit}>
              发信息：<input
                onChange={this.chatChange}
                value={this.state.chatText}
              />
            </form>
            {isRoomValid ? (
              <div>
                房间名称：{this.state.room_name}
                {this.state.ready ? null : (
                  <button onClick={this.startGame}>开始</button>
                )}
              </div>
            ) : (
              <div className="room_staff">
                房间号：<input
                  onChange={this.onRoomChange}
                  value={this.state.room_id}
                />
                <button onClick={this.create_room}>创建房间</button>
                <button onClick={this.join_room}>加入房间</button>
              </div>
            )}
          </div>
        )}
        <center>{this.state.can_da_pai ? "请出牌" : ""}</center>
        <center>
          <Images results={this.state.tablePai} />
        </center>
        <PlayerImages
          results={this.state.results}
          imgClick={this.handleImgClick}
        />
      </div>
    );
  }
});

module.exports = Play;
