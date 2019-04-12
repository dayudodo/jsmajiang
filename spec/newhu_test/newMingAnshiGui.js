import test from "ava";
import { NMajiangAlgo } from "../../server_build/server/NMajiangAlgo";
import { PaiConvertor } from "../../server_build/server/PaiConvertor";
/**直接将字符串转换成数类麻将数组 */
function pais(strs) {
    return PaiConvertor.pais(strs)
}
function to_number(str) {
    return PaiConvertor.ToNumber(str)
}

//哪种胡类型
test("非明四归", function (t) {
    // let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh";
    let na_pai = to_number("b8")
    let group_shoupai = {
        anGang: [],
        mingGang: [],
        peng: pais(["b1", "b2"]),
        selfPeng: [],
        shouPai: pais(["b3", "b4", "b5", "b6", "b7", "b8", "b8"])
    };
    t.is(NMajiangAlgo.HuisMingSiGui(group_shoupai, na_pai), false);
});
test("明四归", function (t) {
    // let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh";
    let na_pai = to_number("b2")
    let group_shoupai = {
        anGang: [],
        mingGang: [],
        peng: pais(["b1", "b2"]),
        selfPeng: [],
        shouPai: pais(["b3", "b4", "b5", "b6", "b7", "b8", "b8"])
    };
    t.is(NMajiangAlgo.HuisMingSiGui(group_shoupai, na_pai), true);
});

test("明四归，但是非暗四归", function (t) {
    // let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh";
    let na_pai = to_number("b2")
    let group_shoupai = {
        anGang: [],
        mingGang: [],
        peng: pais(["b1", "b2"]),
        selfPeng: [],
        shouPai: pais(["b3", "b4", "b5", "b6", "b7", "b8", "b8"])
    };
    t.is(NMajiangAlgo.HuisAnSiGui(group_shoupai, na_pai), false);
});

test("亮倒后明四归，不亮暗四归", function (t) {
    // let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh";
    let na_pai = to_number("t7")
    let group_shoupai = {
        anGang: [],
        mingGang: [],
        peng: [],
        selfPeng: [],
        shouPai: pais("b4 b5 b6 b7 b8 b9 t6 t7 t7 t7 t8 t8 t9")
    };
    t.is(NMajiangAlgo.HuisMingSiGui(group_shoupai, na_pai, true), true);
    t.is(NMajiangAlgo.HuisMingSiGui(group_shoupai, na_pai, false), false);
    t.is(NMajiangAlgo.HuisAnSiGui(group_shoupai, na_pai, true), false);
    t.is(NMajiangAlgo.HuisAnSiGui(group_shoupai, na_pai, false), true);
});

test("暗四归，非明四归", function (t) {
    // let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh";
    let na_pai = to_number("b2")
    let group_shoupai = {
        anGang: [],
        mingGang: [],
        peng: pais(["b1"]),
        selfPeng: [],
        shouPai: pais(["b2", "b2", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b8"])
    };
    t.is(NMajiangAlgo.HuisAnSiGui(group_shoupai, na_pai), true);
    t.is(NMajiangAlgo.HuisMingSiGui(group_shoupai, na_pai), false);
});

test("暗四归SelfPeng", function (t) {
    // let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh";
    let na_pai = to_number("b2")
    let group_shoupai = {
        anGang: [],
        mingGang: [],
        peng: pais(["b1"]),
        selfPeng: pais(["b2"]),
        shouPai: pais(["b3", "b4", "b5", "b6", "b7", "b8", "b8"])
    };
    t.is(NMajiangAlgo.HuisAnSiGui(group_shoupai, na_pai), true);
});

