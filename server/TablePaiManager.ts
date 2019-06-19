import * as config from "./config"
import * as _ from "lodash"
import { PaiConvertor } from "./PaiConvertor"
/**直接将字符串转换成数类麻将数组 */
function pais(strs) {
  return PaiConvertor.pais(strs)
}
/**字符麻将牌转换到数字型麻将牌 */
function to_number(str) {
  return PaiConvertor.ToNumber(str)
}

declare global {
  interface Array<T> {
    /**数组中删除一个元素 */
    remove(o): T[]
    equalArrays(o): boolean
  }
}

Array.prototype.remove = function(val) {
  var index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
  return this
}

export class TablePaiManager {
  constructor() {}
  /**按顺序发牌 */
  static fapai_sequence(): Array<Pai> {
    return _.clone(config.all_pai)
  }

  /**随机发牌 */
  static fapai_random(): Array<Pai> {
    return _.shuffle(_.clone(config.all_pai))
  }
  /**检测两家都亮牌后的发牌情况！或者两家都过的发牌情况 */
  static player23_liangTest() {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 b2 b3 b5 b5 b6 b7 b8 b8 t1 t4 t9 fa")
    var player2 = pais("b1 b1 b1 b2 b3 b6 b7 b8 t1 t2 t3 zh zh")
    var player3 = pais("b7 b8 b9 t1 t2 t3 t4 t5 t6 t7 di di di")
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    ;[player1, player2, player3].forEach(paiItems => {
      paiItems.forEach((pai, index) => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    return newPais
  }
  /**除了暗四归，还能检测亮牌 */
  static player2_anSiGui(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 b2 b3 b5 b5 b6 b7 b8 b8 t1 t4 t9 fa")
    var player2 = pais("b1 b1 b1 b2 b3 b6 b7 b8 t1 t2 t3 zh zh")
    var player3 = pais("b2 b5 b6 b7 b8 b9 t1 t4 t6 t7 di di di")
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    ;[player1, player2, player3].forEach(paiItems => {
      paiItems.forEach((pai, index) => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    return newPais
  }
  static player2_mingSiGui(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 b2 b3 b5 b5 b6 b7 b8 b8 t1 t4 t9 fa")
    var player2 = pais("b1 b1 b9 t1 t1 t2 t3 t6 t7 t8 zh zh zh")
    var player3 = pais("b1 b5 b6 b7 b8 b9 t1 t4 t6 t7 di di di")
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    ;[player1, player2, player3].forEach(paiItems => {
      paiItems.forEach((pai, index) => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    return newPais
  }
  /**庄家开局双自杠，他人放杠，后自摸 */
  static player1_3gang() {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 b1 b1 b1 b2 b2 b2 b2 t9 t9 di di di")
    var player2 = pais("t1 t1 t1 t1 t4 t6 zh zh zh fa fa fa di") //放di扛给player1
    var player3 = pais("b3 t3 t3 t3 t4 t5 t6 t6 t7 t7 t8 t9 zh")
    //发牌需要有个顺序，不能使用pais
    var fa_pais = [6,7] //给b6,b7, 使用数字是因为pais会自动排序！
    var tails = [14,15]
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    newPais = newPais.concat(fa_pais)
    ;[player1, player2, player3,fa_pais].forEach(paiItems => {
      paiItems.forEach((pai) => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    newPais.push(...tails)
    return newPais
  }
  static playe3_gangshangGang(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 b1 b2 b2 b3 b4 b5 b6 b7 b8 b8 t9 fa")
    var player2 = pais("t1 t1 t1 t3 t4 t6 zh zh zh fa fa fa di")
    var player3 = pais("b1 b5 b6 b7 b8 b9 t1 t2 t7 t7 di di di")
    //发牌需要有个顺序，不能使用pais
    // var fa_pais = "t2 di".split(" ")
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    ;[player1, player2, player3].forEach(paiItems => {
      paiItems.forEach((pai) => {
        allpais.remove(pai)
      })
    })
    // fa_pais.forEach((pai, index) => {
    //   allpais.remove(pai);
    // });
    newPais = newPais.concat(allpais)

    return newPais
  }
  /**玩家2杠上花*/
  static playe2_gangshangHua(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 b1 b2 b2 b3 b3 b5 b6 b7 b8 b8 b9 fa")
    var player2 = pais("t1 t1 t1 t3 t4 t5 zh zh zh fa fa fa di")
    var player3 = pais("b4 b5 b6 b7 b8 b9 t1 t7 t7 t7 t8 t8 t9")
    //发牌需要有个顺序，不能使用pais
    // var fa_pais = "t2 di".split(" ")
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    ;[player1, player2, player3].forEach(paiItems => {
      paiItems.forEach((pai, index) => {
        allpais.remove(pai)
      })
    })
    // fa_pais.forEach((pai, index) => {
    //   allpais.remove(pai);
    // });
    //保证最后一张牌是di
    allpais.remove("di")
    // allpais[allpais.length - 1] = "di";
    newPais = newPais.concat(allpais)

    return newPais
  }

  /**庄家摸牌能自摸，天胡*/
  static zhuang_mopai_hu(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 b1 b2 b2 b3 b3 b5 b6 b7 b7 b8 b9 fa")
    var player2 = pais("b1 t1 t1 t1 t3 t4 t5 zh zh zh fa fa di")
    var player3 = pais("b4 b5 b6 b7 b8 b9 t1 t7 t7 t7 t8 t8 t9")
    //发牌需要有个顺序，不能使用pais
    var fa_pais = pais("fa")
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    newPais = newPais.concat(fa_pais)
    ;[player1, player2, player3, fa_pais].forEach(paiItems => {
      paiItems.forEach((pai, index) => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    return newPais
  }
  /**庄家摸牌能杠*/
  static zhuang_mopai_gang(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("t1 t1 t1 t1 t7 b8 b9 zh zh fa di di di")
    var player2 = pais("b1 b1 b2 b2 b3 b3 b5 b6 b7 b8 b8 b9 fa")
    var player3 = pais("b4 b5 b6 b7 b8 b9 t2 t7 t7 t7 t8 t8 t9")
    var fa_pais = pais("di")
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    newPais = newPais.concat(fa_pais)
    ;[player1, player2, player3, fa_pais].forEach(paiItems => {
      paiItems.forEach((pai, index) => {
        allpais.remove(pai)
      })
    })

    newPais = newPais.concat(allpais)
    return newPais
  }
  /**七对放炮 */
  static player2_qidiu_ting(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 b5 t1 t3 t7 b8 b9 zh zh fa fa di di")
    var player2 = pais("b1 b1 b2 b2 b3 b3 b5 b7 b7 b8 b8 b9 b9") //胡b5七对
    var player3 = pais("b4 b4 b6 b7 b8 b9 t2 t7 t7 t7 t8 t8 t9")
    var fa_pais = pais("di")
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    newPais = newPais.concat(fa_pais)
    ;[player1, player2, player3, fa_pais].forEach(paiItems => {
      paiItems.forEach((pai, index) => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    return newPais
  }
  /**player2碰fa打t7后能亮 */
  static peng_da_liang(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 t1 t1 t3 t7 t8 t9 zh zh fa di di di")
    var player2 = pais("b1 b1 b7 b8 b9 t1 t2 t3 t4 t5 t7 fa fa")
    var player3 = pais("b5 b6 b7 b8 b9 t4 t4 t6 t7 t8 t9 zh zh")
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    ;[player1, player2, player3].forEach(paiItems => {
      paiItems.forEach((pai, index) => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    return newPais
  }
  /**庄家打牌就有人能碰 */
  static zhuang_fangPeng(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 t1 t1 t3 t7 t8 t9 zh zh fa di di di")
    var player2 = pais("b1 b1 b1 b2 b3 b4 t1 t2 t4 t5 zh fa fa")
    var player3 = pais("b5 b6 b7 b8 b9 t4 t4 t6 t7 t8 t9 zh zh")
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    ;[player1, player2, player3].forEach(paiItems => {
      paiItems.forEach((pai, index) => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    return newPais
  }
  /**庄家打b1后player2能杠 */
  static zhuang_fangGang(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 t1 t1 t3 t7 t8 t9 zh zh fa di di di")
    var player2 = pais("b1 b1 b1 b2 b3 b4 t1 t2 t4 t5 zh fa fa")
    var player3 = pais("b5 b6 b7 b8 b9 t4 t4 t6 t7 t8 t9 zh zh")
    var fa_pais = pais("t4 b9")
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    newPais = newPais.concat(fa_pais)
    ;[player1, player2, player3, fa_pais].forEach(paiItems => {
      paiItems.forEach(pai => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    return newPais
  }
  /**庄家打b1后player2能扛，打zh后player3扛上扛 */
  static player2_fang_GangShangGang(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 b2 t1 t1 t3 t7 t8 t9 t9 fa di di di")
    var player2 = pais("b1 b1 b1 b2 b3 b4 t1 t2 t4 t5 zh fa fa")
    var player3 = pais("b2 b6 b7 b8 b9 t4 t4 t6 t7 t8 zh zh zh")
    var fa_pais = pais("t4 b9")
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    newPais = newPais.concat(fa_pais)
    ;[player1, player2, player3, fa_pais].forEach(paiItems => {
      paiItems.forEach(pai => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    return newPais
  }
  /**庄家打牌就能亮 */
  static zhuang_dapai_liang(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 b2 b3 b4 b5 b6 t3 t4 t6 t7 t8 di di")
    var player2 = pais("b1 b1 b1 b2 b3 b4 t1 t2 t3 t6 fa fa di")
    var player3 = pais("b4 b5 b6 b7 b8 b9 t1 t7 t7 t7 t8 t8 di")
    var fa_pais = pais("t4")
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    newPais = newPais.concat(fa_pais)
    ;[player1, player2, player3, fa_pais].forEach(paiItems => {
      paiItems.forEach((pai, index) => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    return newPais
  }
  /**庄家打t6放player2屁胡炮 */
  static zhuang_dapai_fangpao(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 b2 b3 b4 b5 b6 t3 t4 t6 t7 t8 di di")
    var player2 = pais("b1 b1 b1 b2 b3 b4 t1 t2 t3 t7 t8 fa fa")
    var player3 = pais("b4 b5 b6 b7 b8 b9 t1 t7 t7 t7 t8 t8 di")
    var fa_pais = pais("t4")
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    newPais = newPais.concat(fa_pais)
    ;[player1, player2, player3, fa_pais].forEach(paiItems => {
      paiItems.forEach((pai, index) => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    return newPais
  }
  /**庄家打t6一炮双响 */
  static zhuang_dapai_shuang(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 b2 b3 b4 b5 b6 t3 t4 t6 t7 t8 di di") //放t6
    var player2 = pais("b1 b1 b1 b2 b3 b4 t1 t2 t3 t6 fa fa fa") //胡t6
    var player3 = pais("b2 b2 b3 b3 b4 b4 t6 t7 t7 t7 t8 t8 t8") //胡t6
    var fa_pais = pais("di")
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    newPais = newPais.concat(fa_pais)
    ;[player1, player2, player3, fa_pais].forEach(paiItems => {
      paiItems.forEach((pai, index) => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    return newPais
  }
  /**庄家杠上花 */
  static zhuang_GangShangHua(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 b2 b3 b4 b5 b6 t3 t3 t6 di di di di") //杠di摸t5胡牌
    var player2 = pais("b1 b1 b1 b2 b3 b4 t1 t2 t4 t6 fa fa fa")
    var player3 = pais("b2 b2 b3 b3 b4 b4 t1 t3 t5 t7 t8 t8 t9")
    var fa_pais = pais("t7")
    var tails = [15]
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    newPais = newPais.concat(fa_pais)
    ;[player1, player2, player3, fa_pais, tails].forEach(paiItems => {
      paiItems.forEach((pai, index) => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    newPais.push(...tails) //先删除掉，然后在数组最后添加这个t5, 以便杠上开花！
    return newPais
  }
  /**庄家双杠上花 */
  static zhuang_ShuangGangShangHua(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 b2 b3 b7 b7 b7 t3 t3 t6 di di di di")
    var player2 = pais("b1 b1 b1 b2 b3 b4 t1 t2 t4 t6 fa fa fa")
    var player3 = pais("b2 b2 b3 b3 b4 b4 t1 t3 t5 t7 t8 t8 t9")
    //发牌b7,扛b7,摸t7,扛di, 摸t5, 胡牌
    var fa_pais = pais("b7")
    var tails = [15, 17]
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    newPais = newPais.concat(fa_pais)
    ;[player1, player2, player3, fa_pais, tails].forEach(paiItems => {
      paiItems.forEach((pai, index) => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    newPais.push(...tails) //先删除掉，然后在数组最后添加这个t5, 以便杠上开花！
    return newPais
  }
  /**庄家放t2杠,扛上扛di,胡扛上花t5 */
  static zhuang_FangGangHuGang(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 b2 b3 b4 b5 b6 t2 t3 t5 t6 di di di") //放t2杠
    var player2 = pais("b1 b1 b1 b2 b3 b5 t2 t2 t2 t6 di fa fa") //放di扛上扛
    var player3 = pais("b2 b2 b3 b3 b4 b4 t1 t3 t5 t7 t8 t8 t9")
    //发牌t3,打t2, player扛后打di, player扛di之后摸t5, 胡牌！
    var fa_pais = pais("t3")
    var tails = [17, 15] //会自动排序，所以不使用pais
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    newPais = newPais.concat(fa_pais)
    ;[player1, player2, player3, fa_pais, tails].forEach(paiItems => {
      paiItems.forEach((pai, index) => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    newPais.push(...tails) //先删除掉，然后在数组最后添加tails, 以便杠上开花！
    return newPais
  }
  /**庄家能扛。但player2扛牌后能能胡，player3能亮 */
  static zhuangGang_Player2ZhiMo_player3Liang(): Pai[] {
    var allpais: Array<Pai> = TablePaiManager.fapai_random()

    var player1 = pais("b1 b1 b1 b1 b5 b6 t2 t3 t5 t6 di di di") //可扛
    var player2 = pais("b2 b3 b4 b5 b6 b7 t2 t3 t4 t4 fa fa fa") //player2也能亮，摸牌可胡
    var player3 = pais("b2 b3 b4 b7 b8 b9 t1 t2 t3 t7 t8 t8 t8") //也听胡
    //发牌t3,打t2, player扛后打di, player扛di之后摸t5, 胡牌！
    var fa_pais = pais("b2 t1 t3") //player1会先摸到b2
    var tails = [17, 15] //pais会自动排序，所以不使用
    var newPais = []
    newPais = newPais.concat(player1)
    newPais = newPais.concat(player2)
    newPais = newPais.concat(player3)
    newPais = newPais.concat(fa_pais)
    ;[player1, player2, player3, fa_pais, tails].forEach(paiItems => {
      paiItems.forEach((pai) => {
        allpais.remove(pai)
      })
    })
    newPais = newPais.concat(allpais)
    newPais.push(...tails) //先删除掉，然后在数组最后添加tails, 以便杠上开花！
    return newPais
  }
}

// console.log('====================================');
// console.log(TablePaiManager.fapai_gang());
// console.log('====================================');
