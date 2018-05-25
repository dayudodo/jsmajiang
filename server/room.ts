import * as config from "./config";
import * as _ from "lodash";
import chalk from "chalk";
import { MajiangAlgo } from "./MajiangAlgo";
import * as g_events from "./events";
import { Player } from "./player";
import * as util from "util";
import { TablePaiManager } from "./TablePaiManager";

let room_valid_names = ["ange", "jack", "rose"];

/**列举玩家的各种操作 */
enum Operate {
  /**用户摸牌 */
  mo = "mo",
  /**用户打牌 */
  da = "da",
  /**用户碰牌 */
  peng = "peng",
  /**用户杠牌 */
  gang = "gang",
  /**用户胡牌 */
  hu = "hu",
  /**用户亮牌 */
  liang = "liang",
  /**用户过牌 */
  guo = "guo"
}

declare global {
  /**在console中输出一个对象的全部内容 */
  function puts(o: any): void;
  interface SelectConstructor {
    isShowHu: boolean;
    isShowLiang: boolean;
    isShowGang: boolean;
    isShowPeng: boolean;
  }

  interface Operation {
    /**哪个 玩家在操作 */
    who: Player;
    /**什么样的操作 */
    action: Operate;
    pai?: Pai;
    /**玩家动作数据 */
    detail?: {
      from: Player;
      to: Player;
    };
    /**自己扛？自己胡（自摸） */
    self?: boolean;
  }
}
function puts(obj) {
  console.log(util.inspect(obj));
}

//用户自然是属于一个房间，房间里面有几个人可以参加由房间说了算
export class Room {
  /**房间号，唯一，用户需要根据这个id进入房间*/
  public readonly id: string = null;
  //房间内的所有玩家，人数有上限，定义在config.
  public players: Array<Player> = [];
  //房间内的牌
  public cloneTablePais: Array<Pai> = [];
  /**当前玩家，哪个打牌哪个就是当前玩家*/
  public current_player: Player = null;
  //todo: 是否接受用户的吃、碰，服务器在计时器，过时就不会等待用户确认信息了！
  public can_receive_confirm = false;
  /** 服务器当前发的牌 */
  // public table_fa_pai: Pai = null;
  /**当前桌子上的所有人都能看到的打牌，可能是服务器发的，也可能是用户从自己手牌中打出来的。*/
  public table_dapai: Pai = null;
  /**发牌给哪个玩家 */
  public fapai_to_who: Player = null;
  /**哪个玩家在打牌 */
  public daPai_player: Player = null;

  //计时器
  public room_clock = null;

  /**玩家操作序列 */
  public operation_sequence: Array<Operation> = [
    // { who: this, action: Operate.mo, pai: "b2" },
    // { who: this, action: Operate.da, pai: "t3" },
    // //被别人碰了，有这个序列，历史复现也非常简单！
    // { who: this, action: Operate.peng, detail: { from: "me_id", to: "pengPlayerId" } },
    // //碰了别人的牌，从打牌玩家到我这儿
    // { who: this, action: Operate.peng, detail: { from: "dapaiplayer", to: "me_id" } },
    // //被别人杠了
    // { who: this, action: Operate.gang, detail: { from: "me-id", to: "gangPlayer" } },
    // //杠了别人的
    // { who: this, action: Operate.gang, detail: { from: "gangPlayer", to: "me_id" } },
    // //杠了自己的
    // { who: this, action: Operate.gang, detail: { from: "me_id", to: "me_id" }, self: true },
    // { who: this, action: Operate.hu, pai: "b1" },
    // { who: this, action: Operate.liang },
    // { who: this, action: Operate.guo }
  ];

  constructor() {
    // 房间新建之后，就会拥有个id了
    this.id = Room.getId();
  }

