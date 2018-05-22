"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const MajiangAlgo_1 = require("../../server/MajiangAlgo");
// 屁胡
ava_1.default("普通屁胡", function (t) {
    let str = "b1 b2 b2 b3 b3 b4 t4 t5  fa fa fa zh zh";
    let na_pai = "t6";
    t.is(MajiangAlgo_1.MajiangAlgo._HuisPihu(MajiangAlgo_1.getArr(str), na_pai), true);
});
ava_1.default("多个同花色规则屁胡", function (t) {
    let str = " b2 b2 b3 b3 b4 t4 t5 t5 t5 t6 fa fa fa";
    let na_pai = "b1";
    t.is(MajiangAlgo_1.MajiangAlgo._HuisPihu(MajiangAlgo_1.getArr(str), na_pai), true);
});
ava_1.default("带杠屁胡", function (t) {
    let str = "t1 t3 t4 t5 t6 b4 b5 b6 fa fa fa fa zh zh";
    let na_pai = "t2";
    t.is(MajiangAlgo_1.MajiangAlgo._HuisPihu(MajiangAlgo_1.getArr(str), na_pai), true);
});
ava_1.default("双杠屁胡", function (t) {
    let str = " b1 b1 b1 b2 b2 b2 b2 t1 t2 t2 t3 t3 t4 t5 t5";
    let na_pai = "b1";
    t.is(MajiangAlgo_1.MajiangAlgo._HuisPihu(MajiangAlgo_1.getArr(str), na_pai), true);
});
ava_1.default("三杠屁胡", function (t) {
    let str = " b1 b1 b1 b2 b2 b2 b2 t1 t2 t2 t3 t3 t4 t5 t5";
    let na_pai = "b1";
    t.is(MajiangAlgo_1.MajiangAlgo._HuisPihu(MajiangAlgo_1.getArr(str), na_pai), true);
});
ava_1.default("单杠屁胡，其中四张连续并非杠", function (t) {
    let str = "b1 b1 b1 b1 b2 b3 di di di fa zh zh zh zh";
    let na_pai = "fa";
    t.is(MajiangAlgo_1.MajiangAlgo._HuisPihu(MajiangAlgo_1.getArr(str), na_pai), true);
});
ava_1.default("屁胡清一色", function (t) {
    let str = "b1 b2 b3 b3 b4 b4 b5 b5 b5 b5 b6 b7 b7";
    let na_pai = "b2";
    t.is(MajiangAlgo_1.MajiangAlgo._HuisPihu(MajiangAlgo_1.getArr(str), na_pai), true);
});
//以前的算法，屁胡是能够将加上2，3ABC这样来检测的，现在是不能了，屁胡就是4句话+将。
ava_1.default("少张屁胡 false", function (t) {
    let str = "b1 b1 b2 b3 b7 b7 b7 b7 b8 b9";
    let na_pai = "b1";
    t.is(MajiangAlgo_1.MajiangAlgo._HuisPihu(MajiangAlgo_1.getArr(str), na_pai), false);
});
ava_1.default("非屁胡 should behave...", function (t) {
    let str = "b2 b2 b3 b3 b4 t4 t5 t6 fa fa fa zh t9";
    let na_pai = "b1";
    t.is(MajiangAlgo_1.MajiangAlgo._HuisPihu(MajiangAlgo_1.getArr(str), na_pai), false);
});
ava_1.default("非屁胡 将都没有", function (t) {
    let str = "b2b3";
    let na_pai = "b1";
    t.is(MajiangAlgo_1.MajiangAlgo._HuisPihu(MajiangAlgo_1.getArr(str), na_pai), false);
});
ava_1.default("group不是清一色", function (t) {
    let str = "b3 b4 b7 b8";
    let na_pai = "b9";
    let group_shoupai = {
        anGang: ['b1'],
        mingGang: [],
        selfPeng: [],
        peng: ['b5', 'b2'],
        shouPai: str.split(' ')
    };
    //b1 b1 b1 b1 b2 b2 b2 b3 b4 b5 b5 b5 b7 b8 b9
    // t.is(MajiangAlgo._HuisPihu(MajiangAlgo.flat_shou_pai(grou_shoupai)),true)
    t.is(MajiangAlgo_1.MajiangAlgo.HuisPihu(group_shoupai, na_pai), false);
});
ava_1.default("flat可胡，group不能", function (t) {
    let na_pai = "t3";
    let group_shoupai = {
        anGang: [],
        mingGang: ['b1'],
        selfPeng: [],
        peng: ['fa', 'b2'],
        shouPai: ['b3', 'b4', 't4', 't5']
    };
    //b1 b1 b1 b1 b2 b2   b2 b3 b4   t3 t4 t5   fa fa fa fa
    t.is(MajiangAlgo_1.MajiangAlgo._HuisPihu(MajiangAlgo_1.MajiangAlgo.flat_shou_pai(group_shoupai), na_pai), true);
    t.is(MajiangAlgo_1.MajiangAlgo.HuisPihu(group_shoupai, na_pai), false);
});
ava_1.default("屁胡 胡将", function (t) {
    let str = "b9";
    let na_pai = "b9";
    let group_shoupai = {
        anGang: ['b1'],
        mingGang: ['t1'],
        peng: ['b5', 'b2'],
        selfPeng: [],
        shouPai: str.split(' ')
    };
    t.is(MajiangAlgo_1.MajiangAlgo.HuisPihu(group_shoupai, na_pai), true);
});
//# sourceMappingURL=ts-pihu.js.map