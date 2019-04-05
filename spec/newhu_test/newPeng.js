import test from "ava";
import { NMajiangAlgo } from "../../server_build/server/NMajiangAlgo";
import { PaiConvertor } from "../../server_build/server/PaiConverter";
/**直接将字符串转换成数类麻将数组 */
function pais(strs) {
    return PaiConvertor.pais(strs)
}
function to_number(str) {
    return PaiConvertor.ToNumber(str)
}

//能碰
test("能碰fa", function(t) {
    let str = pais("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa")
    t.is(NMajiangAlgo.canPeng(str, to_number("di")), true);
  });
  test("能碰t2", function(t) {
    let str = pais("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa")
    t.is(NMajiangAlgo.canPeng(str, to_number("zh")), true);
  });

//不能
test("不能碰di", function (t) {
    let str = pais("b1 b2 b3 b4 b5 b6 b7 t1 t2 t3 t4 t5 t6")
    t.is(NMajiangAlgo.canPeng(str, to_number("di")), false);
});
test("只有一个di,不能碰di", function (t) {
    let str = pais("di b2 b3 b4 b5 b6 b7 t1 t2 t3 t4 t5 t6")
    t.is(NMajiangAlgo.canPeng(str, to_number("di")), false);
});
test("不能碰b1", function (t) {
    let str = pais("b2 b3 b5 b7 b8 b9 t2 t3 t6 t8 zh zh zh")
    t.is(NMajiangAlgo.canPeng(str, to_number("b1")), false);
});
test("只有一个b1,不能碰b1", function (t) {
    let str = pais("b1 b3 b5 b7 b8 b9 t2 t3 t6 t8 zh zh zh")
    t.is(NMajiangAlgo.canPeng(str, to_number("b1")), false);
});
test("group 亮牌不能碰", function (t) {
    let group_shou_pai = {
        // anGang: ["zh"],
        anGang: [],
        anGangCount: 0,
        mingGang: [],
        selfPeng: [],
        selfPengCount: 1,
        peng: pais(["b1"]),
        shouPai: pais("b1 b2 b3 t1 t1 t2 t2 t3 t3 fa")
    };
    t.is(NMajiangAlgo.canPeng(group_shou_pai.shouPai, to_number("t1"), true), false);
});
