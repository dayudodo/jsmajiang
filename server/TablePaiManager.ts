import * as config from "./config";
import * as _ from "lodash";
import { PaiConvertor } from "./PaiConvertor"
/**直接将字符串转换成数类麻将数组 */
function pais(strs) {
  return PaiConvertor.pais(strs)
}
function to_number(str) {
  return PaiConvertor.ToNumber(str)
}

declare global {
  interface Array<T> {
    /**数组中删除一个元素 */
    remove(o): T[];
    equalArrays(o): boolean;
  }
}

Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
  return this;
};

export class TablePaiManager {
  constructor() {}
  /**按顺序发牌 */
  static fapai_sequence(): Array<Pai> {
    return _.clone(config.all_pai);
  }

  /**随机发牌 */
  static fapai_random(): Array<Pai> {
    return _.shuffle(_.clone(config.all_pai));
  }
  /**检测两家都亮牌后的发牌情况！或者两家都过的发牌情况 */
  static player23_liangTest() {
    var allpais: Array<Pai> = TablePaiManager.fapai_random();

    var player1 = pais("b1 b2 b3 b5 b5 b6 b7 b8 b8 t1 t4 t9 fa");
    var player2 = pais("b1 b1 b1 b2 b3 b6 b7 b8 t1 t2 t3 zh zh");
    var player3 = pais("b7 b8 b9 t1 t2 t3 t4 t5 t6 t7 di di di");
    var newPais = [];
    newPais = newPais.concat(player1);
    newPais = newPais.concat(player2);
    newPais = newPais.concat(player3);
    // newPais = newPais.concat(fa_pais);
    player1.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player2.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player3.forEach((pai, index) => {
      allpais.remove(pai);
    });
    newPais = newPais.concat(allpais);
    return newPais;
  }
  /**除了暗四归，还能检测亮牌 */
  static player2_anSiGui() {
    var allpais: Array<Pai> = TablePaiManager.fapai_random();

    var player1 = pais("b1 b2 b3 b5 b5 b6 b7 b8 b8 t1 t4 t9 fa");
    var player2 = pais("b1 b1 b1 b2 b3 b6 b7 b8 t1 t2 t3 zh zh");
    var player3 = pais("b2 b5 b6 b7 b8 b9 t1 t4 t6 t7 di di di");
    var newPais = [];
    newPais = newPais.concat(player1);
    newPais = newPais.concat(player2);
    newPais = newPais.concat(player3);
    // newPais = newPais.concat(fa_pais);
    player1.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player2.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player3.forEach((pai, index) => {
      allpais.remove(pai);
    });
    newPais = newPais.concat(allpais);
    return newPais;
  }
  static player2_mingSiGui() {
    var allpais: Array<Pai> = TablePaiManager.fapai_random();

    var player1 = pais("b1 b2 b3 b5 b5 b6 b7 b8 b8 t1 t4 t9 fa");
    var player2 = pais("b1 b1 b9 t1 t1 t2 t3 t6 t7 t8 zh zh zh");
    var player3 = pais("b1 b5 b6 b7 b8 b9 t1 t4 t6 t7 di di di");
    var newPais = [];
    newPais = newPais.concat(player1);
    newPais = newPais.concat(player2);
    newPais = newPais.concat(player3);
    // newPais = newPais.concat(fa_pais);
    player1.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player2.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player3.forEach((pai, index) => {
      allpais.remove(pai);
    });
    newPais = newPais.concat(allpais);
    return newPais;
  }
  /**开局双杠，他人放杠，测试杠选择 */
  static player1_3gang() {
    var allpais: Array<Pai> = TablePaiManager.fapai_random();

    var player1 = pais("b1 b1 b1 b1 b2 b2 b2 b2 di di di t1 t9");
    var player2 = pais("b3 t1 t1 t1 t4 t6 zh zh zh fa fa fa di");
    var player3 = pais("t2 t2 t3 t3 t4 t5 t6 t6 t7 t7 t8 b8 b9");
    //发牌需要有个顺序，不能使用pais
    // var fa_pais = "t2 di".split(" ")
    var newPais = [];
    newPais = newPais.concat(player1);
    newPais = newPais.concat(player2);
    newPais = newPais.concat(player3);
    // newPais = newPais.concat(fa_pais);
    player1.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player2.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player3.forEach((pai, index) => {
      allpais.remove(pai);
    });
    newPais = newPais.concat(allpais);
    return newPais;
  }
  static playe3_gangshangGang() {
    var allpais: Array<Pai> = TablePaiManager.fapai_random();

    var player1 = pais("b1 b1 b2 b2 b3 b4 b5 b6 b7 b8 b8 t9 fa");
    var player2 = pais("t1 t1 t1 t3 t4 t6 zh zh zh fa fa fa di");
    var player3 = pais("b1 b5 b6 b7 b8 b9 t1 t2 t7 t7 di di di");
    //发牌需要有个顺序，不能使用pais
    // var fa_pais = "t2 di".split(" ")
    var newPais = [];
    newPais = newPais.concat(player1);
    newPais = newPais.concat(player2);
    newPais = newPais.concat(player3);
    // newPais = newPais.concat(fa_pais);
    player1.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player2.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player3.forEach((pai, index) => {
      allpais.remove(pai);
    });
    // fa_pais.forEach((pai, index) => {
    //   allpais.remove(pai);
    // });
    newPais = newPais.concat(allpais);

    return newPais;
  }
  /**玩家2杠上花*/
  static playe2_gangshangHua() {
    var allpais: Array<Pai> = TablePaiManager.fapai_random();

    var player1 = pais("b1 b1 b2 b2 b3 b3 b5 b6 b7 b8 b8 b9 fa");
    var player2 = pais("t1 t1 t1 t3 t4 t5 zh zh zh fa fa fa di");
    var player3 = pais("b4 b5 b6 b7 b8 b9 t1 t7 t7 t7 t8 t8 t9");
    //发牌需要有个顺序，不能使用pais
    // var fa_pais = "t2 di".split(" ")
    var newPais = [];
    newPais = newPais.concat(player1);
    newPais = newPais.concat(player2);
    newPais = newPais.concat(player3);
    // newPais = newPais.concat(fa_pais);
    player1.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player2.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player3.forEach((pai, index) => {
      allpais.remove(pai);
    });
    // fa_pais.forEach((pai, index) => {
    //   allpais.remove(pai);
    // });
    //保证最后一张牌是di
    allpais.remove("di");
    // allpais[allpais.length - 1] = "di";
    newPais = newPais.concat(allpais);

    return newPais;
  }

