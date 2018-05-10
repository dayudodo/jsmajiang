import * as _ from "lodash"
import chalk from "chalk";
//每一个玩家的数据保存在此类中
import * as config from "./config";

/**手牌组，根据这些来进行手牌的显示 */
interface ShoupaiConstuctor {
  anGang: Array<Pai>;
  mingGang: Array<Pai>;
  peng: Array<Pai>;
  /** 剩余的牌，也可能会有3连续牌，说明没有遇到碰牌 */
  shouPai: Array<Pai>;
}

export class Player {
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
  public seat_index = null; //玩家的座位号，关系到发牌的顺序，以及碰之后顺序的改变需要使用
  /** 什么样的胡，保存这个数据也是为了能够保存到数据库中 */

  public _received_pai = null;
  private _flat_shou_pai: Array<Pai> = [];
  /**玩家打牌形成的数组 */
  public arr_dapai: Array<Pai> = []; //打过的牌有哪些，断线后可以重新发送此数据
  /** 玩家在房间的座位号，也是加入房间的顺序号 */
  public hupai_types = [];
  /**胡牌张，玩家胡的啥牌，便于分析，尤其象卡五星这种，不能算错喽。
   还得知道是谁打的这张牌，自摸还是他人放炮？还是杠了之后的牌？*/
  public hupai_zhang = [];
  //临时保存的胡牌张，供用户选择，如果听或者亮，则成为正式的胡牌张
  public temp_hupai_zhang = [];
  /** 玩家是否亮牌，只在可以听胡的时候才能亮牌*/
  public is_liang = false;
  /**玩家是否选择听牌，只有大胡的时候才能听牌！*/
  public is_ting = false;
  //哪个玩家还在想，有人在想就不能打牌！记录好玩家本身的状态就好
  public is_thinking_tingliang = false;

  /**玩家的积分 */
  public score = 0;
  /**暗杠数量 */
  public count_anGang = 0
  /**明杠数量 */
  public count_mingGang = 0
  /**自摸数量 */
  public count_zimo=0
  /**放炮数量，8局为一次？需要合在一起进行计算，但是每一次的计算放哪儿呢？ */
  public count_fangPao = 0

  public group_shou_pai: ShoupaiConstuctor = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: []
  };

  //新建，用户就会有一个socket_id，一个socket其实就是一个连接了
  constructor({ flat_shou_pai = [], socket, username, user_id }) {
    this.flat_shou_pai = flat_shou_pai;
    this.socket = socket;
    this.username = username;
    this.user_id = user_id;
  }
  /** 应该只初始化 一次，以后的添加删除通过add, delete来操作 */
  set flat_shou_pai(arr_pai: Array<Pai>) {
    this._flat_shou_pai = arr_pai;
    this.group_shou_pai.shouPai = [].concat(arr_pai)
  }
  /** 玩家手牌数组 */
  get flat_shou_pai(): Array<Pai> {
    return this._flat_shou_pai;
  }
  /** 从牌数组中删除一张牌 */
  private delete_pai(arr: Array<Pai>, pai: Pai): boolean {
    let firstIndex = arr.indexOf(pai);
    if (firstIndex > -1) {
      arr.splice(firstIndex, 1);
      return true
    } else {
      return false;
    }
  }
  /**从手牌中删除一张牌，同时也会删除group_shou_pai中的！ */
  delete_shoupai(pai: Pai): boolean {
    let groupShouDeleteOK = this.delete_pai(this.group_shou_pai.shouPai, pai);
    if (!groupShouDeleteOK) { throw new Error(`group_shou_pai中找不到${pai}`) }
    this.group_shou_pai.shouPai.sort();
    let shouDeleteOK = this.delete_pai(this._flat_shou_pai, pai);
    if (!groupShouDeleteOK) { throw new Error(`_flat_shou_pai中找不到${pai}`) }
    this._flat_shou_pai.sort(); //删除元素之后排序

    return shouDeleteOK && groupShouDeleteOK
  }
  /**玩家收到的牌，保存到手牌及group手牌中 */
  set received_pai(pai: Pai) {
    this._received_pai = pai;
    this._flat_shou_pai.push(pai);
    this.group_shou_pai.shouPai.push(pai)
  }
  get received_pai() {
    return this._received_pai;
  }
  /**         从玩家手牌中删除pai         */
  da_pai(pai: Pai) {
    if (this.delete_shoupai(pai)) {
      this.arr_dapai.push(pai);
    } else {
      throw new Error(`${this.username}打了张非法牌？${pai}`);
    }
    this._received_pai = null; //打牌之后说明玩家的桌面牌是真的没有了
  }
  confirm_peng(pai: Pai) {
    //首先从手牌中删除三张牌，变成peng: pai
    for (var i = 0; i < 3; i++) {
      this.delete_pai(this.group_shou_pai.shouPai, pai);
    }
    this.group_shou_pai.peng.push(pai);
  }
  confirm_mingGang(pai: Pai) {
    //首先从手牌中删除三张牌，变成peng: pai
    for (var i = 0; i < 4; i++) {
      this.delete_pai(this.group_shou_pai.shouPai, pai);
    }
    this.group_shou_pai.mingGang.push(pai);
  }
  confirm_anGang(pai: Pai) {
    //首先从手牌中删除三张牌，变成peng: pai
    for (var i = 0; i < 4; i++) {
      this.delete_pai(this.group_shou_pai.shouPai, pai);
    }
    this.group_shou_pai.anGang.push(pai);
  }
}

// var p = new Player({
//   shou_pai:"zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa".split(" "),
//   socket:456,
//   user_id: 1,
//   username: ''}
// );
// p.receive_pai("b1");
// p.receive_pai("b2");
// p.receive_pai("c1");
// p.receive_pai("c2");
// p.receive_pai("fa");
// p.receive_pai("fa");

// console.dir(p);
