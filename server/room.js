import _ from "lodash";
import * as config from "./../config";

//以前还不熟悉如何复制一个数组
Array.prototype.repeat = function(times) {
  var result = [];
  for (var i = 0; i < times; i++) {
    this.map(item => {
      result.push(item);
    });
  }
  return result;
};

const BING = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"];
const TIAO = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"];
// 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
const ZHIPAI = ["zh", "fa", "di"];

let all_single_pai = BING.concat(TIAO).concat(ZHIPAI);
let all_pai = BING.repeat(4)
  .concat(TIAO.repeat(4))
  .concat(ZHIPAI.repeat(4));
let table_random_pai = _.shuffle(all_pai);

// let clone_pai = _.clone(table_random_pai).splice(0,45) // 全局变量，开发时记得重启，开发时使用45张牌
// let clone_pai =

let room_valid_names = ["ange", "jack", "rose"];
//用户自然是属于一个房间，房间里面有几个人可以参加由房间说了算
export class Room {
  constructor() {
    // this.allowed_users_count
    //应该是唯一的，用户需要根据这个id进入房间
    this.id = null;
    this.players = [];
    this.all_pai = [];
  }
  //创建一个唯一的房间号，其实可以用redis来生成一个号，就放在内存里面
  static make() {
    //暂时用模拟的功能，每次要创建的时候，其实都是用的数组中的一个名称
    return room_valid_names.pop();
  }
  //用户加入房间，还需要告诉其它的用户我已经加入了
  join_player(person) {
    this.players.push(person);
    // tellOtherPeopleIamIn();
  }
  exit_room(socket) {
    _.remove(this.players, function(item) {
      return item.socket.id == socket.id;
    });
  }
  get_player(socket_id) {
    // _.find(this.players, {socket_id: socket_id})
    this.players.find(p => p.socket_id == socket_id);
  }
  get all_ready() {
    let player_ready_count = this.players.filter(item => item.ready).length;
    console.log(`房间:${this.id}内玩家准备开始计数：${player_ready_count}`);
    return player_ready_count == config.LIMIT_IN_ROOM;
  }
  get players_count() {
    return this.players.length;
  }
  get all_player_names() {
    return this.players.map(person => {
      return person.username;
    });
  }
  start_game() {
    //初始化牌面
    this.all_pai = _.clone(table_random_pai);
    //开始给所有人发牌，并给东家多发一张
    let dongJia = _.find(this.players, { east: true });
    this.players.forEach(p => {
      if (p == dongJia) {
        //告诉东家，服务器已经开始发牌了
        p.socket.emit("server_game_start", this.all_pai.splice(0, 13));
        let fa_pai = this.all_pai.splice(0, 1); //然后再发一张牌给东家
        console.log("服务器发牌：%s", fa_pai);
        //告诉房间的其它人，发的是啥牌
        p.socket.emit("server_table_fa_pai", fa_pai);
      } else {
        p.socket.emit("server_game_start", this.all_pai.splice(0, 13));
      }
    });
  }

  end_game() {}
  //有用户掉线就需要暂停游戏，但是时间不能太长，
  pause_game() {}
  //继续游戏，哪个掉线后需要发送其掉线前的数据
  resume_game() {}
}
