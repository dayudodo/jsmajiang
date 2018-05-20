import test from "ava";
import { MajiangAlgo, checkValidAndReturnArr } from "../../server_build/server/MajiangAlgo";

//is4ABC group
test("is4ABC 12张牌", function (t) {
  let str = "b1 b2 b3 fa fa fa t1 t2 t3 t4 t5 t6";
  t.is(MajiangAlgo.is4ABC(str), true);
  let str1 = "b1 b2 b3 fa fa fa t1 t2 t2 t3 t3 t4";
  t.is(MajiangAlgo.is4ABC(str1), true);
});
test("is4ABC 12张牌 前6错位", function (t) {
  let str = "b1 b2 b2 b3 b3 b4 t1 t2 t2 t3 t3 t4";
  t.is(MajiangAlgo.is4ABC(str), true);
});

test("is4ABC 12张牌，中间错位", function (t) {
  let str = "zh zh zh b1 b2 b2 b3 b3 b4 t1 t2 t3";
  t.is(MajiangAlgo.is4ABC(str), true);
});

test("is4ABC 12张牌 前9 112233", function (t) {
  let str = "b1 b1 b2 b2 b3 b3 b4 b5 b6 b7 b8 b9";
  t.is(MajiangAlgo.is4ABC(str), true);
});
test("is4ABC 12张牌 后9 112233", function (t) {
  let str = "b1 b2 b3 b4 b4 b5 b5 b6 b6 b7 b7 b7";
  t.is(MajiangAlgo.is4ABC(str), true);
});
test("is4ABC 12 false", function (t) {
  let str = "b1 b2 b3 fa fa fa t1 t2 t2 t3 t3 zh";
  t.is(MajiangAlgo.is4ABC(str), false);
});
test("is4ABC 12张牌", function (t) {
  let str = "b1 b2 b3 fa fa fa t1 t2 t3 t4 t5 t6";
  t.is(MajiangAlgo.is4ABC(str), true);
});
test("is4ABC 12张牌 false", function (t) {
  let str = "b1 b2 b4 fa fa fa t1 t2 t3 t4 t5 t6";
  t.is(MajiangAlgo.is4ABC(str), false);
});

test("is4ABC 13张牌 前6错位", function (t) {
  let str = "b1 b2 b2 b3 b3 b4 t1 t2 t3 zh zh zh zh";
  t.is(MajiangAlgo.is4ABC(str), true);
});
test("is4ABC 13张牌，中间错位", function (t) {
  let str = "b1 b1 b1 b3 b4 b4 b5 b5 b6 t1 t1 t1 t1";
  t.is(MajiangAlgo.is4ABC(str), true);
});
test("is4ABC 13张牌，中间错位", function (t) {
  let str = "b1 b1 b1 b3 b3 b4 b4 b5 b5 t1 t1 t1 t1";
  t.is(MajiangAlgo.is4ABC(str), true);
});
test("is4ABC 13张牌，最后一杠，前四非杠", function(t){
  let str= 'b1 b1 b1 b1 b2 b3 di di di zh zh zh zh'
  t.is(MajiangAlgo.is4ABC(str), true)
})
test("is4ABC 13张牌，最后一杠，false", function(t){
  let str= 'b1 b1 b1 b1 b2 b4 di di di zh zh zh zh'
  t.is(MajiangAlgo.is4ABC(str), false)
})

test("is4ABC 14张牌，中间错位", function (t) {
  let str = "b1 b1 b1 b1 b3 b4 b4 b5 b5 b6 t1 t1 t1 t1";
  t.is(MajiangAlgo.is4ABC(str), true);
});

test("is4ABC 14张牌，最后二杠", function(t){
  let str= 'b1 b1 b1 b1 b2 b3 di di di di zh zh zh zh'
  t.is(MajiangAlgo.is4ABC(str), true)
})
test("is4ABC 14张牌，最后二杠, false", function(t){
  let str= 'b1 b1 b1 b1 b2 b4 di di di di zh zh zh zh'
  t.is(MajiangAlgo.is4ABC(str), false)
})
//这儿觉得奇怪，为啥也能通过？毕竟前三后三都不是杠，并且还等于14张
test("is4ABC 14张牌，中间二杠", function(t){
  let str= 'b1 b2 b3 b4 b4 b4 b4 di di di di zh zh zh'
  t.is(MajiangAlgo.is4ABC(str), true)
})
test("is4ABC 14张牌，false", function(t){
  let str= 'b1 b2 b3 b3 b4 b4 b4 di di di di zh zh zh'
  t.is(MajiangAlgo.is4ABC(str), false)
})

test("is4ABC 15张牌，有三杠", function(t){
  let str= 'b1 b2 b3 b4 b4 b4 b4 di di di di zh zh zh zh'
  t.is(MajiangAlgo.is4ABC(str), true)
})
test("is4ABC 15张牌，有三杠, 杠在前", function(t){
  let str= 'b1 b1 b1 b1 b3 b4 b5 di di di di zh zh zh zh'
  t.is(MajiangAlgo.is4ABC(str), true)
})

test("is4ABC 15张牌，有三杠, 杠在前 false", function(t){
  let str= 'b1 b1 b1 b2 b3 b4 b5 di di di di zh zh zh zh'
  t.is(MajiangAlgo.is4ABC(str), false)
})
test("is4ABC 15张牌 false", function(t){
  let str= 'b1 b2 b3 b3 b4 b4 b4 di di di di zh zh zh zh'
  t.is(MajiangAlgo.is4ABC(str), false)
})

test("is4ABC 16张牌，四杠", function(t){
  let str= 'b1 b1 b1 b1 b2 b2 b2 b2 di di di di zh zh zh zh'
  t.is(MajiangAlgo.is4ABC(str), true)
})
test("is4ABC 16张牌，false", function(t){
  let str= 'b1 b1 b1 b1 b2 b2 b2 b2 di di di di zh zh zh di'
  t.is(MajiangAlgo.is4ABC(str), false)
})