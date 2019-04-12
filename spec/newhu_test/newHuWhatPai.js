import test from "ava"
import { NMajiangAlgo } from "../../server_build/server/NMajiangAlgo"
import { PaiConvertor } from "../../server_build/server/PaiConvertor"
import * as config from "../../server_build/server/config"
/**直接将字符串转换成数类麻将数组 */
function pais(strs) {
  return PaiConvertor.pais(strs)
}
function to_number(str) {
  return PaiConvertor.ToNumber(str)
}
// '胡啥牌'
test("清一色听牌", function(t) {
  let str = pais("b1 b2 b2 b3 b3 b4 b4 b5 b5 b5 b6 b7 b7")
  let zhang = NMajiangAlgo.HuWhatPai(str).all_hupai_zhang
  // let dict = NMajiangAlgo.HuWhatPai(str).hupai_dict
  // console.log(zhang, dict)
  t.deepEqual(zhang, pais(["b5", "b7"]))
})
test("group清一色胡b5", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 b4 b6 b7 b7"
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    selfPeng: [],
    peng: pais(["b5"]),
    shouPai: pais(str)
  }
  t.deepEqual(
    NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang,
    pais(["b5"])
  )
})
test("group清一色胡b5 杠掉后false", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 b4 b6 b7 b7"
  let group_shoupai = {
    anGang: [],
    mingGang: pais(["b5"]),
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  }
  t.deepEqual(
    NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_typesCode,
    []
  )
  t.deepEqual(NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, [])
})

test("清一色听7张", function(t) {
  let str = pais("b1 b2 b3 b4 b5 b6 b7 b8 b8 b8 b9 b9 b9")
  t.deepEqual(
    NMajiangAlgo.HuWhatPai(str).all_hupai_zhang,
    pais(["b1", "b3", "b4", "b6", "b7", "b8", "b9"])
  )
})
test("group清一色胡多张", function(t) {
  let str = pais("b1 b2 b3 b4 b5 b6 b7 b8 b8 b8")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: pais(["b9"]),
    selfPeng: [],
    shouPai: str
  }
  t.deepEqual(
    NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang,
    pais(["b1", "b3", "b4", "b6", "b7", "b9"])
  )
})

test("双将倒", function(t) {
  let str = pais("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa")
  t.deepEqual(NMajiangAlgo.HuWhatPai(str).all_hupai_zhang, pais(["zh", "di"]))
})
test("group双将倒", function(t) {
  let str = pais("zh zh di di b1 b2 b3")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: pais(["t2", "t3"]),
    selfPeng: [],
    shouPai: str
  }
  let zhang = NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang
  console.log(zhang)

  t.deepEqual(zhang, pais(["zh", "di"]))
})

test("清一色胡3 张", function(t) {
  let str = pais("b1 b1 b2 b2 b3 b3 b4 b4 b5 b5 b6 b6 b7")
  // let what = NMajiangAlgo.HuWhatPai(str).hupai_dict
  // console.log(what);

  t.deepEqual(
    NMajiangAlgo.HuWhatPai(str).all_hupai_zhang,
    pais(["b1", "b4", "b7"])
  )
})
test("清一色胡4张", function(t) {
  let str = pais("b1 b1 b2 b2 b3 b3 b4 b5 b6 b7 b7 b7 b8")
  // let what = NMajiangAlgo.HuWhatPai(str).hupai_dict
  // console.log(what);

  t.deepEqual(
    NMajiangAlgo.HuWhatPai(str).all_hupai_zhang,
    pais(["b3", "b6", "b8", "b9"])
  )
})
test("清一色胡9张，最长胡", function(t) {
  let str = pais("b1 b1 b1 b2 b3 b4 b5 b6 b7 b8 b9 b9 b9")
  // let what = NMajiangAlgo.HuWhatPai(str).hupai_dict
  // console.log(what);
  t.deepEqual(
    NMajiangAlgo.HuWhatPai(str).all_hupai_zhang,
    pais("b1 b2 b3 b4 b5 b6 b7 b8 b9".split(' '))
  )
})

