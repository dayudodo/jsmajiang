import _ from "lodash";
import chalk from "chalk";
import { Majiang } from "./Majiang";
import * as config from "./../config";

let room_valid_names = ["ange", "jack", "rose"];
//用户自然是属于一个房间，房间里面有几个人可以参加由房间说了算
export class Room {
  constructor() {
    // this.allowed_users_count
    //应该是唯一的，用户需要根据这个id进入房间
    this.id = null;
    //房间内的所有玩家，人数有上限，定义在config.
    this.players = [];
    //房间内的牌
    this.clone_pai = [];
    //当前玩家，哪个打牌哪个就是当前玩家
    this.current_player = null;
    //todo: 是否接受用户的吃、碰，服务器在计时器，过时就不会等待用户确认信息了！
    this.can_receive_confirm = false;
    //当前桌子上的那张牌，发给玩家的那张，或者是用户打出来的会被人碰的。
    this.table_pai = null;

    //胡牌相关信息首先保存在房间之中，胡之后再保存到用户信息中！并在结束游戏的时候写入相关数据库！
    //下面两项与player中的属性是一样的！
    this.hupai_types = [];
    this.hupai_zhang = null;
  }

  //创建一个唯一的房间号，其实可以用redis来生成一个号，就放在内存里面
  static make() {
    //todo: 暂时用模拟的功能，每次要创建的时候，其实都是用的数组中的一个名称
    //正规的自然是要生成几个唯一的数字了，然后还要分享到微信之中让其它人加入
    //return room_valid_names.pop();
    return "rose";
  }
  //用户加入房间，还需要告诉其它的用户我已经加入了
  join_player(person) {
    this.players.push(person);
    // tellOtherPeopleIamIn();
  }
  //玩家选择退出房间，应该会有一定的惩罚，如果本局还没有结束
  exit_room(socket) {
    _.remove(this.players, function(item) {
      return item.socket.id == socket.id;
    });
  }
  find_player_by_socket(socket) {
    return this.players.find(item => item.socket == socket);
  }
  //玩家们是否都已经准备好开始游戏
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
  get next_player() {
    let next_index =
      (this.current_player.seat_index + 1) % config.LIMIT_IN_ROOM;
    //最后通过座位号来找到玩家,而不是数组序号,更不容易出错
    //直接使用数组索引即可
    // return this.players.find(p => p.seat_index == next_index);
    return this.players[next_index];
  }
  //除了person外的其它玩家们
  other_players(person) {
    // console.log("查找本玩家%s的其它玩家", person.username);
    let o_players = this.players.filter(p => p != person);
    // console.log(o_players.map(p => p.username));
    return o_players;
  }

  //玩家选择碰牌，或者是超时自动跳过！
  confirm_peng(io, socket) {
    let player = this.find_player_by_socket(socket);
    //碰之后此牌就属于本玩家了,前后台都需要添加!
    player.receive_pai(this.table_pai);
    //当前玩家顺序改变
    this.current_player = player;
  }
  //玩家选择杠牌，或者是超时自动跳过！其实操作和碰牌是一样的，名称不同而已。
  confirm_gang(io, socket) {
    this.confirm_peng(io, socket);
    //todo: 计算收益，杠牌是有钱的！
  }
  confirm_liang(io,socket){
    let player = this.find_player_by_socket(socket);
  }
  confirm_ting(io,socket){
    let player = this.find_player_by_socket(socket);
  }
  //玩家选择胡牌
  confirm_hu(io, socket) {
    let player = this.find_player_by_socket(socket);
    let room_name = this.id;
    //保存胡牌信息到玩家类中
    player.hupai_types = this.hupai_types;
    player.hupai_zhang = this.hupai_zhang;
    let hupaiNames = Majiang.HuPaiNamesFromArr(this.hupai_types)
    //告诉所有人哪个胡了
    io
      .to(room_name)
      .emit(
        "server_winner",
        player.username,
        hupaiNames
      );
    console.dir(player)
  }
  //玩家选择放弃，给下一家发牌
  confirm_guo(io, socket) {
    //如果用户是可以胡牌的时候选择过，那么需要删除这些胡牌的信息，或者保存在room中，胡了哪些东西！

    this.fa_pai(this.next_player);
  }

