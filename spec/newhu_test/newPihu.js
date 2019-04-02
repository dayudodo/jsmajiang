import test from "ava";
import { NMajiangAlgo } from "../../server_build/server/NMajiangAlgo";
import { PaiConvertor } from "../../server_build/server/PaiConverter";
/**直接将字符串转换成数类麻将数组 */
function pais(strs) {
    return PaiConvertor.pais(strs)
  }
  function to_number(str){
    return PaiConvertor.ToNumber(str)
  }


test("屁胡", function (t) {
    let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh";
    let na_pai = to_number("zh")
      let group_shoupai = {
      anGang: [],
      mingGang: [],
      peng: [],
      selfPeng:[], shouPai: pais(str)
    };
    // console.log(NMajiangAlgo.HuPaiNames(group_shoupai, na_pai));
    t.is(NMajiangAlgo.HuIsPihu(group_shoupai, na_pai), true);
  });
  test("屁胡1杠5张false", function (t) {
    let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa fa fa zh";
    let na_pai = to_number("zh")
      let group_shoupai = {
      anGang: [],
      mingGang: [],
      peng: [],
      selfPeng:[], shouPai: pais(str)
    };
    // console.log(NMajiangAlgo.HuPaiNames(group_shoupai, na_pai));
    t.is(NMajiangAlgo.HuIsPihu(group_shoupai, na_pai), false);
  });
  test("group单杠屁胡，其中四张连续并非杠", function (t) {
    let str = "b2 b3 b4 di di di fa zh zh zh";
    let na_pai = to_number("fa")
    let group_shoupai = {
      anGang: pais(['b1']),
      mingGang: [],
      peng: [],
      selfPeng:[], shouPai: pais(str)
    }
    t.is(NMajiangAlgo.HuIsPihu(group_shoupai, na_pai), true);
  });
  test("group不是清一色", function (t) {
    let str = "b3 b4 b7 b8";
    let na_pai = to_number("b9")
    let group_shoupai = {
      anGang: pais(['b1']),
      mingGang: [],
      peng: pais(['b5', 'b2']),
      selfPeng:[], shouPai: pais(str)
    }
    //b1 b1 b1 b1 b2 b2 b2 b3 b4 b5 b5 b5 b7 b8 b9
    // t.is(NMajiangAlgo._HuIsPihu(NMajiangAlgo.flat_shou_pai(grou_shoupai)),true)
    t.is(NMajiangAlgo.HuIsPihu(group_shoupai, na_pai), false);
  });
  test("flat可胡，group不能", function (t) {
    let str = "b3 b4 t4 t5"
    let na_pai = to_number("t3")
    let group_shoupai = {
      anGang: [],
      mingGang: pais(['b1']),
      peng: pais(['fa', 'b2']),
      selfPeng:[], shouPai: pais(str)
    }
    //b1 b1 b1 b1 b2 b2   b2 b3 b4   t3 t4 t5   fa fa fa fa
    let flatShou = NMajiangAlgo.flat_shou_pai(group_shoupai)
    t.is(NMajiangAlgo.jiangJiJuhua(flatShou, na_pai),true)
    t.is(NMajiangAlgo.HuIsPihu(group_shoupai, na_pai), false);
  });
  
  test("屁胡 胡将", function (t) {
    let str = "b9";
    let na_pai = to_number("b9")
    let group_shoupai = {
      anGang: pais(['b1']),
      mingGang: pais(['t1']),
      peng:pais( ['b5', 'b2']),
      selfPeng:[], shouPai: pais(str)
    }
    t.is(NMajiangAlgo.HuIsPihu(group_shoupai, na_pai), true);
  });