test("group清一色碰7后只胡一", function(t) {
  let str = pais("b1 b1 b2 b2 b3 b3 b4 b5 b6 b8")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: pais(["b7"]),
    selfPeng: [],
    shouPai: str
  }
  t.deepEqual(
    NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang,
    pais(["b8"])
  )
})

test("清一色听牌false", function(t) {
  let str = pais("b1 b2 b3 b4 b5 b6 b7 b8 b8 b8 t1 t3 t5")
  t.deepEqual(NMajiangAlgo.HuWhatPai(str), {
    all_hupai_zhang: [],
    all_hupai_typesCode: [],
    hupai_dict: {}
  })
})
test("group清一色听牌false", function(t) {
  let str = "b4 b5 b6 b7 b8 b8 b8 t1 t3 t5"
  let group_shoupai = {
    anGang: pais(["b1"]),
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  }
  t.deepEqual(NMajiangAlgo.HuWhatGroupPai(group_shoupai), {
    all_hupai_zhang: [],
    all_hupai_typesCode: [],
    hupai_dict: {}
  })
})

test("碰碰胡听牌", function(t) {
  let str = pais("b1 b1 b1 b2 b2 b2 b3 b3 b3 t1 t1 t1 t2")
  t.deepEqual(NMajiangAlgo.HuWhatPai(str).all_hupai_typesCode, [
    config.HuisPengpeng,
    config.HuisPihu
  ])
  t.deepEqual(NMajiangAlgo.HuWhatPai(str).all_hupai_zhang, pais(["t2", "t3"]))
})
test("碰碰胡带杠听牌", function(t) {
  let str = pais("b1 b1 b1 b1 b2 b2 b2 b3 b3 b3 t1 t1 t1 t2")
  t.deepEqual(NMajiangAlgo.HuWhatPai(str).all_hupai_typesCode, [
    config.HuisPengpeng,
    config.HuisPihu
  ])
  t.deepEqual(NMajiangAlgo.HuWhatPai(str).all_hupai_zhang, pais(["t2", "t3"]))
})
test("group后碰碰胡听牌只胡一", function(t) {
  let str = "b1 b1 b1 b2 b2 b2 b3 b3 b3 t2"
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: pais(["t1"]),
    selfPeng: [],
    shouPai: pais(str)
  }
  t.deepEqual(NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_typesCode, [
    config.HuisPengpeng
  ])
  t.deepEqual(
    NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang,
    pais(["t2"])
  )
})

test("龙七对听牌", function(t) {
  let str = pais("b1 b1 b2 b2 fa fa fa fa t1 t1 t4 t4 t9")
  t.deepEqual(NMajiangAlgo.HuWhatPai(str).all_hupai_typesCode, [
    config.HuisQidui,
    config.HuisNongQiDui
  ])
  t.deepEqual(NMajiangAlgo.HuWhatPai(str).all_hupai_zhang, pais(["t9"]))
})
test("group龙七对听牌", function(t) {
  let str = "b1 b1 b2 b2 fa fa fa fa t1 t1 t4 t4 t9"
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  }
  t.deepEqual(NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_typesCode, [
    config.HuisQidui,
    config.HuisNongQiDui
  ])
  t.deepEqual(
    NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang,
    pais(["t9"])
  )
})

test("仅屁胡 zh", function(t) {
  let str = pais("b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh")
  t.deepEqual(NMajiangAlgo.HuWhatPai(str).all_hupai_typesCode, [
    config.HuisPihu
  ])
  t.deepEqual(NMajiangAlgo.HuWhatPai(str).all_hupai_zhang, pais(["zh"]))
})
test("group仅屁胡 zh", function(t) {
  let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 zh"
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: pais(["fa"]),
    selfPeng: [],
    shouPai: pais(str)
  }

  t.deepEqual(NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_typesCode, [
    config.HuisPihu
  ])
  t.deepEqual(
    NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang,
    pais(["zh"])
  )
  t.deepEqual(NMajiangAlgo.HuWhatGroupPai(group_shoupai).hupai_dict, {
    31: [config.HuisPihu]
  })
})