  /**创建一个唯一的房间号，其实可以用redis来生成一个号，就放在内存里面*/
  static getId() {
    //todo: 暂时用模拟的功能，每次要创建的时候，其实都是用的数组中的一个名称
    //正规的自然是要生成几个唯一的数字了，然后还要分享到微信之中让其它人加入
    return "001";
  }
  //用户加入房间，还需要告诉其它的用户我已经加入了
  public join_player(person: Player) {
    this.players.push(person);
  }
  public player_enter_room(socket) {
    //首先应该看玩家是否已经 在房间里面了
    let player = this.find_player_by(socket);
    if (!player) {
      console.warn("加入房间之前，玩家未加入this.players");
    }
    //首先告诉其它人player进入房间！客户端会添加此玩家
    this.other_players(player).forEach(p => {
      p.socket.sendmsg({
        type: g_events.server_other_player_enter_room,
        username: player.username,
        user_id: player.user_id,
        seat_index: player.seat_index,
        score: player.score
      });
    });
    //用户加入房间，肯定是2，3玩家，需要服务器发送时添加其它玩家的数据
    //庄家创建房间时只有一个人，所以不需要另行通知。
    let other_players_info = this.other_players(player).map(item => {
      return {
        username: item.username,
        user_id: item.user_id,
        seat_index: item.seat_index,
        east: item.east,
        score: item.score
      };
    });
    //给自己发消息时携带其它玩家的信息
    player.socket.sendmsg({
      type: g_events.server_player_enter_room,
      room_id: this.id,
      username: player.username,
      user_id: player.user_id,
      seat_index: player.seat_index,
      east: player.east,
      other_players_info: other_players_info
    });
  }

  public server_receive_ready(socket) {
    //向房间内所有人通知我已经准备好
    let player = this.find_player_by(socket);
    this.players.forEach(p => {
      p.socket.sendmsg({
        type: g_events.server_receive_ready,
        username: player.username
      });
    });
  }
  //玩家选择退出房间，应该会有一定的惩罚，如果本局还没有结束
  public exit_room(socket) {
    _.remove(this.players, function(item) {
      return item.socket.id == socket.id;
    });
  }
  public find_player_by(socket): Player {
    return this.players.find(item => item.socket == socket);
  }
  /**某玩家的所有操作 */
  public OperationsOf(player: Player) {
    return this.operation_sequence.filter(item => item.who === player);
  }
  /**玩家player的前step次操作 */
  public front_operation(player: Player, step: number): Operation {
    let p_operations = this.OperationsOf(player);
    if (p_operations[p_operations.length - step]) {
      return p_operations[p_operations.length - step];
    } else {
      return null;
    }
  }
  /**最后 一个操作 */
  public last_Operation(): Operation {
    return _.last(this.operation_sequence);
  }
  //玩家们是否都已经准备好开始游戏
  get all_ready(): boolean {
    let player_ready_count = this.players.filter(item => item.ready).length;
    console.log(`房间:${this.id}内玩家准备开始计数：${player_ready_count}`);
    return player_ready_count == config.LIMIT_IN_ROOM;
  }
  get players_count(): number {
    return this.players.length;
  }
  get all_player_names(): Array<string> {
    return this.players.map(person => {
      return person.username;
    });
  }
  //最后一位加入游戏的玩家
  get last_join_player(): Player {
    return _.last(this.players);
  }
  /** 房间中要发牌的下一个玩家 */
  get next_player(): Player {
    //下一家
    let next_index = (this.current_player.seat_index + 1) % config.LIMIT_IN_ROOM;
    //最后通过座位号来找到玩家,而不是数组序号,更不容易出错，哪怕是players数组乱序也不要紧
    return this.players.find(p => p.seat_index == next_index);
  }
  /**胡牌玩家 */
  get hupai_player(): Player {
    return this.players.find(p => p.hupai_zhang != null);
  }
  //除了person外的其它玩家们
  public other_players(person): Array<Player> {
    // console.log("查找本玩家%s的其它玩家", person.username);
    let o_players = this.players.filter(p => p.user_id != person.user_id);
    // console.log(o_players.map(p => p.username));
    return o_players;
  }
  public left_player(person: Player): Player {
    //左手玩家
    let index = person.seat_index - 1;
    index = index == -1 ? config.LIMIT_IN_ROOM - 1 : index;
    return this.players.find(p => p.seat_index == index);
  }
  public right_player(person: Player): Player {
    //右手玩家
    let index = person.seat_index + 1;
    index = index == config.LIMIT_IN_ROOM ? 0 : index;
    return this.players.find(p => p.seat_index == index);
  }
  /**没有玩家摸牌 */
  private no_player_mopai() {
    return this.players.every(p => p.mo_pai == null);
  }
  /**
   *
   * @param socket 哪个socket
   * @param player 需要向哪个玩家发送消息
   * @param ignore_filter 是否忽略filter
   */
  public player_data_filter(socket, player, ignore_filter: boolean = false) {
    let player_data = {};
    Player.filter_properties.forEach(item => {
      player_data[item] = player[item];
    });
    //是玩家本人的socket，返回详细的数据，或者选择过滤，也会直接返回
    if (ignore_filter || player.socket == socket) {
      return player_data;
    } else {
      //暗杠只有数量，但是不显示具体的内容
      let filterd_group = {};
      filterd_group["anGang"] = [];
      filterd_group["anGangCount"] = player.group_shou_pai.anGang.length;

      filterd_group["selfPeng"] = [];
      filterd_group["selfPengCount"] = player.group_shou_pai.selfPeng.length;

      filterd_group["shouPai"] = [];
      filterd_group["shouPaiCount"] = player.group_shou_pai.shouPai.length;
      //只有明杠和碰会显示在其它人那儿！
      filterd_group["mingGang"] = player.group_shou_pai.mingGang;
      filterd_group["peng"] = player.group_shou_pai.peng;

      player_data["group_shou_pai"] = filterd_group;
      //返回过滤的数据
      return player_data;
    }
  }
  /**玩家选择碰牌，或者是超时自动跳过！*/
  client_confirm_peng(socket) {
    let pengPlayer = this.find_player_by(socket);
    pengPlayer.is_thinking = false;
    //碰之后打牌玩家的打牌就跑到碰玩家手中了
    let dapai: Pai = this.daPai_player.arr_dapai.pop();
    //碰也相当于是碰玩家也摸了张牌！
    pengPlayer.mo_pai = dapai
    //玩家确认碰牌后将会在group_shou_pai.peng中添加此dapai
    pengPlayer.confirm_peng(dapai);
    //碰牌的人成为当家玩家，因为其还要打牌！下一玩家也是根据这个来判断的！
    this.current_player = pengPlayer;

    pengPlayer.can_dapai = true;
    if (this.all_players_normal()) {
      console.log(chalk.green(`玩家们正常，碰家：${pengPlayer.username}可以打牌`));
      pengPlayer.socket.sendmsg({ type: g_events.server_can_dapai });
    }

    //给每个人都要发出全部玩家的更新数据，这样最方便！
    this.players.forEach(person => {
      let players = this.players.map(p => {
        //如果玩家已经亮牌，显示其所有牌！
        if (p.is_liang) {
          return this.player_data_filter(person.socket, p, true);
        } else {
          return this.player_data_filter(person.socket, p);
        }
      });
      person.socket.sendmsg({
        type: g_events.server_peng,
        players: players,
        pengPlayer_user_id: pengPlayer.user_id
      });
    });
  }

