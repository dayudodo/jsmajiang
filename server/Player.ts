import * as _ from "lodash";
import { MajiangAlgo } from "./MajiangAlgo";
import { ScoreManager } from "./ScoreManager";
//每一个玩家的数据保存在此类中
import * as config from "./config";

/**手牌组，根据这些来进行手牌的显示 */
declare global {
  interface GroupConstructor {
    anGang: Array<Pai>;
    /**暗杠计数 */
    anGangCount?: number;
    mingGang: Array<Pai>;
    selfPeng: Array<Pai>;
    selfPengCount?: number;
    peng: Array<Pai>;
    /** 剩余的牌，也可能会有3连续牌，说明没有遇到碰牌 */
    shouPai: Array<Pai>;
    /**手牌计数 */
    shouPaiCount?: number;
  }
  /**玩家状态，做为玩家可以操作的唯一证据！ */
  // enum playerStatus {
  //   can_dapai,
  //   can_peng,
  //   can_gang,
  //   can_ting,
  //   can_liang,
  //   can_hu
  // }
}

export class Player {
  /**可以返回到客户端的玩家属性数组 */
  static filter_properties = ["username", "user_id", "seat_index", "group_shou_pai", "arr_dapai", "is_liang"];
  /**胜负属性组 */
  static result_properties = [
    "user_id",
    "username",
    "seat_index",
    "result_shou_pai",
    "result_info",
    "is_hu",
    "hupai_zhang",
    "is_fangpao",
    "oneju_score"
  ];
  //初始化第一手牌，肯定是有13张
  // this.room = null
  public socket: WebSocket;
  /**用户是否连接？有可能掉线！*/
  public connect = false;
  /**用户是否已经准备好，全部准备好后就可以开始了*/
  public ready = false;
  /**用户是否是东家*/
  public east = false;
  /**用户名称，以后可以显示微信名称*/
  public username;
  /**用户唯一id号 */
  public user_id: number;
  /** 玩家在房间的座位号，也是加入房间的顺序号 */
  public seat_index = null; //玩家的座位号，关系到发牌的顺序，以及碰之后顺序的改变需要使用

  private _mo_pai = null;
  /**玩家打牌形成的数组 */
  public arr_dapai: Array<Pai> = []; //打过的牌有哪些，断线后可以重新发送此数据

  /** 玩家是否亮牌，只在可以听胡的时候才能亮牌*/
  public is_liang = false;
  /**是否是自摸，其实不能算是一种胡牌，而是一种状态，杠上胡也可以算！加番的一种方式。 */
  public is_zimo = false;
  //哪个玩家还在想，有人在想就不能打牌！记录好玩家本身的状态就好
  public is_thinking = false;
  /**todo: 是否是胡玩家，确保只有一个 */
  public is_hu = false;

  /**玩家放杠、放炮的记录，但于结算！user_id牌放给谁了，如果杠的玩家是自己，那么就得其它两家出钱了 */
  public lose_data = [
    // {type: config.FangGang, pai:''},
    // {type: config.FangGangShangGang, pai:''},
    // {type: config.FangPihuPao, pai:''},
    // {type: config.FangDaHuPao, pai:''}
  ];

  /**玩家的积分 */
  public score = 0;
  /**一局得分 */
  public oneju_score = 0;
  /**暗杠数量 */
  public count_anGang = 0;
  /**明杠数量 */
  public count_mingGang = 0;
  /**自摸数量 */
  public count_zimo = 0;
  /**放炮数量，8局为一次？需要合在一起进行计算，但是每一次的计算放哪儿呢？ */
  public count_fangPao = 0;
  /**玩家手牌组，包括有几个杠、几个碰 */
  public group_shou_pai: GroupConstructor;
  /**所有赢的都在这儿了 */
  public hupai_data: hupaiConstructor;
  /**最后胡的是哪张牌 */
  public hupai_zhang: Pai = null;
  // /**玩家现在的状态，控制了玩家可以进行的操作，比如在能打牌的时候才能打 */
  // public can_status: playerStatus;

  /**摸扛之后是否打牌 */
  public after_mo_gang_dapai = false;
  /**能打牌了 */
  public can_dapai: boolean = false;
  /**临时的赢代码，比如杠 */
  public temp_win_codes: number[] = [];

  //新建，用户就会有一个socket_id，一个socket其实就是一个连接了
  constructor({ group_shou_pai, socket, username, user_id }) {
    this.group_shou_pai = group_shou_pai;
    this.socket = socket;
    this.username = username;
    this.user_id = user_id;
  }
  /**保存杠上杠，并通知放杠家伙! */
  saveGangShangGang(fangGangPlayer: Player, pai_name: Pai) {
    this.temp_win_codes.push(config.huisGangShangGang);
    fangGangPlayer.lose_data.push({
      type: config.LoseGangShangGang,
      pai: pai_name
    });
  }
  /**保存普通杠消息，并通知放杠者 */
  saveGang(fangGangPlayer: Player, pai_name: Pai) {
    this.temp_win_codes.push(config.HuisGang);
    fangGangPlayer.lose_data.push({
      type: config.LoseGang,
      pai: pai_name
    });
  }
  /**保存擦炮的消息，并通知其它的玩家你得掏钱了! */
  saveCaPao(other_players: Player[], pai_name: Pai) {
    this.temp_win_codes.push(config.HuisCaPao);
    other_players.forEach(person => {
      person.lose_data.push({
        type: config.LoseCaPao,
        pai: pai_name
      });
    });
  }

