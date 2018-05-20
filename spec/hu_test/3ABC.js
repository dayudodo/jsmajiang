import test from "ava";
import { MajiangAlgo, checkValidAndReturnArr } from "../../server_build/server/MajiangAlgo";

// describe('is3ABC group', function(t) {
test("is3ABC 正规九张牌", function (t) {
    let str = "b1 b2 b3 fa fa fa t1 t2 t3";
    t.is(MajiangAlgo.is3ABC(str), true);
});
test("is3ABC 九张 122334123", function (t) {
    let str = "b1 b2 b2 b3 b3 b4 t1 t2 t3";
    t.is(MajiangAlgo.is3ABC(str), true);
});
test("is3ABC 九张 112233456", function (t) {
    let str = "b1 b1 b2 b2 b3 b3 b4 b5 b6";
    t.is(MajiangAlgo.is3ABC(str), true);
});
test("is3ABC 九张 123445566", function (t) {
    let str = "b1 b2 b3 b4 b4 b5 b5 b6 b6";
    t.is(MajiangAlgo.is3ABC(str), true);
});
test("is3ABC 九张 ", function (t) {
    let str = "fa fa fa t1 t2 t3 t4 t5 t6";
    t.is(MajiangAlgo.is3ABC(str), true);
});


test("is3ABC 十张 ", function (t) {
    let str = "b1 b2 b3 b4 b4 b4 b4 b6 b6 b6";
    t.is(MajiangAlgo.is3ABC(str), true);
});
test("is3ABC 十张, 前一杠 ", function (t) {
    let str = "b1 b1 b1 b1 b3 b4 b5 b6 b6 b6";
    t.is(MajiangAlgo.is3ABC(str), true);
});
test("is3ABC 十张, 后一杠 ", function (t) {
    let str = "b1 b2 b3 b5 b6 b7 b8 b8 b8 b8";
    t.is(MajiangAlgo.is3ABC(str), true);
});
test("is3ABC 十张, 中间一杠 ", function (t) {
    let str = "b1 b2 b3 t1 t1 t1 t1 zh zh zh"
    t.is(MajiangAlgo.is3ABC(str), true);
});
test("is3ABC 十一张, 前二杠 ", function (t) {
    let str = "b1 b1 b1 b1 t1 t1 t1 t1 zh zh zh"
    t.is(MajiangAlgo.is3ABC(str), true);
});
test("is3ABC 十一张, 后二杠 ", function (t) {
    let str = "b1 b1 b1 t1 t1 t1 t1 zh zh zh zh"
    t.is(MajiangAlgo.is3ABC(str), true);
});
test("is3ABC 十一张, 后二杠 ", function (t) {
    let str = "b3 b4 b5 di di di di zh zh zh zh"
    t.is(MajiangAlgo.is3ABC(str), true);
});
test("is3ABC 十一张, 前后二杠 ", function (t) {
    let str = "b1 b1 b1 b1 t1 t2 t3 zh zh zh zh"
    t.is(MajiangAlgo.is3ABC(str), true);
});
test("is3ABC 十一张, 前后二杠false ", function (t) {
    let str = "b1 b1 b1 b1 t1 t2 t4 zh zh zh zh"
    t.is(MajiangAlgo.is3ABC(str), false);
});
test("is3ABC 十二张, 三杠 ", function (t) {
    let str = "b1 b1 b1 b1 t1 t1 t1 t1 zh zh zh zh"
    t.is(MajiangAlgo.is3ABC(str), true);
});
test("is3ABC 十二张, false ", function (t) {
    let str = "b1 b1 b1 b2 t1 t1 t1 t1 zh zh zh zh"
    t.is(MajiangAlgo.is3ABC(str), false);
});



test("is3ABC 11张牌，二杠,前三为ABC", function (t) {
    let str = "b1 b2 b3 b5 b5 b5 b5 zh zh zh zh"
    t.is(MajiangAlgo.is3ABC(str), true)
})
test("is3ABC 11张牌，二杠，中间为ABC", function (t) {
    let str = "b2 b2 b2 b2 t1 t2 t3 zh zh zh zh"
    t.is(MajiangAlgo.is3ABC(str), true)
})
test("is3ABC 11张牌，二杠，后三为ABC", function (t) {
    let str = "b2 b2 b2 b2 t1 t1 t1 t1 t3 t4 t5"
    t.is(MajiangAlgo.is3ABC(str), true)
})
test("is3ABC 11张牌，false", function (t) {
    let str = "b2 b2 b2 b2 t1 t1 t1 t1 t3 t4 t4"
    t.is(MajiangAlgo.is3ABC(str), false)
})
test("is3ABC 11张牌，false", function (t) {
    let str = "b2 b2 b2 b2 t1 t1 t1 t2 t3 t4 t5"
    t.is(MajiangAlgo.is3ABC(str), false)
})