  /**玩家选择杠牌，或者是超时自动跳过！其实操作和碰牌是一样的，名称不同而已。*/
  client_confirm_mingGang(socket) {
    let gangPlayer = this.find_player_by(socket);
    gangPlayer.is_thinking = false;

    let gangPai: Pai;
    /**自己扛 */
    let selfGang = this.fapai_to_who === gangPlayer;
    if (selfGang) {
      gangPai = gangPlayer.mo_pai;
      this.operation_sequence.push({
        who: gangPlayer,
        action: Operate.gang,
        pai: gangPai,
        self: true
      });
    } else {
      //扛别人的牌
      //杠之后打牌玩家的打牌就跑到杠玩家手中了
      gangPai = this.daPai_player.arr_dapai.pop();
      this.operation_sequence.push({
        who: gangPlayer,
        action: Operate.gang,
        pai: gangPai,
        detail: {
          from: this.daPai_player,
          to: gangPlayer
        }
      });
      //纪录玩家放了一杠，扣钱！还得判断下打牌玩家打牌之前是否杠牌了, 杠家其实是前三步，第一步杠，第二步摸，第三步才是打牌！
      let gangShangGang = false;
      let prev3_operation = this.front_operation(this.daPai_player, 3);
      if (prev3_operation) {
        gangShangGang = prev3_operation.action === Operate.gang;
      }
      if (gangShangGang) {
        this.daPai_player.fangpai_data.push({
          type: config.FangGangShangGang,
          pai: gangPai
        });
      } else {
        this.daPai_player.fangpai_data.push({
          type: config.FangGang,
          pai: gangPai
        });
      }
      console.log("====================================");
      // puts(this.OperationsOf(this.daPai_player))
      console.log(`${this.daPai_player.username} fangpai_data:`);
      puts(this.daPai_player.fangpai_data);
      console.log("====================================");
    }
    //在杠玩家的group_shou_pai.peng中添加此dapai
    gangPlayer.confirm_mingGang(gangPai);
    //碰牌的人成为当家玩家，因为其还要打牌！下一玩家也是根据这个来判断的！
    this.current_player = gangPlayer;

    //给每个人都要发出全部玩家的更新数据，这样最方便！
    this.players.forEach(person => {
      let players = this.players.map(p => {
        //如果玩家已经亮牌，显示其所有牌！
        if (p.is_liang) {
          return this.player_data_filter(person.socket, p, true);
        } else {
          return this.player_data_filter(person.socket, p);
        }
      });
      person.socket.sendmsg({
        type: g_events.server_mingGang,
        players: players,
        gangPlayer_user_id: gangPlayer.user_id
      });
    });

    //发送完消息再发最后一张牌！
    this.server_fa_pai(gangPlayer, true);
    //杠玩家记录下此次发牌，以便进行杠上花的检测，有打牌之后为false
    // gangPlayer.gang_mopai = true;
  }

