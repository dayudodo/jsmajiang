"use strict";
// import * as util from "util";
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
exports.base_score = 5;
/**是否有漂，一般都会有，比如5定5，定5 意思就是定漂5块钱，赢多进5块，输多出5块 */
exports.have_piao = true;
exports.piao_score = 5;
/**是否封顶，即最高8倍，超过了也只是8倍 */
exports.have_top = true;
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
/**普通杠 */
exports.HuisGang = 14;
/**擦炮 */
exports.HuisCaPao = 15;
/**暗杠 */
exports.HuisAnGang = 16;
exports.HuisGangShangGang = 17;
//end自动生成代码
//此表中的type其实就是Majinang类中判断胡的方法，名称一致！
exports.HuPaiSheet = [
    { type: exports.HuisYise, name: "清一色", multiple: 4 },
    { type: exports.HuisKaWuXing, name: "卡五星", multiple: 4 },
    { type: exports.HuisQidui, name: "七对", multiple: 4 },
    //因为龙七对之前会先检测是否是七对，所以龙七对倍数是4，合起来就是8了
    { type: exports.HuisNongQiDui, name: "龙七对", multiple: 4 },
    { type: exports.HuisPengpeng, name: "碰碰胡", multiple: 2 },
    { type: exports.HuisXiaoShanYuan, name: "小三元", multiple: 2 },
    { type: exports.HuisDaShanYuan, name: "大三元", multiple: 4 },
    { type: exports.HuisGangShangKai, name: "杠上开花", multiple: 2 },
    { type: exports.HuisGangShangPao, name: "杠上炮", multiple: 2 },
    { type: exports.HuisPihu, name: "屁胡", multiple: 1 },
    //自摸比较特殊，不算番，而是其它两家出钱！自摸是胡上加番的方式，并非基本胡
    //象屁胡、七对、碰碰、卡五星是基本的
    { type: exports.HuisMingSiGui, name: "明四归", multiple: 2 },
    { type: exports.HuisAnSiGui, name: "暗四归", multiple: 4 },
    //特殊的两种胡牌算番，亮倒呢是要把所有本金的胡分翻倍！包括下面的杠其实都是不包括multiple的
    { type: exports.HuisZiMo, name: "自摸" },
    { type: exports.HuisLiangDao, name: "亮倒" },
    //自己摸杠分两种情况，完全手起4个，两家出，如果碰了一个，后来再找一个，这叫擦炮。
    //放在胡里面是因为也算是一种胡，收钱了么
    //普通杠放杠者出钱，如同自摸一样，杠其实也是另外算的，在这儿只是起到一个名称的作用！
    //以下杠只是要取得名称，不起作用
    { type: exports.HuisGang, name: "扛" },
    //下面两种其它两家给钱！
    { type: exports.HuisCaPao, name: "擦炮" },
    { type: exports.HuisAnGang, name: "暗杠" },
    { type: exports.HuisGangShangGang, name: "杠上杠" },
];
//在这儿才是真正的结算表！特殊的杠，就算是不胡也是要算钱的！
exports.GangWinSheet = [
    { type: exports.HuisGang, name: "扛", multiple: 1 },
    //下面两种其它两家给钱！
    { type: exports.HuisCaPao, name: "擦炮", multiple: 1 },
    { type: exports.HuisAnGang, name: "暗杠", multiple: 2 },
    { type: exports.HuisGangShangGang, name: "杠上杠", multiple: 2 },
];
exports.LoseGang = 0;
exports.LoseGangShangGang = 1;
// export const LosePihuPao = 2;
// export const LoseDaHuPao = 3;
exports.LoseAnGang = 4;
exports.LoseCaPao = 5;
// export const LoseZiMo = 6;
/**他人的自摸也会在这儿体现！暗杠、擦炮的扣分都记录在此 */
exports.GangLoseSheet = [
    { type: exports.LoseGang, name: "放杠", multiple: 1 },
    { type: exports.LoseGangShangGang, name: "放杠上杠", multiple: 2 },
    // { type: LosePihuPao, name: "放屁胡炮", multiple: 1 },
    // { type: LoseDaHuPao, name: "放大胡炮", multiple: 1 },
    { type: exports.LoseAnGang, name: "被暗杠", multiple: 2 },
    { type: exports.LoseCaPao, name: "被擦炮", multiple: 1 },
];
//# sourceMappingURL=config.js.map