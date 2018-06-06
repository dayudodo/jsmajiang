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
/**是否封顶，貌似满上其实就是封顶，不算多算了，比如七对自摸是满的，8倍？ */
exports.has_top = false;
/**基本分数，貌似都是上百的算 */
exports.base_score = 100;
exports.FangGang = 0;
exports.FangGangShangGang = 1;
exports.FangPihuPao = 2;
exports.FangDaHuPao = 3;
exports.FangSheet = [
    { type: "FangGang", name: "放杠", score: 1 },
    { type: "FangGangShangGang", name: "放杠上杠", score: 2 },
    { type: "FangPihuPao", name: "放屁胡炮", score: 1 },
    { type: "FangDaHuPao", name: "放大胡炮", score: 1 },
];
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
exports.HuisGang = 14;
exports.HuisChaPao = 15;
exports.HuisAnGang = 16;
//end自动生成代码
//此表中的type其实就是Majinang类中判断胡的方法，名称一致！
exports.HuPaiSheet = [
    { type: exports.HuisYise, name: "清一色", multiple: 4 },
    { type: exports.HuisKaWuXing, name: "卡五星", multiple: 2 },
    { type: exports.HuisQidui, name: "七对", multiple: 4 },
    { type: exports.HuisNongQiDui, name: "龙七对", multiple: 8 },
    { type: exports.HuisPengpeng, name: "碰碰胡", multiple: 2 },
    { type: exports.HuisXiaoShanYuan, name: "小三元", multiple: 4 },
    { type: exports.HuisDaShanYuan, name: "大三元", multiple: 8 },
    { type: exports.HuisGangShangKai, name: "杠上开花", multiple: 2 },
    { type: exports.HuisGangShangPao, name: "杠上炮", multiple: 2 },
    { type: exports.HuisPihu, name: "屁胡", multiple: 1 },
    //自摸比较特殊，不算番，而是其它两家出钱！
    { type: exports.HuisZiMo, name: "自摸", multiple: 0 },
    { type: exports.HuisMingSiGui, name: "明四归", multiple: 2 },
    { type: exports.HuisAnSiGui, name: "暗四归", multiple: 4 },
    { type: exports.HuisLiangDao, name: "亮倒", multiple: 2 },
    //自己摸杠分两种情况，完全手起4个，两家出，如果碰了一个，后来再找一个，这叫擦炮。
    //放在胡里面是因为也算是一种胡，收钱了么
    { type: exports.HuisGang, name: "扛", multiple: 2 },
    { type: exports.HuisChaPao, name: "擦炮", multiple: 1 },
    { type: exports.HuisAnGang, name: "暗杠", multiple: 1 },
];
//# sourceMappingURL=config.js.map