  /**决定在何种情况下可以发牌并决定哪个玩家可以打牌！ */
  private decide_fapai() {
    if (this.all_players_normal()) {
      //都正常且没人摸牌的情况下才能发牌
      if (this.no_player_mopai()) {
        this.server_fa_pai(this.next_player);
      }
      //这时候才能够告诉摸牌的人你可以打牌
      let moPlayer: Player = this.players.find(p => p.mo_pai != null);
      this.decide_can_dapai(moPlayer)
    }
  }

  /**亮牌，胡后2番，打牌之后才能亮，表明已经听胡了*/
  client_confirm_liang(socket) {
    let player = this.find_player_by(socket);
    player.is_liang = true;
    // player.is_ting = true; //如果亮牌，肯定就是听了
    //玩家已经有决定，不再想了。
    player.is_thinking = false;
    //亮牌之后，需要显示此玩家的所有牌，除了暗杠！
    this.other_players(player).forEach(p => {
      p.socket.sendmsg({
        type: g_events.server_liang,
        liangPlayer: this.player_data_filter(socket, player, true)
      });
    });
    this.operation_sequence.push({
      who: player,
      action: Operate.liang
    });
    //还没有发过牌呢，说明是刚开始游戏，庄家亮了。
    //此判断还能防止两家都亮的情况，如果有人摸了牌，就算你亮牌也不会有啥影响，保证只有一个人手里面有摸牌！
    //仅仅依靠最后一个是打牌来进行发牌是不对的，如果遇上了一人打牌后 有人可亮，有人可碰，还没有碰呢，你亮了，结果就发牌了！
    //所以还需要啥呢？没人在思考状态！或者说是正常的状态下！并且有人打牌了，才可以发牌！
    this.decide_fapai();
  }

  //玩家选择放弃，给下一家发牌
  client_confirm_guo(socket) {
    //如果用户是可以胡牌的时候选择过，那么需要删除计算出来的胡牌张！
    let player = this.find_player_by(socket);
    //玩家有决定了，状态改变
    player.is_thinking = false;
    //选择过牌之后，还得判断一下当前情况才好发牌，比如一开始就有了听牌了，这时候选择过，准确的应该是头家可以打牌！
    //同一时间只能有一家可以打牌！服务器要知道顺序！知道顺序之后就好处理了，比如哪一家需要等待，过时之后你才能够打牌！
    //现在的情况非常特殊，两家都在听牌，都可以选择过，要等的话两个都要等。
    // let isPlayerNormalDapai = this.fapai_to_who === this.daPai_player;
    // if (isPlayerNormalDapai) {
    //   this.server_fa_pai(this.next_player);
    // }
    //房间玩家手里面都没有摸牌，可以发牌！因为玩家在打牌之后其摸牌为空！

    // if (this.no_player_mopai()) {
    //   this.server_fa_pai(this.next_player);
    // }
    this.decide_fapai();
  }

