"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.all_pai = BING.repeat(4)
    .concat(TIAO.repeat(4))
    .concat(ZHIPAI.repeat(4));
exports.PORT = 3333; //服务器端口号，供服务器和客户端使用！
exports.FIRST_SHOUPAI_COUNT = 13;
exports.LIMIT_IN_ROOM = 3; //房间玩家人数上限
exports.MaxWaitTime = 10; //碰、杠牌时等待用户多少秒
exports.CountDownInterval = 1000; //碰、杠牌倒数的时间间隔,单位：毫秒
exports.IS_TING = 1;
exports.IS_LIANG = 2;
//此表中的type其实就是Majinang类中判断胡的方法，名称一致！
exports.HuPaiSheet = [
    { type: "HuisYise", name: "清一色", score: 1 },
    { type: "HuisKaWuXing", name: "卡五星", score: 1 },
    { type: "HuisQidui", name: "七对", score: 1 },
    { type: "HuisNongQiDui", name: "龙七对", score: 1 },
    { type: "HuisPengpeng", name: "碰碰胡", score: 1 },
    { type: "HuisXiaoShanYuan", name: "小三元", score: 1 },
    { type: "HuisDaShanYuan", name: "大三元", score: 1 },
    { type: "HuisGangShangKai", name: "杠上开花", score: 1 },
    { type: "HuisGangShangPao", name: "杠上炮", score: 1 },
    { type: "HuisPihu", name: "屁胡", score: 1 },
    { type: "HuisZiMo", name: "自摸", score: 1 },
    { type: "HuisMingSiGui", name: "明四归", score: 1 },
    { type: "HuisAnSiGui", name: "暗四归", score: 1 },
    { type: "HuisLiangDao", name: "亮倒", score: 1 },
];
/**放杠 */
exports.FangGang = "FangGang";
/**放杠上杠 */
exports.FangGangShangGang = "FangGangShangGang";
/**放屁胡炮 */
exports.FangPihuPao = "FangPihuPao";
/**放大胡炮 */
exports.FangDaHuPao = "FangDaHuPao";
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
exports.HuisYise = 0;
exports.HuisKaWuXing = 1;
exports.HuisQidui = 2;
exports.HuisNongQiDui = 3;
exports.HuisPengpeng = 4;
exports.HuisXiaoShanYuan = 5;
exports.HuisDaShanYuan = 6;
exports.HuisGangShangKai = 7;
exports.HuisGangShangPao = 8;
exports.HuisPihu = 9;
exports.HuisZiMo = 10;
/**明四归，碰了牌之后还是胡仅剩下的这张牌，就是明四归 */
exports.HuisMingSiGui = 11;
/**和上面的区别是三张牌不是碰的，是自己手起的，然后还胡这张牌 */
exports.HuisAnSiGui = 12;
/**亮倒 */
exports.HuisLiangDao = 13;
//end自动生成代码
//# sourceMappingURL=config.js.map