  /**庄家摸牌能天胡*/
  static zhuang_mopai_hu() {
    var allpais: Array<Pai> = TablePaiManager.fapai_random();

    var player1 = pais("b1 b1 b2 b2 b3 b3 b5 b6 b7 b8 b8 b9 fa");
    var player2 = pais("t1 t1 t1 t3 t4 t5 zh zh zh fa fa fa di");
    var player3 = pais("b4 b5 b6 b7 b8 b9 t1 t7 t7 t7 t8 t8 t9");
    //发牌需要有个顺序，不能使用pais
    var fa_pais = "t2 di".split(" ");
    var newPais = [];
    newPais = newPais.concat(player1);
    newPais = newPais.concat(player2);
    newPais = newPais.concat(player3);
    newPais = newPais.concat(fa_pais);
    player1.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player2.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player3.forEach((pai, index) => {
      allpais.remove(pai);
    });
    fa_pais.forEach((pai, index) => {
      allpais.remove(pai);
    });
    newPais = newPais.concat(allpais);
    return newPais;
  }
  /**庄家摸牌能杠*/
  static zhuang_mopai_gang() {
    var allpais: Array<Pai> = TablePaiManager.fapai_random();

    var player1 = pais("t1 t1 t1 t1 t7 b8 b9 zh zh fa di di di");
    var player2 = pais("b1 b1 b2 b2 b3 b3 b5 b6 b7 b8 b8 b9 fa");
    var player3 = pais("b4 b5 b6 b7 b8 b9 t2 t7 t7 t7 t8 t8 t9");
    var fa_pais = pais("di");
    var newPais = [];
    newPais = newPais.concat(player1);
    newPais = newPais.concat(player2);
    newPais = newPais.concat(player3);
    newPais = newPais.concat(fa_pais);
    player1.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player2.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player3.forEach((pai, index) => {
      allpais.remove(pai);
    });
    fa_pais.forEach((pai, index) => {
      allpais.remove(pai);
    });
    newPais = newPais.concat(allpais);
    return newPais;
  }
  /**七对放炮 */
  static qidiu_ting() {
    var allpais: Array<Pai> = TablePaiManager.fapai_random();

    var player1 = pais("b1 t1 t1 t3 t7 b8 b9 zh zh fa di di di");
    var player2 = pais("b1 b1 b2 b2 b3 b3 b5 b6 b7 b8 b8 b9 b9");
    var newPais = [];
    newPais = newPais.concat(player1);
    newPais = newPais.concat(player2);
    player1.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player2.forEach((pai, index) => {
      allpais.remove(pai);
    });
    newPais = newPais.concat(allpais);
    return newPais;
  }
  /**碰了打牌之后能亮 */
  static penggang_da_liang() {
    var allpais: Array<Pai> = TablePaiManager.fapai_random();

    var player1 = "b1 t1 t1 t3 t7 t8 t9 zh zh fa di di di".split(" ");
    var player2 = "b1 b1 b7 b8 b9 t1 t2 t3 t4 t5 t6 fa fa".split(" ");
    var newPais = [];
    newPais = newPais.concat(player1);
    newPais = newPais.concat(player2);
    player1.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player2.forEach((pai, index) => {
      allpais.remove(pai);
    });
    newPais = newPais.concat(allpais);
    return newPais;
  }
  /**庄家打牌就有人能杠 */
  static zhuang_() {
    var allpais: Array<Pai> = TablePaiManager.fapai_random();

    var player1 = "b1 t1 t1 t3 t7 t8 t9 zh zh fa di di di".split(" ");
    var player2 = "b1 b1 b1 b2 b3 b4 t1 t2 t4 t5 zh fa fa".split(" ");
    var newPais = [];
    newPais = newPais.concat(player1);
    newPais = newPais.concat(player2);
    player1.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player2.forEach((pai, index) => {
      allpais.remove(pai);
    });
    newPais = newPais.concat(allpais);
    return newPais;
  }
  /**庄家打牌就能亮 */
  static dapai_liang() {
    var allpais: Array<Pai> = TablePaiManager.fapai_random();

    var player1 = "b1 b2 b3 b4 b5 b9 t4 t4 t6 t7 t8 di di".split(" ");
    var player2 = "b1 b1 b1 b2 b3 b4 t1 t2 t3 t6 fa fa di".split(" ");
    var player3 = "b4 b5 b6 b7 b8 b9 t1 t7 t7 t7 t8 t8 di".split(" ");
    var fa_pais = "t4".split(" ");
    var newPais = [];
    newPais = newPais.concat(player1);
    newPais = newPais.concat(player2);
    newPais = newPais.concat(player3);
    newPais = newPais.concat(fa_pais);
    player1.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player2.forEach((pai, index) => {
      allpais.remove(pai);
    });
    player3.forEach((pai, index) => {
      allpais.remove(pai);
    });
    fa_pais.forEach((pai, index) => {
      allpais.remove(pai);
    });
    newPais = newPais.concat(allpais);
    return newPais;
  }
}

// console.log('====================================');
// console.log(TablePaiManager.fapai_gang());
// console.log('====================================');