  //房间发一张给player, 让player记录此次发牌，只有本玩家能看到
  fa_pai(player) {
    let pai = this.clone_pai.splice(0, 1);
    //发牌的时候，桌面牌变化。
    this.table_pai = pai;
    if (_.isEmpty(pai)) {
      throw new Error(chalk.red(`room.pai中无可用牌了`));
    }
    //发牌给谁，谁就是当前玩家
    this.current_player = player;
    player.receive_pai(pai[0]);
    // let c_player = _.clone(player);
    // c_player.socket = "hidden, 属于clone(player)";
    // console.dir(c_player);
    console.log("服务器发牌 %s 给：%s", pai, player.username);
    console.log("房间 %s 牌还有%s张", this.id, this.clone_pai.length);
    player.socket.emit("server_table_fapai", pai);
    //发牌之后还要看玩家能否胡以及胡什么！
    // this.processHupai(player, pai, isZiMo);
    return pai;
  }
  //自摸，杠牌其实都需要有个标志。
  processHupai(player, pai, isZiMo) {
    let _hupai_types = Majiang.HupaiTypeCodeArr(player.shou_pai, pai);
    if (!_.isEmpty(_hupai_types)) {
      isZiMo ? _hupai_types.push(config.HuisZiMo) : null;
      player.hupai_types = _hupai_types;
      player.socket.emit("hupai", _hupai_types);
      player.socket.to(this.id).emit("hupai", _hupai_types);
    }
  }

  judge_ting(player){
    let hupai_types = Majiang.HuWhatPai(player.shou_pai)
    //亮牌是只要能胡就可以亮，屁胡的时候是不能听牌的！但是在客户端这样写总是有很多的重复！如何合并？
    if (hupai_types) {
      player.socket.emit('server_canLiang')
    }
    //只有在可以大胡的时候才能够听牌
    if (hupai_types && Majiang.isDaHu(hupai_types)) {
      //todo: 服务器应该在这儿等一会儿，等人家选择好，不然在决定听的时候有人已经打牌了，听牌玩家不要骂娘！
      //不过呢，nodejs对于时间函数貌似开销比较大，怎么办？第一手不让胡是不可能的。
      // this.room_should_wait(config.MaxWaitTime)
      player.socket.emit('server_canTing')
    }
  }

  //用户杠了之后需要摸一张牌
  gang_mo_pai(player) {
    //杠发牌，是从最后切一个出来，不影响前面的顺序，所以单独写成个发牌的方法
    let pai = this.clone_pai.splice(this.clone_pai.length - 1, 1);
    if (_.isEmpty(pai)) {
      throw new Error(chalk.red(`room.pai中无可用牌了`));
    }
    //发牌给谁，谁就是当前玩家
    this.current_player = player;
    player.receive_pai(pai[0]);
    // let c_player = _.clone(player);
    // c_player.socket = "hidden, 属于clone(player)";
    // console.dir(c_player);
    console.log(
      `服务器发${chalk.yellow("杠牌")}　${pai} 给：${player.username}`
    );
    console.log("房间 %s 牌还有%s张", this.id, this.clone_pai.length);
    player.socket.emit("server_table_fapai", pai);
    return pai;
  }

