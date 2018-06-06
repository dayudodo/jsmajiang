import * as util from "util";

declare global {

  interface Array<T> {
    /** 复制一个数组*/
    repeat(o: number): T[];
  }
  interface WebSocket {
    /** 扩展的socket id号， */
    id: number;
    /** 扩展发送msg对象 */
    sendmsg(msg): void;
  }
  /**定义个pai类型的别名，以后会变！ */
  type Pai = string;
  /**事件类型，以后可能改为数值 */
  type EVENT_TYPE = string;


}


if (!Array.prototype.repeat) {
  Array.prototype.repeat = function (times) {
    var result = [];
    for (var i = 0; i < times; i++) {
      this.map(item => {
        result.push(item);
      });
    }
    return result;
  };
}

var WebSocket = require("ws");
WebSocket.prototype.sendmsg = function (msg) {
  this.send(JSON.stringify(msg));
};

const BING = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"];
const TIAO = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"];
// 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
const ZHIPAI = ["zh", "fa", "di"];

export const all_pai = BING.repeat(4)
  .concat(TIAO.repeat(4))
  .concat(ZHIPAI.repeat(4));

export var PORT = 3333; //服务器端口号，供服务器和客户端使用！
export const FIRST_SHOUPAI_COUNT = 13;
export const LIMIT_IN_ROOM = 3; //房间玩家人数上限
export const MaxWaitTime = 10; //碰、杠牌时等待用户多少秒
export const CountDownInterval = 1000; //碰、杠牌倒数的时间间隔,单位：毫秒

export const IS_TING = 1;
export const IS_LIANG = 2;

/**是否封顶，貌似满上其实就是封顶，不算多算了，比如七对自摸是满的，8倍？ */
export const has_top = false

/**基本分数，貌似都是上百的算 */
export const base_score = 100



export const FangGang = 0
export const FangGangShangGang = 1
export const FangPihuPao = 2
export const FangDaHuPao = 3

export const FangSheet = [
  { type: "FangGang", name:"放杠", score: 1},
  { type: "FangGangShangGang", name:"放杠上杠", score: 2},
  { type: "FangPihuPao", name:"放屁胡炮", score: 1},
  { type: "FangDaHuPao", name:"放大胡炮", score: 1},
]

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
export const HuisYise = 0;
export const HuisKaWuXing = 1;
export const HuisQidui = 2;
export const HuisNongQiDui = 3;
export const HuisPengpeng = 4;
export const HuisXiaoShanYuan = 5;
export const HuisDaShanYuan = 6;
export const HuisGangShangKai = 7;
export const HuisGangShangPao = 8;
export const HuisPihu = 9;
export const HuisZiMo = 10;
/**明四归，碰了牌之后还是胡仅剩下的这张牌，就是明四归 */
export const HuisMingSiGui = 11;
/**和上面的区别是三张牌不是碰的，是自己手起的，然后还胡这张牌 */
export const HuisAnSiGui = 12;
/**亮倒 */
export const HuisLiangDao = 13;
export const HuisGang = 14;
export const HuisChaPao = 15;
export const HuisAnGang = 16;

//end自动生成代码

//此表中的type其实就是Majinang类中判断胡的方法，名称一致！
export const HuPaiSheet = [
  { type: HuisYise, name: "清一色", multiple: 4 },
  { type: HuisKaWuXing, name: "卡五星", multiple: 2 },
  { type: HuisQidui, name: "七对", multiple: 4 },
  { type: HuisNongQiDui, name: "龙七对", multiple: 8 },
  { type: HuisPengpeng, name: "碰碰胡", multiple: 2 },
  { type: HuisXiaoShanYuan, name: "小三元", multiple: 4 },
  { type: HuisDaShanYuan, name: "大三元", multiple: 8 },
  { type: HuisGangShangKai, name: "杠上开花", multiple: 2 },
  { type: HuisGangShangPao, name: "杠上炮", multiple: 2 },
  { type: HuisPihu, name: "屁胡", multiple: 1 },
  //自摸比较特殊，不算番，而是其它两家出钱！
  { type: HuisZiMo, name: "自摸", multiple: 0 },
  { type: HuisMingSiGui, name: "明四归", multiple: 2 },
  { type: HuisAnSiGui, name: "暗四归", multiple: 4 },
  { type: HuisLiangDao, name: "亮倒", multiple: 2 },
  //自己摸杠分两种情况，完全手起4个，两家出，如果碰了一个，后来再找一个，这叫擦炮。
  //放在胡里面是因为也算是一种胡，收钱了么
  { type: HuisGang, name: "扛", multiple: 2 },
  { type: HuisChaPao, name: "擦炮", multiple: 1 },
  { type: HuisAnGang, name: "暗杠", multiple: 1 },
];