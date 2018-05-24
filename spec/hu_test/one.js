import test from "ava";
import { MajiangAlgo, getArr } from "../../server_build/server/MajiangAlgo";
// test("三杠屁胡", function (t) {
//   let str = " b1 b1 b1 b1 b2 b2 b2 b2 t1 t1 t1 t1 t3 t4 t5 zh";
//   let na_pai = "zh";
//   t.is(MajiangAlgo._HuisPihu(str, na_pai), true);
// });

// test("is4ABC 15张牌，三杠", function(t){
//   let str= 'b1 b1 b1 b1 b2 b2 b2 b2 t1 t1 t1 t1 t3 t4 t5'
//   t.is(MajiangAlgo.is4ABC(str), true)
// })
// test("is4ABC 14张牌，二杠", function(t){
//   let str= 'b1 b1 b1 b1 b2 b2 b2 b2 t1 t1 t1 t3 t4 t5'
//   t.is(MajiangAlgo.is4ABC(str), true)
// })


// test("卡五星", function(t) {
//     let str = "b1 b1 b1 b2 b2 b2 b4 b6 t3 t3 t3 t5 t5";
//     let na_pai = "b5";
//     let group_shoupai = {
//       anGang: [],
//       mingGang: [],
//       peng: [],
//       selfPeng:[], shouPai: str.split(" ")
//     };
//     t.is(MajiangAlgo.HuisKaWuXing(group_shoupai, na_pai), true);
//   });
test("group清一色胡b5 杠掉后false", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 b4 b6 b7 b7";
  let group_shoupai = {
    anGang: [],
    mingGang: ["b5"],
    peng: [],
    selfPeng: [],
    shouPai: getArr(str)
  };
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_typesCode, []);
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, []);
});