// import * as util from "util";

declare global {
  interface Array<T> {
    /** 复制一个数组*/
    repeat(o: number): T[]
  }
  interface WebSocket {
    /** 扩展的socket id号， */
    id: number
    /** 扩展发送msg对象 */
    sendmsg(msg): void
  }
  /**定义个pai类型的别名，以后会变！ */
  // type Pai = string;
  type Pai = number
  /**事件类型，以后可能改为数值 */
  type EVENT_TYPE = string
}

if (!Array.prototype.repeat) {
  Array.prototype.repeat = function(times) {
    var result = []
    for (var i = 0; i < times; i++) {
      this.map(item => {
        result.push(item)
      })
    }
    return result
  }
}

var WebSocket = require("ws")
//todo: 此处可以替换成probuf，以便提高速度
WebSocket.prototype.sendmsg = function(msg: any) {
  this.send(JSON.stringify(msg))
}

var BING: Array<Pai> = [1, 2, 3, 4, 5, 6, 7, 8, 9] //小于10的就是饼
var TIAO: Array<Pai> = [11, 12, 13, 14, 15, 16, 17, 18, 19] //大于10并且小于20的是条
//卡五星里面暂时用不上这个万，只有上面的两种可以使用
var WAN: Array<Pai> = [21, 22, 23, 24, 25, 26, 27, 28, 29]
// 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
var ZHIPAI: Array<Pai> = [31, 33, 35]
export const TYPE_BING = 0
export const TYPE_TIAO = 1
export const TYPE_ZHIPAI = 2

export const all_pai = BING.repeat(4)
  .concat(TIAO.repeat(4))
  .concat(ZHIPAI.repeat(4))

export var PORT = 3333 //服务器端口号，供服务器和客户端使用！
export const FIRST_SHOUPAI_COUNT = 13
export const LIMIT_IN_ROOM = 3 //房间玩家人数上限
export const MaxWaitTime = 10 //碰、杠牌时等待用户多少秒
export const CountDownInterval = 1000 //碰、杠牌倒数的时间间隔,单位：毫秒

export const IS_TING = 1
export const IS_LIANG = 2

/**是否封顶，貌似满上其实就是封顶，不算多算了，比如七对自摸是满的，8倍？ */
export const has_top = false

/**基本分数，平时玩的小，5块起步 */
export var base_score = 5
/**是否有漂，一般都会有，比如5定5，定5 意思就是定漂5块钱，赢多进5块，输多出5块 */
export var have_piao = true
export var piao_score = 5

/**是否封顶，即最高8倍，超过了也只是8倍 */
export var have_top = true

// var output = "";
// HuPaiSheet.forEach((item, index) => {
//   var template = `export const ${item.type} = ${index}\n`;
//   output = output + template;
// });
// console.log(output);

//生成WhatKindOfHu里面的if体，不容易出错，以后再有新的胡办法，直接生成即可
// output = ""
// HuPaiSheet.forEach(item => {
//   var template =
// ` if(this.${item.type}(str,na_pai)){
//     _huArr.push(config.${item.type});
//   }\n`;
//   output = output + template
// });
// console.log(output);
//start自动生成代码, 运行上面的代码
export const IsYise = 0 //只判断是否是一色，还需要配合其它进行计算！
export const HuisKaWuXing = 1
export const HuisQidui = 2
export const HuisNongQiDui = 3
export const HuisPengpeng = 4
export const HuisXiaoShanYuan = 5
export const HuisDaShanYuan = 6
export const HuisGangShangKai = 7
export const HuisGangShangPao = 8
export const HuisPihu = 9
export const HuisZiMo = 10
/**明四归，碰了牌之后还是胡仅剩下的这张牌，就是明四归 */
export const HuisMingSiGui = 11
/**和上面的区别是三张牌不是碰的，是自己手起的，然后还胡这张牌 */
export const HuisAnSiGui = 12
/**亮倒 */
export const HuisLiangDao = 13
/**普通杠 */
export const HuisGang = 14
/**擦炮 */
export const HuisCaPao = 15
/**暗杠 */
export const HuisAnGang = 16
export const HuisGangShangGang = 17

//end自动生成代码

//此表中的type其实就是Majinang类中判断胡的方法，名称一致！
export const HuPaiSheet = [
  { type: IsYise, name: "清一色", multiple: 4 },
  { type: HuisKaWuXing, name: "卡五星", multiple: 4 },
  { type: HuisQidui, name: "七对", multiple: 4 },
  //因为龙七对之前会先检测是否是七对，所以龙七对倍数是4，合起来就是8了
  { type: HuisNongQiDui, name: "龙七对", multiple: 4 },
  { type: HuisPengpeng, name: "碰碰胡", multiple: 2 },
  { type: HuisXiaoShanYuan, name: "小三元", multiple: 2 },
  { type: HuisDaShanYuan, name: "大三元", multiple: 4 },
  { type: HuisGangShangKai, name: "杠上开花", multiple: 2 },
  { type: HuisGangShangPao, name: "杠上炮", multiple: 2 },
  { type: HuisPihu, name: "屁胡", multiple: 1 },
  //特殊的两种胡牌算番，亮倒呢是要把所有本金的胡分翻倍！包括下面的杠其实都是不包括multiple的
  { type: HuisZiMo, name: "自摸" },
  //自摸比较特殊，不算番，而是其它两家出钱！自摸是胡上加番的方式，并非基本胡
  //象屁胡、七对、碰碰、卡五星是基本的
  { type: HuisMingSiGui, name: "明四归", multiple: 2 },
  { type: HuisAnSiGui, name: "暗四归", multiple: 4 },
  { type: HuisLiangDao, name: "亮倒" },
  //自己摸杠分两种情况，完全手起4个，两家出，如果碰了一个，后来再找一个，这叫擦炮。
  //放在胡里面是因为也算是一种胡，收钱了么
  //普通杠放杠者出钱，如同自摸一样，杠其实也是另外算的，在这儿只是起到一个名称的作用！
  //以下杠只是要取得名称，不起作用
  { type: HuisGang, name: "扛" },
  //下面两种其它两家给钱！
  { type: HuisCaPao, name: "擦炮" },
  { type: HuisAnGang, name: "暗杠" },
  { type: HuisGangShangGang, name: "杠上杠" }
]

//在这儿才是真正的结算表！特殊的杠，就算是不胡也是要算钱的！
export const GangWinSheet = [
  { type: HuisGang, name: "扛", multiple: 1 },
  //下面两种其它两家给钱！
  { type: HuisCaPao, name: "擦炮", multiple: 1 },
  { type: HuisAnGang, name: "暗杠", multiple: 2 },
  { type: HuisGangShangGang, name: "杠上杠", multiple: 2 }
]

export const LoseGang = 0
export const LoseGangShangGang = 1
// export const LosePihuPao = 2;
// export const LoseDaHuPao = 3;
export const LoseAnGang = 4
export const LoseCaPao = 5
// export const LoseZiMo = 6;

/**他人的自摸也会在这儿体现！暗杠、擦炮的扣分都记录在此 */
export const GangLoseSheet = [
  { type: LoseGang, name: "放杠", multiple: 1 },
  { type: LoseGangShangGang, name: "放杠上杠", multiple: 2 },
  // { type: LosePihuPao, name: "放屁胡炮", multiple: 1 },
  // { type: LoseDaHuPao, name: "放大胡炮", multiple: 1 },
  { type: LoseAnGang, name: "被暗杠", multiple: 2 },
  { type: LoseCaPao, name: "被擦炮", multiple: 1 }
  // { type: LoseZiMo, name: "被自摸", multiple: 1 },
]
