import test from "ava";
import { NMajiangAlgo } from "../../server_build/server/NMajiangAlgo";
import { PaiConvertor } from "../../server_build/server/PaiConvertor";
// var Majiang = require("../server/Majiang");
// var mj = new Majiang()
/**f直接将字符串转换成数类麻将数组 */
function pais(strs) {
    return PaiConvertor.pais(strs);
}

// 屁胡
test("普通屁胡", function (t) {
    let str = "b1 b2 b2 b3 b3 b4 t4 t5 fa fa fa zh zh";
    let na_pai = pais("t6");
    str = pais(str)
    t.is(NMajiangAlgo.jiangJiJuhua(str, na_pai), true);
});
test("多个同花色规则屁胡", function (t) {
    let str = " b2 b2 b3 b3 b4 t4 t5 t5 t5 t6 fa fa fa";
    let na_pai = pais("b1");
    str = pais(str)
    t.is(NMajiangAlgo.jiangJiJuhua(str, na_pai), true);
});
test("带杠屁胡", function (t) {
    let str = "t1 t3 t4 t5 t6 b4 b5 b6 fa fa fa fa zh zh";
    let na_pai = pais("t2");
    str = pais(str)
    t.is(NMajiangAlgo.jiangJiJuhua(str, na_pai), true);
});
test("双杠屁胡", function (t) {
    let str = " b1 b1 b1 b2 b2 b2 b2 t1 t2 t2 t3 t3 t4 t5 t5";
    let na_pai = pais("b1");
    str = pais(str)
    t.is(NMajiangAlgo.jiangJiJuhua(str, na_pai), true);
});
test("三杠屁胡", function (t) {
    let str = " b1 b1 b1 b2 b2 b2 b2 t1 t2 t2 t3 t3 t4 t5 t5";
    // let na_pai = "b1";
    let na_pai = pais("b1");
    str = pais(str)
    t.is(NMajiangAlgo.jiangJiJuhua(str, na_pai), true);
});
test("单杠屁胡，其中四张连续并非杠", function (t) {
    let str = "b1 b1 b1 b1 b2 b3 di di di fa zh zh zh zh";
    // let na_pai = "fa";
    let na_pai = pais("fa");
    str = pais(str)
    t.is(NMajiangAlgo.jiangJiJuhua(str, na_pai), true);
});
test("屁胡清一色", function (t) {
    let str = "b1 b2 b3 b3 b4 b4 b5 b5 b5 b5 b6 b7 b7";
    // let na_pai = "b2";
    let na_pai = pais("b2");
    str = pais(str)
    t.is(NMajiangAlgo.jiangJiJuhua(str, na_pai), true);
});

test("非屁胡 should behave...", function (t) {
    let str = "b2 b2 b3 b3 b4 t4 t5 t6 fa fa fa zh t9";
    // let na_pai = "b1";
    let na_pai = pais("b1");
    str = pais(str)
    t.is(NMajiangAlgo.jiangJiJuhua(str, na_pai), false);
});
test("非屁胡 将都没有", function (t) {
    let str = "b2b3";
    // let na_pai = "b1";
    let na_pai = pais("b1");
    str = pais(str)
    t.is(NMajiangAlgo.jiangJiJuhua(str, na_pai), false);
});