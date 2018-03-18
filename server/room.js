import _ from "lodash";
import chalk from "chalk";
import * as config from "./../config";

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
    this.clone_pai = [];
    this.current_player_dapai = null; //当前玩家打的牌
    this.player_index = null; //哪个玩家在打牌，以便确定下一家
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
  //最后一位加入游戏的玩家
  get last_join_player() {
    return _.last(this.players);
  }
  get current_player() {
    return this.players[this.player_index];
  }
  get next_player() {
    ++this.player_index;
    let next_index = this.player_index % 3;
    return this.players[next_index];
  }
  //房间发一张给player, 主要是让player记录此次发牌
  fa_pai(player) {
    let pai = this.clone_pai.splice(0, 1);
    if (_.isEmpty(pai)) {
      throw new Error(chalk.red(`room.fa_pai中无可用牌了`));
    }
    player.receive_pai(pai[0]);
    return pai;
  }
  find_player_by_socket(socket) {
    return this.players.find(item => item.socket == socket);
  }
  da_pai(socket, pai) {
    let room_name = this.id;
    //首先向房间内的所有玩家显示出当前玩家打的牌
    socket.emit("dapai", pai);
    socket.to(room_name).emit("dapai", pai);
    let player = this.find_player_by_socket(socket);
    //帮玩家记录下打的是哪个牌
    player.da_pai(pai);
    //todo: 有没有人可以碰的？ 有人碰就等待10秒，这个碰的就成了下一家，需要打张牌！
    let next_player = this.next_player; //找到下一家，再发牌
    let isRoomPaiEmpty = this.clone_pai.length == 0;
    if (isRoomPaiEmpty) {
      socket.emit("game over");
      socket.to(room_name).emit("game over");
      //todo:告诉其它人哪个是赢家或者是平局
      // 牌要重新发了
      this.restart_game();
    } else {
      //发牌给下一个玩家
      let fa_pai = this.fa_pai(next_player);
      let c_next_player = _.clone(next_player);
      c_next_player.socket = 'hidden, 属于clone(next_player)'
      console.dir(c_next_player);
      console.log("服务器发牌 %s 给：%s", fa_pai, next_player.username);
      console.log("房间 %s 牌还有%s张", this.id, this.clone_pai.length);
      next_player.socket.emit("server_table_fa_pai", fa_pai);
    }
  }
  //玩家是否能碰牌
  can_peng(player, pai) {}
  start_game() {
    //初始化牌面
    this.clone_pai = _.shuffle(config.all_pai);
    //开始给所有人发牌，并给东家多发一张
    let dongJia = _.find(this.players, { east: true });
    if (!dongJia) {
      throw new Error(chalk.red("房间${id}没有东家，检查代码！"));
    }
    this.players.forEach((p, index) => {
      //玩家收到的牌保存好，以便服务器进行分析，每次都需要排序下，便于分析和查看
      p.shou_pai = this.clone_pai.splice(0, 13).sort();
      if (p == dongJia) {
        //告诉东家，服务器已经开始发牌了，房间还是得负责收发，玩家类只需要保存数据和运算即可。
        p.socket.emit("server_game_start", p.shou_pai);
        let fa_pai = this.fa_pai(p); //然后再发一张牌给东家
        this.player_index = index;
        console.log("服务器发牌：%s 给: %s", fa_pai, p.username);
        //告诉房间的其它人，发的是啥牌
        p.socket.emit("server_table_fa_pai", fa_pai);
      } else {
        p.socket.emit("server_game_start", p.shou_pai);
      }
    });
  }
  //游戏结束后重新开始游戏！
  restart_game() {
    //清空所有玩家的牌
    this.players.forEach(p => {
      p.shou_pai = null;
      p.ready = false;
      p.used_pai = [];
    });
    this.start_game();
  }

  end_game() {}
  //有用户掉线就需要暂停游戏，但是时间不能太长，
  pause_game() {}
  //继续游戏，哪个掉线后需要发送其掉线前的数据
  resume_game() {}
}