test("大小三元 b1 b4 fa", function(t) {
  let str = pais("b1 b1  b1 b2 b3 di di di zh zh zh fa fa")
  let allCodes = NMajiangAlgo.HuWhatPai(str).all_hupai_typesCode
  console.log(allCodes)

  t.deepEqual(allCodes, [
    config.HuisXiaoShanYuan,
    config.HuisDaShanYuan,
    config.HuisAnSiGui
  ])
  t.deepEqual(
    NMajiangAlgo.HuWhatPai(str).all_hupai_zhang,
    pais(["b1", "b4", "fa"])
  )
})
test("大小三元group b1 b4 fa", function(t) {
  let str = "b1 b1  b1 b2 b3 fa fa"
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: pais(["di", "zh"]),
    selfPeng: [],
    shouPai: pais(str)
  }
  t.deepEqual(NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_typesCode, [
    config.HuisXiaoShanYuan,
    config.HuisDaShanYuan,
    config.HuisAnSiGui
  ])
  t.deepEqual(
    NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang,
    pais(["b1", "b4", "fa"])
  )
})
test("大小三元group 并碰碰胡", function(t) {
  let str = "t1 t1 t1 fa"
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: pais(["di", "zh"]),
    selfPeng: pais(["b1"]),
    shouPai: pais(str)
  }
  t.deepEqual(NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_typesCode, [
    config.HuisPengpeng,
    config.HuisXiaoShanYuan
  ])
  t.deepEqual(
    NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang,
    pais(["fa"])
  )
})

test("大小三元group 有一杠，胡 b1 b4 fa", function(t) {
  let str = "b1 b1  b1 b2 b3 fa fa"
  let group_shoupai = {
    anGang: [],
    mingGang: pais(["zh"]),
    peng: pais(["di"]),
    selfPeng: [],
    shouPai: pais(str)
  }
  t.deepEqual(
    NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang,
    pais(["b1", "b4", "fa"])
  )
})

test("空", function(t) {
  let str = pais("b1 b2 b3 b4 b7 b8 t4 t5 t8 fa fa fa zh")
  t.deepEqual(NMajiangAlgo.HuWhatPai(str).all_hupai_typesCode, [])
  t.deepEqual(NMajiangAlgo.HuWhatPai(str).all_hupai_zhang, [])
})
test("group也空", function(t) {
  let str = "b1 b2 b3 b4 b7 b8 t4 t5 t8 zh"
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: pais(["fa"]),
    selfPeng: [],
    shouPai: pais(str)
  }
  t.deepEqual(
    NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_typesCode,
    []
  )
  t.deepEqual(NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, [])
})

test("flat可胡，group碰牌后不能胡", function(t) {
  let group_shoupai = {
    anGang: [],
    mingGang: pais(["b1"]),
    peng: pais(["fa", "b2"]),
    selfPeng: [],
    shouPai: pais(["b3", "b4", "t4", "t5"])
  }
  let flatShou = NMajiangAlgo.flat_shou_pai(group_shoupai)
  t.deepEqual(
    NMajiangAlgo.HuWhatPai(flatShou).all_hupai_zhang,
    pais(["t3", "t6"])
  )
  t.deepEqual(NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, [])
})

test("group胡2，3饼", function(t) {
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: pais(["b1", "b8"]),
    selfPeng: [],
    shouPai: pais("b2 b2 b3 b3 b5 b6 b7")
  }
  t.deepEqual(
    NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang,
    pais(["b2", "b3"])
  )
})
test("group胡1,4条", function(t) {
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: pais(["t1"]),
    selfPeng: [],
    shouPai: pais(["b1", "b1", "t2", "t3", "t6", "t7", "t8", "zh", "zh", "zh"])
  }
  t.deepEqual(
    NMajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang,
    pais(["t1", "t4"])
  )
})
