import test from "ava";
import { NMajiangAlgo as NMajiangAlgo } from "../../server_build/server/NMajiangAlgo";
import {PaiConvertor} from "../../server_build/server/PaiConverter"
// var Majiang = require("../server/Majiang");
// var mj = new Majiang()
/**f直接将字符串转换成数类麻将数组 */
function pais(strs) {
  return PaiConvertor.pais(strs)
}


test(`三碰OK`, function(t) {
  let str = "b1 b1 b1 b2 b2 b2 t2 t2 t2";
  let test_arr = pais(str)
  let result = NMajiangAlgo.isJiJuhua(test_arr)
  t.is(result, true);
});
// test(`是几句话`, function(t) {
//   let str = "b1 b1 b1 b2 b3 b4";
//   let test_arr = pais(str)
//   let result = NMajiangAlgo.isJiJuhua(test_arr)
//   t.is(result, true);
// });
// test(`is 223344`, function(t) {
//   let str = "b1 b1 b2 b2 b3 b3";
//   let test_arr = pais(str)
//   let result = NMajiangAlgo.isJiJuhua(test_arr)
//   t.is(result, true);
// });
// test(`is 杠ABC`, function(t) {
//   let str = "b1 b1 b1 b1 b2 b3 b4";
//   let test_arr = pais(str)
//   let result = NMajiangAlgo.isJiJuhua(test_arr)
//   t.is(result, true);
// });
// test(`is 杠ABC`, function(t) {
//   let str = "b1 b1 b1 b1 b2 b3";
//   let test_arr = pais(str)
//   let result = NMajiangAlgo.isJiJuhua(test_arr)
//   t.is(result, true);
// });
// test(`is ABC AAA`, function(t) {
//   let str = "b2 b3 b4 b5 b5 b5";
//   let test_arr = pais(str)
//   let result = NMajiangAlgo.isJiJuhua(test_arr)
//   t.is(result, true);
// });
// test(`is abbccd`, function(t) {
//   let str = "b1 b2 b2 b3 b3 b4";
//   let test_arr = pais(str)
//   let result = NMajiangAlgo.isJiJuhua(test_arr)
//   t.is(result, true);
// });
// test(`is abbccd`, function(t) {
//   let str = "b1 b2 b3 b3 b3 b3";
//   let test_arr = pais(str)
//   let result = NMajiangAlgo.isJiJuhua(test_arr)
//   t.is(result, true);
// });
// test(`empty isn't`, function(t) {
//   let str = "b1 b2 b3 b3 b3 b3";
//   let test_arr = pais(str)
//   let result = NMajiangAlgo.isJiJuhua(test_arr)
//   t.is(result, true);
// });