  /**保存暗杠的消息，改变其它两个玩家的扣分! */
  saveAnGang(other_players: Player[], pai_name: Pai) {
    this.temp_win_codes.push(config.HuisAnGang);
    other_players.forEach(person => {
      person.lose_data.push({
        type: config.LoseAnGang,
        pai: pai_name
      });
    });
  }

  /**到底要出哪些杠钱！包括屁胡炮，大胡炮 */
  get lose_names(): string[] {
    return MajiangAlgo.LoseNamesFrom(this.lose_data);
  }
  /**哪些项目 */
  get temp_win_names(): string[] {
    return MajiangAlgo.HuPaiNamesFrom(this.temp_win_codes);
  }
  /**胡了哪些项目 */
  get all_win_names(): string[] {
    return MajiangAlgo.HuPaiNamesFrom(this.all_win_codes);
  }
  /**返回所有赢代码，如果没胡，只返回杠的 */
  get all_win_codes(): number[] {
    if (this.is_hu) {
      //todo: 胡之后，如何得到所有的胜类型代码？
      return this.hupai_data.hupai_dict[this.hupai_zhang].concat(this.temp_win_codes);
    } else {
      return this.temp_win_codes;
    }
  }
  /**玩家胜负结果信息 */
  get result_info(): string {
    //todo: 返回玩家的胜负两种消息！即使没胡，还是可能会有收入的！
    //或者只显示你赢了多少钱，哪怕是个单杠！
    if (this.is_hu) {
      return this.all_win_names.join(" ");
    } else {
      return this.lose_names.join(" ");
    }
  }
  /**返回result可用的手牌，把anGang移动到mingGang中，selfPeng移动到peng里面 */
  get result_shou_pai() {
    let result = _.cloneDeep(this.group_shou_pai);
    if (result.anGang.length > 0) {
      result.anGang.forEach(pai => {
        result.mingGang.push(pai);
      });
      result.anGang = [];
    }
    if (result.selfPeng.length > 0) {
      result.selfPeng.forEach(pai => {
        result.peng.push(pai);
      });
      result.selfPeng = [];
    }
    return result;
  }
  /**是否放炮 */
  get is_fangpao(): boolean {
    return this.lose_data.some(item => item.type == config.LoseDaHuPao || item.type == config.LosePihuPao);
  }
  /**能够杠的牌，包括peng, selfPeng里面可以自扛以及暗杠的牌 */
  canGangPais() {
    let output = [];
    output = output.concat(this.group_shou_pai.peng.filter(pai => this.group_shou_pai.shouPai.includes(pai)));
    output = output.concat(this.group_shou_pai.selfPeng.filter(pai => this.group_shou_pai.shouPai.includes(pai)));
    output = output.concat(this.PaiArr4A());
    return output;
  }
  /**返回group手牌中出现4次的牌！ */
  PaiArr4A() {
    let result = _.countBy(this.group_shou_pai.shouPai);
    let output = [];
    for (const key in result) {
      if (result[key] == 4) {
        output.push(key);
      }
    }
    return output;
  }
  /**返回group手牌中出现3次的牌！ */
  PaiArr3A() {
    let result = _.countBy(this.group_shou_pai.shouPai);
    let output = [];
    for (const key in result) {
      if (result[key] == 3) {
        output.push(key);
      }
    }
    return output;
  }
  /**摸牌后四张，用于判断暗四归，暗杠，在group手牌中存在3张相同的牌，因为mo_pai后会添加到shouPai中，
   * 所以需要检查数量是否为4
   */
  isMoHouSi(pai_name: Pai): boolean {
    let countPai = this.group_shou_pai.shouPai.filter(pai => pai == pai_name);
    return countPai.length === 4 || this.group_shou_pai.selfPeng.includes(pai_name);
  }
  /**能否胡pai_name */
  canHu(pai_name: Pai): boolean {
    if (this.hupai_data.all_hupai_zhang.includes(pai_name)) {
      return true;
    } else {
      return false;
    }
  }

  /**是否是大胡 */
  isDaHu(pai_name: Pai): boolean {
    return MajiangAlgo.isDaHu(this.hupai_data.hupai_dict[pai_name]);
  }

  /** 玩家手牌数组，从group_shou_pai中生成 */
  get flat_shou_pai(): Array<Pai> {
    return MajiangAlgo.flat_shou_pai(this.group_shou_pai);
  }
  /** 从牌数组中删除一张牌 */
  private delete_pai(arr: Array<Pai>, pai: Pai): boolean {
    let firstIndex = arr.indexOf(pai);
    if (firstIndex > -1) {
      arr.splice(firstIndex, 1);
      return true;
    } else {
      return false;
    }
  }

