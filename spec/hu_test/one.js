
import test from "ava";
import { MajiangAlgo } from "../../server_build/MajiangAlgo"

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


test("卡五星", function(t) {
    let str = "b1 b1 b1 b2 b2 b2 b4 b6 t3 t3 t3 t5 t5";
    let na_pai = "b5";
    let group_shoupai = {
      anGang: [],
      mingGang: [],
      peng: [],
      shouPai: str.split(" ")
    };
    t.is(MajiangAlgo.HuisKaWuXing(group_shoupai, na_pai), true);
  });