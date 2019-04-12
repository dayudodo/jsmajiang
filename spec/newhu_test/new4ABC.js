import test from "ava";
import { NMajiangAlgo } from "../../server_build/server/NMajiangAlgo";
import { PaiConvertor } from "../../server_build/server/PaiConvertor";
// var Majiang = require("../server/Majiang");
// var mj = new Majiang()
/**f直接将字符串转换成数类麻将数组 */
function pais(strs) {
  return PaiConvertor.pais(strs);
}


//is4ABC group
test("is4ABC 12张牌 1", function (t) {
  let str = "b1 b2 b3 fa fa fa t1 t2 t3 t4 t5 t6";
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);

  let str1 = "b1 b2 b3 fa fa fa t1 t2 t2 t3 t3 t4";
  test_arr = pais(str1);
  result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);
});
test("is4ABC 12张牌 前6错位", function (t) {
  let str = "b1 b2 b2 b3 b3 b4 t1 t2 t2 t3 t3 t4";
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);
});

test("is4ABC 12张牌，中间错位", function (t) {
  let str = "zh zh zh b1 b2 b2 b3 b3 b4 t1 t2 t3";
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);
});

test("is4ABC 12张牌 前9 112233", function (t) {
  let str = "b1 b1 b2 b2 b3 b3 b4 b5 b6 b7 b8 b9";
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);
});
test("is4ABC 12张牌 后9 112233", function (t) {
  let str = "b1 b2 b3 b4 b4 b5 b5 b6 b6 b7 b7 b7";
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);
});
test("is4ABC 12 false", function (t) {
  let str = "b1 b2 b3 fa fa fa t1 t2 t2 t3 t3 zh";
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, false);
});
test("is4ABC 12张牌2", function (t) {
  let str = "b1 b2 b3 fa fa fa t1 t2 t3 t4 t5 t6";
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);
});
test("is4ABC 12张牌 false", function (t) {
  let str = "b1 b2 b4 fa fa fa t1 t2 t3 t4 t5 t6";
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, false);
});

test("is4ABC 13张牌 前6错位", function (t) {
  let str = "b1 b2 b2 b3 b3 b4 t1 t2 t3 zh zh zh zh";
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);
});
test("is4ABC 13张牌，中间错位", function (t) {
  let str = "b1 b1 b1 b3 b4 b4 b5 b5 b6 t1 t1 t1 t1";
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);
});
test("is4ABC 13张牌，中间错位2", function (t) {
  let str = "b1 b1 b1 b3 b3 b4 b4 b5 b5 t1 t1 t1 t1";
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);
});
test("is4ABC 13张牌，最后一杠，前四非杠", function(t){
  let str= 'b1 b1 b1 b1 b2 b3 di di di zh zh zh zh'
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);
})
test("is4ABC 13张牌，最后一杠，false", function(t){
  let str= 'b1 b1 b1 b1 b2 b4 di di di zh zh zh zh'
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, false);
})

test("is4ABC 14张牌，中间错位", function (t) {
  let str = "b1 b1 b1 b1 b3 b4 b4 b5 b5 b6 t1 t1 t1 t1";
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);
});

test("is4ABC 14张牌，最后二杠", function(t){
  let str= 'b1 b1 b1 b1 b2 b3 di di di di zh zh zh zh'
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);
})
test("is4ABC 14张牌，最后二杠, false", function(t){
  let str= 'b1 b1 b1 b1 b2 b4 di di di di zh zh zh zh'
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, false);
})
//这儿觉得奇怪，为啥也能通过？毕竟前三后三都不是杠，并且还等于14张
test("is4ABC 14张牌，中间二杠", function(t){
  let str= 'b1 b2 b3 b4 b4 b4 b4 di di di di zh zh zh'
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);
})
test("is4ABC 14张牌，false", function(t){
  let str= 'b1 b2 b3 b3 b4 b4 b4 di di di di zh zh zh'
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, false);
})

test("is4ABC 15张牌，有三杠", function(t){
  let str= 'b1 b2 b3 b4 b4 b4 b4 di di di di zh zh zh zh'
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);
})
test("is4ABC 15张牌，有三杠, 杠在前", function(t){
  let str= 'b1 b1 b1 b1 b3 b4 b5 di di di di zh zh zh zh'
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);
})

test("is4ABC 15张牌，有三杠, 杠在前 false", function(t){
  let str= 'b1 b1 b1 b2 b3 b4 b5 di di di di zh zh zh zh'
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, false);
})
test("is4ABC 15张牌 false", function(t){
  let str= 'b1 b2 b3 b3 b4 b4 b4 di di di di zh zh zh zh'
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, false);
})

test("is4ABC 16张牌，四杠", function(t){
  let str= 'b1 b1 b1 b1 b2 b2 b2 b2 di di di di zh zh zh zh'
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, true);
})
test("is4ABC 16张牌，false", function(t){
  let str= 'b1 b1 b1 b1 b2 b2 b2 b2 di di di di zh zh zh di'
  let test_arr = pais(str);
  let result = NMajiangAlgo.isJiJuhua(test_arr);
  t.is(result, false);
})