  //玩家所在socket打牌pai
  da_pai(io, socket, pai_name) {
    let room_name = this.id;
    //首先向房间内的所有玩家显示出当前玩家打的牌
    // socket.emit("dapai", pai);
    // socket.to(room_name).emit("dapai", pai);
    io.to(room_name).emit("server_dapai", pai_name);
    let player = this.find_player_by_socket(socket);
    //帮玩家记录下打的是哪个牌,保存在player.used_pai之中
    player.da_pai(pai_name);
    //玩家打牌的时候，桌面牌变化
    this.table_pai = pai_name;
    //todo: 有没有人可以碰的？ 有人碰就等待10秒，这个碰的就成了下一家，需要打张牌！

    let isRoomPaiEmpty = 0 === this.clone_pai.length;
    let canNormalFaPai = true; //能否正常给下一家发牌
    if (isRoomPaiEmpty) {
      // socket.emit("game over");
      // socket.to(room_name).emit("game over");
      io.to(room_name).emit("game over");
      //todo:告诉其它人哪个是赢家或者是平局
      // 牌要重新发了
      this.restart_game();
    } else {
      //todo: 看自己能否听牌！

      //看其它玩家能否碰、杠、胡或者听
      let oplayers = this.other_players(player);
      for (let item_player of oplayers) {
        //判断是否能够胡牌，别人打的还是有可能胡牌的！首先检查，能够胡了还碰个啥呢？不过也可能放过不胡，这些都需要玩家做出选择
        //但是，平胡不能胡，不过亮牌的可以胡，所以这个还需要再判断！
        let cloneShouPai = _.clone(item_player.shou_pai);
        let hupai_types = Majiang.HupaiTypeCodeArr(cloneShouPai, pai_name);
        let canHu = !_.isEmpty(hupai_types);
        if (canHu) {
          //如果有胡且亮牌，就可以胡，或者有大胡也可以胡
          if (item_player.liang_pai || Majiang.isDaHu(hupai_types)) {
            this.hupai_zhang = pai_name; //一开始是想保存在玩家类中，后来发现保存在房间里面会更方便！毕竟还要通知
            this.hupai_types = hupai_types;
            item_player.socket.emit("server_canHu");
            //todo: 等待20秒，过时发牌
          }
        }

        //其实只有一个玩家可以碰！
        if (Majiang.canPeng(item_player.shou_pai, pai_name)) {
          //只要有人能碰,就不能再正常发牌了, 需要这个变量是因为下面的answer里面是回调函数,需要等待的!
          //这里面也包括了可以杠的情况，因为能杠肯定就能碰！
          canNormalFaPai = false;

          if (Majiang.canGang(item_player.shou_pai, pai_name)) {
            console.log(
              `房间${this.id}内发现玩家${
                item_player.username
              }可以杠牌${pai_name}`
            );
            //告诉玩家你可以杠牌了
            item_player.socket.emit("server_canGang", pai_name);

            //只能碰，就用碰的办法处理！
          } else {
            console.log(
              `房间${this.id}内发现玩家${
                item_player.username
              }可以碰牌${pai_name}`
            );
            console.dir(
              `玩家${item_player.username}的手牌为:${item_player.shou_pai.join(
                " "
              )}`
            );
            item_player.socket.emit("server_canPeng", pai_name);
          }
        }
      }
      //todo: 打牌玩家能否亮牌？是否听胡，能听就能亮，选择在玩家！

      //不能碰就发牌给下一个玩家
      if (canNormalFaPai) {
        this.fa_pai(this.next_player);
      }
    }
  }

  start_game() {
    //初始化牌面
    //todo: 转为正式版本 this.clone_pai = _.shuffle(config.all_pai);
    //仅供测试用
    this.clone_pai = _.clone(config.all_pai);
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
        //然后再发一张牌给东家, fa_pai中有胡牌的检测，这儿就不用检测了
        let fa_pai = this.fa_pai(p);
        
        this.current_player = p;
        //给自己发个消息，服务器发的啥牌
        p.socket.emit("server_table_fa_pai", fa_pai);
      } else {
        //非东家，接收到牌即可
        p.socket.emit("server_game_start", p.shou_pai);
        //有可能游戏一开始就听牌，或者你可以亮出来！这时候是不可能胡的，因为你牌不够，需要别人打一张或者自己摸张牌
        this.judge_ting(p)
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

}