  /**玩家摸的牌，其实也就是服务器发的牌，保存到自己的group手牌中
   * 一旦打出，则清空
   */
  set mo_pai(pai: Pai) {
    this._mo_pai = pai;
    this.after_mo_gang_dapai = false
    this.group_shou_pai.shouPai.push(pai);
    this.group_shou_pai.shouPai.sort();
  }
  get mo_pai() {
    return this._mo_pai;
  }
  // /**能否听牌，玩家没亮的时候，屁胡不能听牌！其它情况下是可以的！ */
  // canTing(): boolean {
  //   return this.hupai_data.all_hupai_zhang.length > 0;
  // }
  /**能亮否？能胡就能亮？ */
  canLiang(): boolean {
    // return MajiangAlgo.isDaHu(this.hupai_data.all_hupai_typesCode)
    return this.hupai_data.all_hupai_zhang.length > 0;
  }
  /**能碰吗？只能是手牌中的才能检测碰，已经碰的牌就不需要再去检测碰了 */
  canPeng(pai: Pai): boolean {
    return MajiangAlgo.canPeng(this.group_shou_pai.shouPai, pai, this.is_liang);
  }
  /**能杠吗？分碰了之后杠还是本来就有三张牌！最简单的自然是使用flat_shou_pai */
  canGang(pai: Pai): boolean {
    let selfMo = this.mo_pai != null;
    //能否杠还能分你是自摸碰还是求人碰，selfPeng是可以随便杠的，但是求人碰则得自己摸牌才能杠！
    return MajiangAlgo.canGang(this.group_shou_pai, pai, this.is_liang, selfMo);
  }

  confirm_peng(pai: Pai) {
    this.group_shou_pai.peng.push(pai);
    //从手牌中删除三张牌，因为把别人的牌当成是mo_pai加入了手牌！
    //这样的话其它玩家liang, guo之后就知道碰玩家是摸牌的人了！
    for (let i = 0; i < 3; i++) {
      this.delete_pai(this.group_shou_pai.shouPai, pai);
    }
    this.group_shou_pai.shouPai.sort();
  }
  /**杠别人的牌是明杠 */
  confirm_mingGang(pai: Pai) {
    this.after_mo_gang_dapai = false
    this.group_shou_pai.mingGang.push(pai);
    //需要删除杠之前的3张牌，可能存在于peng, selfPeng, shoupai之中！
    //如果是碰了之后杠，需要删除这张碰牌
    this.group_shou_pai.peng.remove(pai);
    //包括亮牌中的selfPeng，因为peng, selfPeng里面只可能有一个，所以都删除不会出错！
    this.group_shou_pai.selfPeng.remove(pai);
    //当自己摸牌杠的时候，其实是需要删除4次的！好在delete_pai找不到的时候并不会出错！
    //不过自己摸牌其实是属于暗杠的范围了
    for (var i = 0; i < 4; i++) {
      this.delete_pai(this.group_shou_pai.shouPai, pai);
    }
    this.group_shou_pai.shouPai.sort();
    //杠之后需要重新算下胡牌！
    this.calculateHu();
  }

  /**自己摸的牌就是暗杠了*/
  confirm_anGang(pai: Pai) {
    this.after_mo_gang_dapai = false
    //首先从手牌中删除四！张牌，
    // 因为自己摸牌后会添加到手牌之中，这样就会有4张牌
    for (var i = 0; i < 4; i++) {
      this.delete_pai(this.group_shou_pai.shouPai, pai);
    }
    this.group_shou_pai.anGang.push(pai);
    this.group_shou_pai.shouPai.sort();
    //杠之后需要重新算下胡牌！
    this.calculateHu();
  }

  /**确定自碰牌，将pai从shouPai中移动到selfPeng之中！ */
  confirm_selfPeng(pai: Pai) {
    for (var i = 0; i < 3; i++) {
      this.delete_pai(this.group_shou_pai.shouPai, pai);
    }
    this.group_shou_pai.selfPeng.push(pai);
    this.group_shou_pai.shouPai.sort();
  }
  /**  从玩家手牌中删除pai并计算胡牌*/
  da_pai(pai_name: Pai) {
    if (this.delete_pai(this.group_shou_pai.shouPai, pai_name)) {
      this.arr_dapai.push(pai_name);
    } else {
      throw new Error(`${this.username}打了张非法牌？${pai_name}`);
    }
    //如果打的牌与摸牌相同，不用重复计算，就算是以前手牌里面有，其实也相当于是打了张摸牌
    let shouPaiChanged = pai_name != this.mo_pai
    if(shouPaiChanged){
      this.group_shou_pai.shouPai.sort();
      this.calculateHu();
    }
    this._mo_pai = null; //打牌之后玩家处于非摸牌状态
    this.after_mo_gang_dapai = true
  }
  /**计算各种胡牌的状态 */
  calculateHu() {
    //只要手牌改变，其实都是需要重新计算胡牌！
    let shoupai_changed = true;
    if (shoupai_changed) {
      this.hupai_data = MajiangAlgo.HuWhatGroupPai(this.group_shou_pai);
    }
  }
}