  /**玩家选择胡牌*/
  client_confirm_hu(socket) {
    let player = this.find_player_by(socket);
    // player.is_thinking = false //已经胡了还记录个啥思考呢？
    //自摸，胡自己摸的牌！
    if (player.mo_pai && player.canHu(player.mo_pai)) {
      player.hupai_zhang = player.mo_pai;
      player.hupai_data.hupai_dict[player.mo_pai].push(config.HuisZiMo);
      //获取前2次的操作，因为上一次肯定是摸牌，摸牌的上一次是否是杠！
      let prev2_operation = this.front_operation(player, 2);
      if (prev2_operation && prev2_operation.action == Operate.gang) {
        player.hupai_data.hupai_dict[player.mo_pai].push(config.HuisGangShangKai);
      }
      puts(this.operation_sequence);
      //并且扛牌是可以自己摸也可以求人！记录用户操作倒是对历史回放有一定帮助。
      this.sendWinnerMsg(player, player.mo_pai);
    }
    //胡别人的打的牌
    else if (player.canHu(this.table_dapai)) {
      player.hupai_zhang = this.table_dapai;
      //记录放炮者
      let fangType = player.isDaHu(this.table_dapai) ? config.FangDaHuPao : config.FangPihuPao;
      this.daPai_player.fangpai_data.push({
        type: fangType,
        pai: this.table_dapai
      });
      this.sendWinnerMsg(player, this.table_dapai);
      console.dir(this.hupai_player);
      console.dir(this.daPai_player.fangpai_data);
    } else {
      `${player.user_id}, ${player.username}想胡一张不存在的牌，抓住这家伙！`;
    }
  }
  private sendWinnerMsg(player: Player, hupaiZhang: Pai) {
    let typesCode = player.hupai_data.hupai_dict[hupaiZhang];
    if (player.is_liang) {
      typesCode.push(config.HuisLiangDao);
    }
    // //明四归，胡的是外面已经碰了的牌
    // if(player.group_shou_pai.peng.includes(hupaiZhang)){
    //   typesCode.push(config.HuisMingSiGui)
    // }else if(player.group_shou_pai.selfPeng.includes(hupaiZhang) || player.isAnSiGui(hupaiZhang) ){
    //   typesCode.push(config.HuisAnSiGui)
    // }

    this.players.forEach(p => {
      p.socket.sendmsg({
        type: g_events.server_winner,
        winner: this.player_data_filter(player.socket, player, true),
        hupai_typesCode: typesCode,
        hupai_names: MajiangAlgo.HuPaiNamesFromArr(typesCode)
      });
    });
  }

  /**房间发一张给player, 让player记录此次发牌，只有本玩家能看到
   * @param fromEnd 是否从最后发牌
   */
  server_fa_pai(player: Player, fromEnd: boolean = false): Pai {
    let pai: Array<Pai>;
    if (fromEnd) {
      pai = [this.cloneTablePais.pop()];
    } else {
      pai = this.cloneTablePais.splice(0, 1);
    }

    if (_.isEmpty(pai)) {
      throw new Error(chalk.red(`room.pai中无可用牌了`));
    }
    //看用户的状态，如果快要胡牌了，发牌还不太一样！不需要用户再操作了！
    if (player.is_liang) {
      console.log(`${player.username}已经亮牌，服务器直接发牌，或者胡`);
      //todo: 命令客户端自动打牌及胡牌
    }
    //房间记录发牌给谁，以便分析哪个玩家拿牌了但是没有打，说明在等待其它玩家！
    this.fapai_to_who = player;
    //发牌给谁，谁就是当前玩家
    this.current_player = player;

    this.operation_sequence.push({
      who: player,
      action: Operate.mo,
      pai: pai[0]
    });
    //对此牌进行判断，有可能扛或胡的。
    this.decideFaPaiSelectShow(player, pai[0]);
    //判断完毕再保存到用户的手牌中！不然会出现重复判断的情况！
    player.mo_pai = pai[0];
    console.log("服务器发牌 %s 给：%s", player.mo_pai, player.username);
    console.log("房间 %s 牌还有%s张", this.id, this.cloneTablePais.length);
    // player.socket.emit("server_table_fapai", pai);
    player.socket.sendmsg({
      type: g_events.server_table_fa_pai,
      pai: player.mo_pai
    });
    //发牌还应该通知其它玩家以便显示指向箭头，不再是只给当前玩家发消息
    this.other_players(player).forEach(p => {
      p.socket.sendmsg({
        type: g_events.server_table_fa_pai_other,
        user_id: player.user_id
      });
    });
    this.decide_can_dapai(player);
    return pai[0];
  }
/**决定玩家是否可以打牌 */
  private decide_can_dapai(player: Player) {
    player.can_dapai = true;
    if (this.all_players_normal()) {
      console.log(chalk.green(`玩家们正常，${player.username}可以打牌`));
      player.socket.sendmsg({ type: g_events.server_can_dapai });
    }
  }

