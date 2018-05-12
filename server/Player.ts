import * as _ from "lodash";
import chalk from "chalk";
//每一个玩家的数据保存在此类中
import * as config from "./config";
import { MajiangAlgo } from "./MajiangAlgo";

/**手牌组，根据这些来进行手牌的显示 */
interface ShoupaiConstuctor {
  anGang: Array<Pai>;
  mingGang: Array<Pai>;
  peng: Array<Pai>;
  /** 剩余的牌，也可能会有3连续牌，说明没有遇到碰牌 */
  shouPai: Array<Pai>;
}

export class Player {
  /**可以返回到客户端的玩家属性值 */
  static filter_properties = [
    "username",
    "user_id",
    "seat_index",
    "group_shou_pai",
    "arr_dapai",
    "is_liang",
    "is_ting"
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
  public user_id;
  /** 玩家在房间的座位号，也是加入房间的顺序号 */
  public seat_index = null; //玩家的座位号，关系到发牌的顺序，以及碰之后顺序的改变需要使用

  private _received_pai = null;
  private _flat_shou_pai: Array<Pai> = [];
  /**玩家打牌形成的数组 */
  public arr_dapai: Array<Pai> = []; //打过的牌有哪些，断线后可以重新发送此数据

  /**所有胡牌相关的数据都在这儿了 */
  public hupai_data: hupaiConstructor;

  /** 玩家是否亮牌，只在可以听胡的时候才能亮牌*/
  public is_liang = false;
  /**玩家是否选择听牌，只有大胡的时候才能听牌！*/
  public is_ting = false;
  //哪个玩家还在想，有人在想就不能打牌！记录好玩家本身的状态就好
  public is_thinking_tingliang = false;

  /**玩家的积分 */
  public score = 0;
  /**暗杠数量 */
  public count_anGang = 0;
  /**明杠数量 */
  public count_mingGang = 0;
  /**自摸数量 */
  public count_zimo = 0;
  /**放炮数量，8局为一次？需要合在一起进行计算，但是每一次的计算放哪儿呢？ */
  public count_fangPao = 0;

  public group_shou_pai: ShoupaiConstuctor;

  //新建，用户就会有一个socket_id，一个socket其实就是一个连接了
  constructor({ group_shou_pai, socket, username, user_id }) {
    this.group_shou_pai = group_shou_pai;
    this.socket = socket;
    this.username = username;
    this.user_id = user_id;
  }
  /**能否胡pai_name */
  canHu(pai_name: Pai): boolean {
    if (this.hupai_data.all_hupai_zhang.includes(pai_name)) {
      return true;
    } else {
      return false;
    }
  }
  /**能否听牌 */
  get canTing(): boolean {
    return this.hupai_data.all_hupai_zhang.length > 0;
  }
  /**是否是大胡 */
  isDaHu(pai_name: Pai): boolean {
      return MajiangAlgo.isDaHu(this.hupai_data.hupai_dict[pai_name]);
  }

  /** 玩家手牌数组，从group_shou_pai中生成 */
  get flat_shou_pai(): Array<Pai> {
    let real_shoupai = [];
    this.group_shou_pai.anGang.forEach(pai => {
      for (let i = 0; i < 4; i++) {
        real_shoupai.push(pai);
      }
    });
    this.group_shou_pai.mingGang.forEach(pai => {
      for (let i = 0; i < 4; i++) {
        real_shoupai.push(pai);
      }
    });
    this.group_shou_pai.peng.forEach(pai => {
      for (let i = 0; i < 3; i++) {
        real_shoupai.push(pai);
      }
    });
    real_shoupai = real_shoupai.concat(this.group_shou_pai.shouPai);
    return real_shoupai.sort();
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

  /**玩家收到的牌，保存到手牌及group手牌中 */
  set received_pai(pai: Pai) {
    this._received_pai = pai;
    this.group_shou_pai.shouPai.push(pai);
  }
  get received_pai() {
    return this._received_pai;
  }
  /**能碰吗？ */
  canPeng(pai: Pai){
    MajiangAlgo.canPeng(this.group_shou_pai.shouPai, pai)
  }
  /**能杠吗？ */
  canGang(pai:Pai){
    MajiangAlgo.canGang(this.group_shou_pai.shouPai, pai)
  }
  
  confirm_peng(pai: Pai) {
    this.group_shou_pai.peng.push(pai);
    //首先从手牌中删除二张牌
    for (let i = 0; i < 2; i++) {
      this.delete_pai(this.group_shou_pai.shouPai, pai);
    }
  }
  confirm_mingGang(pai: Pai) {
    //首先从手牌中删除三张牌，变成peng: pai
    for (var i = 0; i < 3; i++) {
      this.delete_pai(this.group_shou_pai.shouPai, pai);
    }
    this.group_shou_pai.mingGang.push(pai);
  }
  confirm_anGang(pai: Pai) {
    //首先从手牌中删除三张牌，变成peng: pai
    for (var i = 0; i < 3; i++) {
      this.delete_pai(this.group_shou_pai.shouPai, pai);
    }
    this.group_shou_pai.anGang.push(pai);
  }
  /**  从玩家手牌中删除pai并计算胡牌*/
  da_pai(pai: Pai) {
    if (this.delete_pai(this.group_shou_pai.shouPai, pai)) {
      this.arr_dapai.push(pai);
    } else {
      throw new Error(`${this.username}打了张非法牌？${pai}`);
    }
    this._received_pai = null; //打牌之后说明玩家的桌面牌是真的没有了
    //打牌之后要计算各种胡牌的状态
    let shoupai_changed = true;
    if (shoupai_changed) {
      this.hupai_data = MajiangAlgo.HuWhatPai(this.flat_shou_pai);
    }
  }
}
