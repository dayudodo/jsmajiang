var React = require("react");
var ReactDOM = require("react-dom");
// var _ = require('lodash');
import io from "socket.io-client";
import Images from "./Images";
import PlayerImages from "./PlayerImages";
import * as config from "./../config";
import _ from "lodash";
import { Majiang } from "../server/Majiang";

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
      room_id: "rose",
      player_names: "",
      show_peng: false,
      show_gang: false,
      show_btn_hu: false,
      show_btn_guo: false,
      show_btn_ting: false,
      show_btn_liang: false,
      is_ting: true,
      waitText: config.MaxWaitTime
    };
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
      this.client.emit("login", {
        username: this.state.text
      });
      //监听服务器的login事件，有则成功登录服务器
      this.client.on("login", () => {
        this.setState({ username: this.state.text });
        // this.show_info_room(ArrayPlayer);
      });
    }
  },
  //给服务器发消息，要创建一个房间，同时可以把接收服务器的消息放在这儿，权当是返回值了！放在一起其实更好阅读
  create_room() {
    this.client.emit("create_room", data => {
      if (data.error) {
        alert(data.error);
      } else {
        this.setState({ room_name: data.room_name });
      }
    });
    // //服务器已经创建好房间，但是貌似多次执行后会重复的接收
    // this.client.once("server_made_room", room_name => {});
    // //没有可用的房间了
    // this.client.once("server_room_sold_out", () => {
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
      this.client.emit("join_room", this.state.room_id);
    }
  },
  handleChatSubmit: function(e) {
    e.preventDefault();
    let isChatTextEmpty = this.state.chatText.replace(/\s+/g).length == 0;
    if (isChatTextEmpty) {
      alert("用户名不能为空");
    } else {
      this.client.emit("chat_cast", {
        username: this.state.username,
        chatText: this.state.chatText
      });
    }
  },
  startGame: function() {
    console.log(this.state.username + " click startGame");
    this.client.emit("player_ready", data => {
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
  confirm_peng() {
    //决定碰牌
    this.wantToPengPai = true;
    //清除两个计时器，并且隐藏可以碰的按钮
    clearInterval(this.intervalOneSecond);
    clearTimeout(this.timeout);
    //别人打的牌应该消失，跑到自己的手牌之中
    //碰牌后先把牌拿过来，再打一张牌！并且隐藏碰文字
    let new_shouPai = this.state.results.concat(this.state.tablePai);
    this.setState({
      tablePai: [],
      results: new_shouPai,
      show_peng: false,
      show_btn_guo: false,
      can_da_pai: true
    });
    this.client.emit("confirm_peng");
  },
  confirm_gang() {
    //决定杠牌
    this.wantToGangPai = true;
    clearInterval(this.intervalOneSecond);
    clearTimeout(this.timeout);
    //别人打的牌应该消失，跑到自己的手牌之中
    //碰牌后先把牌拿过来，再打一张牌！并且隐藏碰文字
    let new_shouPai = this.state.results.concat(this.state.tablePai);
    this.setState({
      tablePai: [],
      results: new_shouPai,
      show_peng: false,
      show_gang: false,
      show_btn_guo: false,
      can_da_pai: true
    });
    this.client.emit("confirm_gang");
  },
  confirm_ting() {
    //决定听牌，能听就一定能亮
    this.wantToTing = true;
    clearInterval(this.intervalOneSecond);
    clearTimeout(this.timeout);
    console.log(`${this.state.username} 选择听牌`);
    //选择听之后，听按钮并不消失，表明用户在听的状态中， 不应该再能打牌了，直到胡或者别人胡！
    this.setState({
      show_btn_liang: false,
      show_btn_guo: false,
      show_btn_hu: false,
      can_da_pai: false
    });
    this.client.emit("confirm_ting");
  },
  //决定亮牌
  confirm_liang() {
    this.wantToLiang = true;
    clearInterval(this.intervalOneSecond);
    clearTimeout(this.timeout);
    console.log(`${this.state.username} 选择亮牌`);
    this.setState({
      show_btn_guo: false,
      show_btn_hu: false,
      show_btn_liang: false
    });
    this.client.emit("confirm_liang");
  },
  confirm_hu() {
    //决定胡牌
    this.wantToHu = true;
    clearInterval(this.intervalOneSecond);
    clearTimeout(this.timeout);
    console.log(`${this.state.username}选择胡牌${this.state.tablePai[0]}`);
    this.setState({
      show_peng: false,
      show_gang: false,
      show_btn_guo: false,
      show_btn_hu: false,
      can_da_pai: false
    });
    this.client.emit("confirm_hu");
  },
  confirm_guo() {
    clearInterval(this.intervalOneSecond);
    clearTimeout(this.timeout);
    console.log(`${this.state.username}选择过牌${this.state.tablePai[0]}`);
    //所有的选择按钮关掉
    this.setState({
      show_peng: false,
      show_btn_ting:false,
      show_btn_liang:false,
      show_gang: false,
      show_btn_hu: false,
      show_btn_guo: false
    });
    this.client.emit("confirm_guo");
  },
  componentWillMount() {
    this.client = io(`http://localhost:${config.PORT}`);
    this.client.on("connect", () => {
      this.setState({ status: "服务器连接成功" });
    });

    this.client.on("disconnect", () => {
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

    this.client.on("player_left", username => {
      //用户离开的时候会给服务器发信息，服务器也会广播player_left
      this.setState({ left_info: username });
      setTimeout(() => {
        this.setState({ left_info: "" });
      }, 2000);
    });

    this.client.on("server_room_full", () => {
      this.setState({ info_room: "房间已满" });
    });
    this.client.on("server_no_such_room", room_name => {
      alert(`无此房间号:${room_name}`);
    });

    //接收服务器发来的room_enter消息，表明服务器已经将本玩家加入房间中。
    this.client.on("server_player_enter_room", data => {
      console.log(`进入房间的玩家们：${data.player_names}`);
      this.setState({
        player_names: data.player_names,
        room_name: data.room_name
      });
    });

    this.client.on("server_chat_cast", info => {
      console.log("%s : %s", info.username, info.chatText);
    });

    this.client.on("server_receive_ready", username => {
      this.setState({
        status: username + "已准备"
      });
      // console.log("%s 准备开始", username);
    });

    this.client.on("server_game_start", serverData => {
      this.setState({
        status: "游戏开始",
        results: serverData.sort()
      });
    });
    this.client.on("server_dapai", pai_name => {
      this.setState({ tablePai: [pai_name] });
    });

    this.client.on("server_winner", (username, hupaiNames) => {
      console.log("%s 胡牌，胡牌计算: ", username, hupaiNames);
    });

    //todo: 可以亮牌，如果检测出来是大胡，还会有个听牌的监听，会有重复！
    this.client.on("server_canLiang", () => {
      // console.log("可以亮牌！");
      this.setState({
        show_btn_liang: true,
        show_btn_guo: true
      });
      this.intervalOneSecond && clearInterval(this.intervalOneSecond);
      this.intervalOneSecond = setInterval(() => {
        this.setState({ waitText: this.state.waitText - 1 });
      }, config.CountDownInterval);
      this.timeout = setTimeout(() => {
        clearInterval(this.intervalOneSecond);
        if (!this.wantToLiang  && !this.wantToTing) {
          //10秒之后，玩家也没有点击想碰牌,就当一切没发生过,服务器继续给下一个玩家发牌!
          this.setState({ show_btn_guo: false, show_btn_liang: false });
          console.log(`client${this.state.username}亮牌放弃`);
          let reason = "亮牌"
          this.client.emit("confirm_guo", reason);
        }
      }, config.MaxWaitTime * 1000);
    });

    //玩家可以听牌，那还可以亮牌，能听就能亮，一起的。
    this.client.on("server_canTing", () => {
      console.log("本人可以听牌了，运气不错");
      this.setState({
        show_btn_ting: true,
        show_btn_liang: true,
        show_btn_guo: true
      });
      this.intervalOneSecond && clearInterval(this.intervalOneSecond);
      this.intervalOneSecond = setInterval(() => {
        this.setState({ waitText: this.state.waitText - 1 });
      }, config.CountDownInterval);
      this.timeout = setTimeout(() => {
        clearInterval(this.intervalOneSecond);
        if (!this.wantToTing && !this.wantToLiang) {
          //10秒之后，玩家也没有点击想碰牌,就当一切没发生过,服务器继续给下一个玩家发牌!
          this.setState({
            show_btn_ting: false,
            show_btn_liang: false,
            show_btn_guo: false
          });
          console.log(`client${this.state.username}听牌放弃`);
          let reason  = "听牌"
          this.client.emit("confirm_guo", reason);
        }
      }, config.MaxWaitTime * 1000);
    });

    this.client.on("server_canHu", () => {
      this.setState({
        show_btn_guo: true,
        show_btn_hu: true,
        waitText: config.MaxWaitTime
      });
      this.intervalOneSecond && clearInterval(this.intervalOneSecond);
      this.intervalOneSecond = setInterval(() => {
        this.setState({ waitText: this.state.waitText - 1 });
      }, config.CountDownInterval);
      //等待10秒用户反应，其实服务器也应该等待10秒钟，如果超时就不会再等了。
      this.timeout = setTimeout(() => {
        clearInterval(this.intervalOneSecond);
        if (!this.wantToHu) {
          //10秒之后，玩家也没有点击想碰牌,就当一切没发生过,服务器继续给下一个玩家发牌!
          this.setState({ show_btn_guo: false, show_btn_hu: false });
          console.log(`client${this.state.username}胡牌放弃`);
          let reason = "胡牌"
          this.client.emit("confirm_guo", reason);
        }
      }, config.MaxWaitTime * 1000);
    });

    this.client.on("server_canGang", pai => {
      this.setState({
        show_peng: true,
        show_gang: true,
        show_btn_guo: true,
        waitText: config.MaxWaitTime
      });
      //有可能以前的读秒器还没有删除
      this.intervalOneSecond && clearInterval(this.intervalOneSecond);
      //倒数读秒，等待用户点击碰
      this.intervalOneSecond = setInterval(() => {
        this.setState({ waitText: this.state.waitText - 1 });
      }, config.CountDownInterval);
      //等待10秒用户反应，其实服务器也应该等待10秒钟，如果超时就不会再等了。
      this.timeout = setTimeout(() => {
        clearInterval(this.intervalOneSecond);
        if (!this.wantToGangPai) {
          //10秒之后，玩家也没有点击想碰牌,就当一切没发生过,服务器继续给下一个玩家发牌!
          this.setState({ show_peng: false, show_gang: false });
          console.log(`client${this.state.username}杠牌${pai}放弃`);
          let reason = "杠牌"
          this.client.emit("confirm_guo",reason);
        }
      }, config.MaxWaitTime * 1000);
    });

    this.client.on("server_canPeng", pai => {
      this.setState({
        show_peng: true,
        show_btn_guo: true,
        waitText: config.MaxWaitTime
      });
      //有可能以前的读秒器还没有删除
      this.intervalOneSecond && clearInterval(this.intervalOneSecond);
      //倒数读秒，等待用户点击碰
      this.intervalOneSecond = setInterval(() => {
        this.setState({ waitText: this.state.waitText - 1 });
      }, config.CountDownInterval);
      //等待10秒用户反应，其实服务器也应该等待10秒钟，如果超时就不会再等了。
      this.timeout = setTimeout(() => {
        clearInterval(this.intervalOneSecond);
        if (!this.wantToPengPai) {
          //10秒之后，玩家也没有点击想碰牌,就当一切没发生过,服务器继续给下一个玩家发牌!
          this.setState({ show_peng: false });
          console.log(`client${this.state.username}碰牌${pai}放弃`);
          let reason = "碰牌"
          this.client.emit("confirm_guo", reason);
        }
      }, config.MaxWaitTime * 1000);
    });

    this.client.on("server_table_fapai", pai => {
      // 服务器发牌后添加到手牌最后, 客户端设置个能否打牌的标识
      console.log("接收到服务器发牌%s", pai[0]);
      let results = this.state.results.concat(pai);
      this.setState({ results: results, can_da_pai: true });
    });

    this.client.on("game over", () => {
      this.setState({
        ready: false,
        results: [],
        tablePai: []
      });
    });
  },
  clientDaPai(pai, index) {
    // console.log( 'user clicked, pai:%s index:%s', pai, index )
    // 如果有服务器发的牌，你可以打出一张，否则就不能打
    let results = this.state.results;
    if (this.state.can_da_pai) {
      // can_da_pai = false
      results.remove(pai).sort();
      this.setState({ results: results, can_da_pai: false });
      this.client.emit("dapai", pai);
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
                {this.state.show_gang ? (
                  <button onClick={this.confirm_gang}>
                    杠{this.state.waitText}
                  </button>
                ) : null}
                {this.state.show_peng ? (
                  <button onClick={this.confirm_peng}>
                    碰{this.state.waitText}
                  </button>
                ) : null}
                {this.state.show_btn_ting ? (
                  <button onClick={this.confirm_ting}>
                    听{this.state.waitText}
                  </button>
                ) : null}
                {this.state.show_btn_liang ? (
                  <button onClick={this.confirm_liang}>
                    亮{this.state.waitText}
                  </button>
                ) : null}
                {this.state.show_btn_hu ? (
                  <button onClick={this.confirm_hu}>
                    胡牌{this.state.waitText}
                  </button>
                ) : null}
                {this.state.show_btn_guo ? (
                  <button onClick={this.confirm_guo}>
                    过{this.state.waitText}
                  </button>
                ) : null}
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
          imgClick={this.clientDaPai}
        />
      </div>
    );
  }
});

module.exports = Play;