  //用户杠了之后需要摸一张牌
  gang_mo_pai(player) {
    //杠发牌，是从最后切一个出来，不影响前面的顺序，所以单独写成个发牌的方法
    let pai = this.cloneTablePais.splice(this.cloneTablePais.length - 1, 1);
    if (_.isEmpty(pai)) {
      throw new Error(chalk.red(`room.pai中无可用牌了`));
    }
    //发牌给谁，谁就是当前玩家
    this.current_player = player;
    player.table_pai = pai[0];
    // let c_player = _.clone(player);
    // c_player.socket = "hidden, 属于clone(player)";
    // console.dir(c_player);
    console.log(`服务器发${chalk.yellow("杠牌")}　${pai} 给：${player.username}`);
    console.log("房间 %s 牌还有%s张", this.id, this.cloneTablePais.length);
    player.socket.emit("server_table_fapai", pai);
    return pai;
  }

  /**所有玩家处于正常状态，指不是碰、杠、亮选择状态的时候*/
  private all_players_normal() {
    return this.players.every(p => p.is_thinking === false);
  }
  /**玩家所在socket打牌pai*/
  client_da_pai(socket, dapai_name) {
    let player = this.find_player_by(socket);
    if (!player.can_dapai) {
      // throw new Error();
      console.log(chalk.red(`房间${this.id} 玩家${player.username} 强制打牌，抓住！！！！`));
      return;
    }
    //能否正常给下一家发牌
    let canNormalFaPai = true;

    //记录下哪个在打牌
    this.daPai_player = player;
    /**没有用户在选择操作胡、杠、碰、过、亮 */
    if (this.all_players_normal()) {
      //帮玩家记录下打的是哪个牌,保存在player.used_pai之中
      player.da_pai(dapai_name);
      //打牌后不能再打牌！
      player.can_dapai = false;
      //记录此玩家的打牌操作
      this.operation_sequence.push({
        who: player,
        action: Operate.da,
        pai: dapai_name
      });
      //房间记录下用户打的牌
      this.table_dapai = dapai_name;
      //todo: 有没有人可以碰的？ 有人碰就等待10秒，这个碰的就成了下一家，需要打张牌！
      this.broadcast_server_dapai(player, dapai_name);
      // this.server_fa_pai(this.next_player);
      // return;
      let isRoomPaiEmpty = 0 === this.cloneTablePais.length;
      if (isRoomPaiEmpty) {
        //告诉所有人游戏结束了
        this.players.forEach(p => {
          p.socket.sendmsg({
            type: g_events.server_gameover,
            result: "liuju"
          });
        });
        //todo:告诉其它人哪个是赢家或者是平局
      } else {
        //打完牌之后如果能胡，就可以亮，但是肯定不能胡自己打的牌，另外，亮了之后就不需要再亮了！
        if (!player.is_liang) {
          if (player.canLiang()) {
            let isShowHu = false,
              isShowLiang = true,
              isShowGang = false,
              isShowPeng = false;
            player.socket.sendmsg({
              type: g_events.server_can_select,
              select_opt: [isShowHu, isShowLiang, isShowGang, isShowPeng]
            });
          }
        }

        //todo: 在玩家选择的时候服务器应该等待，但是如果有多个玩家在选择呢？比如这个打的牌别人可以碰或者杠？
        //发牌肯定是不可以的，要等玩家选择完牌之后才能正常发牌！

        //打牌之后自己也可以听、或者亮的！当然喽，不能胡自己打的牌。所以还是有可能出现三家都在听的情况！
        let oplayers = this.other_players(player);
        for (let item_player of oplayers) {
          //每次循环开始前都需要重置，返回并控制客户端是否显示胡、亮、杠、碰
          let canShowSelect: boolean = this.decideSelectShow(item_player, dapai_name);
          if (canShowSelect) {
            item_player.is_thinking = true;
            canNormalFaPai = false;
          }
        }
        //todo: 打牌玩家能否亮牌？是否听胡，能听就能亮，选择在玩家！

        //不能胡、杠、碰就发牌给下一个玩家
        if (canNormalFaPai) {
          this.server_fa_pai(this.next_player);
        }
      }
    } else {
      //todo: 过时计算，双重保险，有变量is_thinking_tingliang来控制。
      //另外，商用版本的话有人这时候打牌肯定是用了外挂或者客户端出了毛病！
      //有人还在想着打牌，你就打了，这样是无效的操作。
      console.log(chalk.red(`有玩家在思考中，${player.username}不能打牌`));
    }
  }
  /**发牌后决定玩家是否能显示（胡、杠）的选择窗口。
   *  与其它玩家选择有所不同，碰不会检测，因为你不能碰自己打的牌！ */
  private decideFaPaiSelectShow(item_player: Player, mo_pai: Pai): boolean {
    let isShowHu: boolean = false,
      isShowLiang: boolean = false,
      isShowGang: boolean = false,
      isShowPeng: boolean = false;
    //todo: 玩家选择听或者亮之后就不再需要检测胡牌了，重复计算
    //流式处理，一次判断所有，然后结果发送给客户端
    //玩家能胡了就可以亮牌,已经亮过的就不需要再检测了
    if (!item_player.is_liang) {
      if (item_player.canLiang()) {
        isShowLiang = true;
        console.log(`房间${this.id} 玩家${item_player.username}可以亮牌`);
        puts(item_player.hupai_data);
      }
      //没亮的时候呢可以杠，碰就不需要再去检测了
    }

    if (item_player.canGang(mo_pai)) {
      isShowGang = true;
      console.log(`房间${this.id} 玩家${item_player.username}可以杠牌${mo_pai}`);
    }
    if (item_player.canHu(mo_pai)) {
      isShowHu = true;
      console.log(`房间${this.id} 玩家${item_player.username}可以自摸${mo_pai}`);
    }

    let canShowSelect = isShowHu || isShowLiang || isShowGang || isShowPeng;
    if (canShowSelect) {
      //表示玩家正在 想
      item_player.is_thinking = true;
      console.log(`房间${this.id} 玩家${item_player.username} 显示选择对话框，其手牌为:`);
      puts(item_player.group_shou_pai);
      // console.log(`${item_player.username} isShowHu: %s, isShowLiang: %s, isShowGang: %s, isShowPeng: %s`, isShowHu, isShowLiang, isShowGang, isShowPeng);
      item_player.socket.sendmsg({
        type: g_events.server_can_select,
        select_opt: [isShowHu, isShowLiang, isShowGang, isShowPeng]
      });
    }
    return canShowSelect;
  }
  /**玩家是否能显示（胡、亮、杠、碰）的选择窗口 */
  private decideSelectShow(item_player: Player, dapai_name: Pai = null): boolean {
    let isShowHu: boolean = false,
      isShowLiang: boolean = false,
      isShowGang: boolean = false,
      isShowPeng: boolean = false;
    //todo: 玩家选择听或者亮之后就不再需要检测胡牌了，重复计算
    //流式处理，一次判断所有，然后结果发送给客户端
    //玩家能胡了就可以亮牌,已经亮过的就不需要再检测了
    if (!item_player.is_liang) {
      if (item_player.canLiang()) {
        isShowLiang = true;
        console.log(`房间${this.id} 玩家${item_player.username}可以亮牌`);
        puts(item_player.hupai_data);
      }
    }

    /**如果是用户打牌，才会下面的判断，也就是说dapai_name有值时是别人在打牌！ */
    if (dapai_name) {
      //如果用户亮牌而且可以胡别人打的牌
      if (item_player.is_liang && item_player.canHu(dapai_name)) {
        isShowHu = true;
        console.log(`房间${this.id} 玩家${item_player.username}亮牌之后可以胡牌${dapai_name}`);
      }
      // 大胡也可以显示胡牌
      //todo: 如果已经可以显示胡，其实这儿可以不用再检测了！
      if (item_player.isDaHu(dapai_name)) {
        isShowHu = true;
        console.log(`房间${this.id} 玩家${item_player.username}大大胡牌${dapai_name}`);
        //todo: 等待20秒，过时发牌
      }
      if (item_player.canGang(dapai_name)) {
        isShowGang = true;
        console.log(`房间${this.id} 玩家${item_player.username}可以杠牌${dapai_name}`);
      }
      if (item_player.canPeng(dapai_name)) {
        isShowPeng = true;
        console.log(`房间${this.id} 玩家${item_player.username}可以碰牌${dapai_name}`);
      }
    }

    let canShowSelect = isShowHu || isShowLiang || isShowGang || isShowPeng;
    if (canShowSelect) {
      item_player.is_thinking = true;
      console.log(`房间${this.id} 玩家${item_player.username} 显示选择对话框，其手牌为:`);
      puts(item_player.group_shou_pai);
      // console.log(`${item_player.username} isShowHu: %s, isShowLiang: %s, isShowGang: %s, isShowPeng: %s`, isShowHu, isShowLiang, isShowGang, isShowPeng);
      item_player.socket.sendmsg({
        type: g_events.server_can_select,
        select_opt: [isShowHu, isShowLiang, isShowGang, isShowPeng]
      });
    }
    return canShowSelect;
  }

