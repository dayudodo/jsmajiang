import _ from "lodash";
import chalk from "chalk";
import { Majiang } from "./Majiang";
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
    this.current_player = null;
    this.current_player_dapai = null; //当前玩家打的牌
    this.player_index = null; //哪个玩家在打牌，以便确定下一家
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
  exit_room(socket) {
    _.remove(this.players, function(item) {
      return item.socket.id == socket.id;
    });
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
  get next_player() {
    let next_index =
      (this.current_player.seat_index + 1) % config.LIMIT_IN_ROOM;
    //最后通过座位号来找到玩家,而不是数组序号,更不容易出错
    return this.players.find(p => p.seat_index == next_index);
  }
  //除了person外的其它玩家们
  other_players(person) {
    // console.log("查找本玩家%s的其它玩家", person.username);
    let o_players = this.players.filter(p => p != person);
    // console.log(o_players.map(p => p.username));
    return o_players;
  }
  //房间发一张给player, 让player记录此次发牌，只有本玩家能看到
  fa_pai(player) {
    let pai = this.clone_pai.splice(0, 1);
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
    this.processHupai(player, pai, isZiMo);
    return pai;
  }
  //自摸，杠牌其实都需要有个标志。
  processHupai(player, pai, isZiMo) {
    let _hupaitypes = Majiang.HupaiTypeCodeArr(player.shou_pai, pai);
    if (!_.isEmpty(_hupaitypes)) {
      isZiMo? _hupaitypes.push(config.HuisZiMo) : null
      player.hupai_types= _hupaitypes
      player.socket.emit("hupai", _hupaitypes);
      player.socket.to(this.id).emit("hupai", _hupaitypes);
    }
  }

  gang_fa_pai(player) {
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
  find_player_by_socket(socket) {
    return this.players.find(item => item.socket == socket);
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
    //todo: 有没有人可以碰的？ 有人碰就等待10秒，这个碰的就成了下一家，需要打张牌！

    let isRoomPaiEmpty = this.clone_pai.length == 0;
    let canNormalFaPai = true; //能否正常给下一家发牌
    if (isRoomPaiEmpty) {
      // socket.emit("game over");
      // socket.to(room_name).emit("game over");
      io.to(room_name).emit("game over");
      //todo:告诉其它人哪个是赢家或者是平局
      // 牌要重新发了
      this.restart_game();
    } else {
      
      //看其它玩家能否碰！
      let oplayers = this.other_players(player);
      for (let item_player of oplayers) {
        //判断是否能够胡牌，别人打的还是有可能胡牌的！首先检查，能够胡了还碰个啥呢？不过也可能放过不胡，这些都需要玩家做出选择
        //但是，平胡不能胡，不过亮牌的可以胡，所以这个还需要再判断！
        let _willHuShoupai = _.clone(item_player.shou_pai)
        let _hupai_types = Majiang.HupaiTypeCodeArr(_willHuShoupai, pai_name)
        let _haveHu = !_.isEmpty(_hupai_types)
        if (_haveHu) {
          //如果有胡且亮牌，就可以胡，不然的话还不能胡，除非是大胡！
          if (item_player.liang_pai) {
            item_player.hupai_zhang= pai_name
            item_player.socket.emit('canHu', _hupai_types)
          }else{
            if (Majiang.HuisDaHu(_willHuShoupai, pai_name)) {
              
            }
          }
        }

        let gangpengOuput = ""; 
        //其实只有一个玩家可以碰！
        if (Majiang.canPeng(item_player.shou_pai, pai_name)) {
          if (Majiang.canGang(item_player.shou_pai, pai_name)) {
            canNormalFaPai = this.processGang(canNormalFaPai, item_player, pai_name);
            //只能碰，就用碰的办法处理！
          } else {
            //只要有人能碰,就不能再正常发牌了, 需要这个变量是因为下面的answer里面是回调函数,需要等待的!
            canNormalFaPai = false;
            console.log(`房间${this.id}内发现玩家${item_player.username}可以碰牌${pai_name}`);
            console.dir(`玩家${item_player.username}的手牌为:${item_player.shou_pai.join(" ")}`);
            item_player.socket.emit("server_canPeng", pai_name, answer => {
              let client_decide_peng = answer == true;
              if (client_decide_peng) {
                console.log(`玩家${item_player.username}决定碰牌:${pai_name}`);
                item_player.receive_pai(pai_name); //碰之后此牌就属于本玩家了,前后台都需要添加!
                //当前玩家顺序改变
                this.current_player = item_player;
                //再打牌后就能够正常发牌了
                canNormalFaPai = true;
              } else {
                console.log(`玩家${item_player.username}放弃碰牌:${pai_name}`);
                canNormalFaPai = true; //正常发牌
                this.fa_pai(this.next_player);
              }
            });
            //等待10秒钟，待玩家反应，超时的话就继续发牌！否则就会改变发牌的顺序！
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
  processGang(canNormalFaPai, p, pai) {
    canNormalFaPai = false;
    console.log(`房间${this.id}内发现玩家${p.username}可以杠牌${pai}`);
    p.socket.emit("server_canGang", pai, answer => {
      //1是想杠，2是想碰
      switch (answer) {
        case config.WantPeng:
          console.log(`玩家${p.username}能杠，但决定碰牌:${pai}`);
          p.receive_pai(pai); //碰之后此牌就属于本玩家了,前后台都需要添加!
          //当前玩家顺序改变
          this.current_player = p;
          //再打牌后就能够正常发牌了
          canNormalFaPai = true;
          break;
        case config.WantGang:
          console.log(`玩家${p.username}能杠决定杠牌:${pai}`);
          p.receive_pai(pai); //碰之后此牌就属于本玩家了,前后台都需要添加!
          //当前玩家顺序改变，且杠之后还要从最后拿张牌发给他
          // this.current_player = p;
          this.gang_fa_pai(p);
          //再打牌后就能够正常发牌了
          canNormalFaPai = true;
          break;
        default:
          //不是这两个值，就是放弃了
          console.log(`玩家${p.username}放弃杠牌:${pai}`);
          canNormalFaPai = true; //正常发牌
          this.fa_pai(this.next_player);
          break;
      }
    });
    return canNormalFaPai;
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
        let fa_pai = this.fa_pai(p); //然后再发一张牌给东家
        // this.player_index = p.seat_index;
        this.current_player = p;
        //给自己发个消息，服务器发的啥牌
        p.socket.emit("server_table_fa_pai", fa_pai);
      } else {
        //非东家，接收到牌即可
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