  /**
   * 给房间内的所有玩家广播消息
   * @param event_type 事件类型
   * @param data 事件所携带数据
   */
  broadcast(event_type: EVENT_TYPE, data) {
    this.players.forEach(p => {
      p.socket.sendmsg({
        type: event_type,
        data: data
      });
    });
  }
  /**广播服务器打牌的消息给所有玩家 */
  broadcast_server_dapai(player, pai_name) {
    player.socket.sendmsg({
      type: g_events.server_dapai,
      pai_name: pai_name
    });
    //告诉其它玩家哪个打牌了, 其它信息用户在加入房间的时候已经发送过了。
    this.other_players(player).forEach(p => {
      p.socket.sendmsg({
        type: g_events.server_dapai_other,
        username: player.username,
        user_id: player.user_id,
        pai_name: pai_name
      });
    });
  }

  get dong_jia() {
    //获取东家
    return _.find(this.players, { east: true });
  }
  set_dong_jia(player) {
    //只能有一个东家, 不使用other_players计算麻烦
    this.players.forEach(p => {
      p.east = false;
    });
    player.east = true;
  }

  /**过滤grou_shou_pai,
   * @param ignore_filter 是否忽略此过滤器，用户选择亮牌，就不再需要过滤了。
   */
  filter_group(group_shouPai: GroupConstructor, ignore_filter: boolean = false) {
    if (ignore_filter) {
      return group_shouPai;
    } else {
      //需要新建group对象返回，不能改变原有的数据！
      let newGroup = _.clone(group_shouPai);
      newGroup.anGang = [];
      newGroup.anGangCount = group_shouPai.anGang.length;
      newGroup.selfPeng = [];
      newGroup.selfPengCount = group_shouPai.selfPeng.length;
      newGroup.shouPai = [];
      newGroup.shouPaiCount = group_shouPai.shouPai.length;
      return newGroup;
    }
  }

  sendGroupShouPaiOf(p: Player) {
    let leftGroup = this.filter_group(this.left_player(p).group_shou_pai);
    let rightGroup = this.filter_group(this.right_player(p).group_shou_pai);
    p.socket.sendmsg({
      type: g_events.server_game_start,
      god_player: { group_shou_pai: p.group_shou_pai },
      left_player: { group_shou_pai: leftGroup },
      right_player: { group_shou_pai: rightGroup }
    });
  }
  server_game_start() {
    //初始化牌面
    //todo: 转为正式版本 this.clone_pai = _.shuffle(config.all_pai);
    //仅供测试用
    this.cloneTablePais = TablePaiManager.player23_liangTest();
    //开始给所有人发牌，并给东家多发一张
    if (!this.dong_jia) {
      throw new Error(chalk.red("房间${id}没有东家，检查代码！"));
    }
    //先把所有玩家的牌准备好！
    this.players.forEach((p, index) => {
      //玩家收到的牌保存好，以便服务器进行分析，每次都需要排序下，便于分析和查看
      p.group_shou_pai.shouPai = this.cloneTablePais.splice(0, 13).sort();
      //发牌完毕就要计算胡了
      p.calculateHu();
    });
    // 再进行相关的消息发送！
    this.players.forEach((p, index) => {
      //有可能游戏一开始就听牌，或者你可以亮出来！这时候是不可能胡的，因为你牌不够，需要别人打一张或者自己摸张牌
      //todo: 如果东家也可以听牌呢？所以每个用户都需要检测一遍！
      this.sendGroupShouPaiOf(p);
      if (p == this.dong_jia) {
        //告诉东家，服务器已经开始发牌了，房间还是得负责收发，玩家类只需要保存数据和运算即可。
        //不管东家会不会胡，都是需要发牌的！
        // this.server_fa_pai(p);
      } else {
        //测试一下如何显示其它两家的牌，应该在发牌之后，因为这时候牌算是发完了，不然没牌的时候你显示个屁哟。
        //非东家，接收到牌即可
        // this.sendGroupShouPaiOf(p);
        this.decideSelectShow(p);
      }
    });
    this.server_fa_pai(this.dong_jia)
  }

  //游戏结束后重新开始游戏！
  restart_game() {
    //清空所有玩家的牌
    this.players.forEach(p => {
      p.group_shou_pai = {
        anGang: [],
        mingGang: [],
        peng: [],
        selfPeng: [],
        shouPai: []
      };
      p.ready = false;
      p.arr_dapai = [];
    });
    this.server_game_start();
  }
}
