//麻将判胡算法主程序，纯数字版本

import * as _ from "lodash"
import chalk from "chalk"
import * as config from "./config"
import { join } from "path"
type Pai = number

// 全局常量，所有的牌,饼为1，条为2，万为3，中国、发财、白板为不连续的三张牌
var BING: Array<Pai> = [1, 2, 3, 4, 5, 6, 7, 8, 9] //小于10的就是饼
var TIAO: Array<Pai> = [11, 12, 13, 14, 15, 16, 17, 18, 19] //大于10并且小于20的是条
//卡五星里面暂时用不上这个万，只有上面的两种可以使用
var WAN: Array<Pai> = [21, 22, 23, 24, 25, 26, 27, 28, 29]
// 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
var ZHIPAI: Array<Pai> = [31, 33, 35]

var all_single_pai = BING.concat(TIAO).concat(ZHIPAI)

declare global {
  interface Array<T> {
    /**数组中删除一个元素 */
    remove(o): T[]
    equalArrays(o): boolean
  }
  interface hupaiConstructor {
    /**所有的胡牌类型码 */
    all_hupai_typesCode: Array<number>
    /**所有的胡牌张，玩家胡的啥牌，便于分析，尤其象卡五星这种，不能算错喽。*/
    all_hupai_zhang: Array<Pai>
    /**胡牌字典，哪个牌是什么胡，如果为空自然是没胡喽。
     * 内部数据类似于：hupai_dict['b1'] = [0,9]，表明是胡b1,并且还是七对，屁胡
     */
    hupai_dict: {}
  }
}

/**删除找到的第一个元素 */
Array.prototype.remove = function(val) {
  var index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
  return this
}
Array.prototype.equalArrays = function(b) {
  if (this.length != b.length) return false // Different-size arrays not equal
  for (
    var i = 0;
    i < this.length;
    i++ // Loop through all elements
  )
    if (this[i] !== b[i]) return false // If any differ, arrays not equal
  return true // Otherwise they are equal
}

/**获取当前牌的类型，比如饼、条、万、字牌 */
function getMJType(mjNumber) {
  if (mjNumber >= 1 && mjNumber <= 9) {
    //饼
    return config.TYPE_BING
  } else if (mjNumber >= 11 && mjNumber <= 19) {
    //条
    return config.TYPE_TIAO
  } else if (mjNumber >= 31 && mjNumber <= 35) {
    //字牌
    return config.TYPE_ZHIPAI
  }
}

interface hupaiConstructor {
  /**所有的胡牌类型码 */
  all_hupai_typesCode: Array<number>
  /**所有的胡牌张，玩家胡的啥牌，便于分析，尤其象卡五星这种，不能算错喽。*/
  all_hupai_zhang: Array<Pai>
  /**胡牌字典，哪个牌是什么胡，如果为空自然是没胡喽。
   * 内部数据类似于：hupai_dict['b1'] = [0,9]，表明是胡b1,并且还是七对，屁胡
   */
  hupai_dict: {}
}

/**麻将胡牌算法 */
export class NMajiangAlgo {
  /**获取到所有的将牌 */
  static getAllJiangArr(test_arr: Array<Pai>): Array<Pai> {
    if (_.isEmpty(test_arr)) {
      return []
    }
    let allArr = new Set() //有可能检测到相同的，所以使用set保证唯一
    for (let index = 0; index < test_arr.length; index++) {
      const jiang = test_arr[index]
      if (jiang == test_arr[index + 1]) {
        allArr.add(jiang)
      }
    }
    return Array.from(allArr)
  }

  /**寻找ABC，223344，这样的也可以找到 */
  static isAndDelABC(test_arr: Array<Pai>): any {
    if (_.isEmpty(test_arr)) {
      throw new Error("test_arr为空")
    }
    let remainArr = test_arr.slice(1, test_arr.length)
    //如果找到第一个元素，删除之，再继续找，比如开头是个2，会找到3
    let pos = remainArr.indexOf(test_arr[0] + 1)
    if (pos > -1) {
      remainArr.splice(pos, 1)
      pos = remainArr.indexOf(test_arr[0] + 2) //会找到4
      if (pos > -1) {
        //找到4就删除
        remainArr.splice(pos, 1)
        // console.log("remainArr", remainArr);
        return { remainArr: remainArr }
      } else {
        return false
      }
    } else {
      return false
    }
  }
  /**判断是否是AAA，查找法哪怕你没有排序也可以找到3A */
  static isAndDelAAA(test_arr: Array<Pai>): any {
    if (_.isEmpty(test_arr)) {
      throw new Error("test_arr为空")
    }
    if (test_arr.length < 3) {
      return false
    }
    let result = test_arr[0] == test_arr[1] && test_arr[1] == test_arr[2]
    if (result) {
      return { remainArr: test_arr.slice(3, test_arr.length) }
    } else {
      return false
    }
  }

  static isAndDel4A(test_arr: Array<Pai>): any {
    if (_.isEmpty(test_arr)) {
      throw new Error("test_arr为空")
    }
    if (test_arr.length < 4) {
      return false
    }
    let result =
      test_arr[0] == test_arr[1] &&
      test_arr[1] == test_arr[2] &&
      test_arr[2] == test_arr[3]
    if (result) {
      return { remainArr: test_arr.slice(4, test_arr.length) }
    } else {
      return false
    }
  }

  /**是否是几句话，总共只有4句话，外带将！ */
  static isJiJuhua(shouPai: Array<Pai>, first = true): boolean {
    //检测到最后是个空数组，说明都是几句话！
    if (_.isEmpty(shouPai)) {
      return first ? false : true
    } else if (shouPai.length < 3) {
      //不为空，但是少于3张牌，肯定不是几句话,算法提速！
      return false
    }
    shouPai = _.orderBy(shouPai) //每次都要排序！防止不连续的情况
    // let threeTest = []
    let result: any
    //判断开头是否是ABC
    result = this.isAndDelABC(shouPai)
    if (!!result) {
      // console.log(result.remainArr);
      //如果结果是true,返回，否则还要进行下面的检测, 并告诉剩下的数组并非是初次检测
      if (this.isJiJuhua(result.remainArr, false)) {
        return true
      }
    }
    //判断开头是否是4个连续，首先检测这个，从大的开始检测
    result = this.isAndDel4A(shouPai)
    if (!!result) {
      // console.log(result.remainArr);
      if (this.isJiJuhua(result.remainArr, false)) {
        return true
      }
    }
    result = this.isAndDelAAA(shouPai)
    //判断开头是否是三个连续
    if (!!result) {
      // 检测剩下的的是否是几句话
      return this.isJiJuhua(result.remainArr, false)
    } else {
      return false
    }
  }

  /**统计有几句话，最多只有4句话，将除外！ */
  // static countJiJuhua(shouPai: Array<Pai>, first = true): number {
  //   //检测到最后是个空数组，说明都是几句话！但，头回不能是个空！
  //   if (_.isEmpty(shouPai)) {
  //     return first ? -1 : 0
  //   }
  //   shouPai = shouPai.sort() //每次都要排序！防止不连续的情况
  //   // let threeTest = []
  //   let countJuHua = 0
  //   let result: any
  //   //判断开头是否是ABC
  //   result = this.isAndDelABC(shouPai)
  //   if (!!result) {
  //     ++countJuHua
  //     //如果结果是true,返回，否则还要进行下面的检测
  //     let ret = this.countJiJuhua(result.remainArr, false)
  //     countJuHua += ret

  //   }
  //   //判断开头是否是4个连续，首先检测这个，从大的开始检测
  //   result = this.isAndDel4A(shouPai)
  //   if (!!result) {
  //     ++countJuHua
  //     // console.log(result.remainArr);
  //     countJuHua += this.countJiJuhua(result.remainArr, false)
  //   }
  //   result = this.isAndDelAAA(shouPai)
  //   //判断开头是否是三个连续
  //   if (!!result) {
  //     // 检测剩下的的是否是几句话
  //     ++countJuHua
  //     countJuHua += this.countJiJuhua(result.remainArr, false)
  //   }
  //   return countJuHua

  // }

  /**检测玩家组牌是否是屁胡 */
  static HuisPihu(group_shoupai: GroupConstructor, na_pai: Pai): boolean {
    let cloneShou = _.orderBy(group_shoupai.shouPai.concat(na_pai))
    //如果是单挑将呢？比如全部都碰了，现在只胡一张将牌？所以要先检查有几句话
    if (this.getJijuhua(group_shoupai) == 4) {
      if (group_shoupai.shouPai[0] == na_pai) {
        //单胡将
        return true
      }
    } else {
      //少于4句话
      return this.jiangJiJuhua(cloneShou)
    }
  }

  /**只是检测有将牌+几句话的情况，不限制数量 */
  static jiangJiJuhua(test_arr: Array<Pai>, na_pai?: Pai): boolean {
    let cloneShouPai: Array<Pai>
    if (na_pai && na_pai > -1) {
      cloneShouPai = _.orderBy(_.clone(test_arr.concat(na_pai)))
    } else {
      cloneShouPai = _.orderBy(_.clone(test_arr))
    }
    let allJiang = this.getAllJiangArr(cloneShouPai)
    // console.log(cloneShouPai, allJiang);

    let isHu = false
    if (allJiang) {
      allJiang.some(jiang => {
        //删除牌里面的将牌，因为是排序好了的，所以一次删除两个即可！
        let newClone = _.clone(cloneShouPai)
        let index = newClone.indexOf(jiang)
        newClone.splice(index, 2)

        isHu = this.isJiJuhua(newClone)
        if (isHu) {
          // console.log('hu:', jiang);
          return true
        }
      })
    }
    return isHu
  }

  /**统计group手牌中已经碰、杠的几句话 */
  private static getJijuhua(group_shoupai: GroupConstructor) {
    return (
      group_shoupai.anGang.length +
      group_shoupai.mingGang.length +
      group_shoupai.selfPeng.length +
      group_shoupai.peng.length
    )
  }

  /**判断七对 */
  static HuisQiDui(group_shoupai: GroupConstructor, na_pai: Pai): boolean {
    //杠过、碰过都不可能再算是七对，也就是门清
    if (this.getJijuhua(group_shoupai) > 1) {
      return false
    } else {
      return this._HuisQiDui(group_shoupai.shouPai, na_pai)
    }
  }

  static _HuisQiDui(shouPai: Array<Pai>, na_pai?: Pai) {
    let cloneShouPai: any
    if (na_pai) {
      cloneShouPai = _.orderBy(_.clone(shouPai.concat(na_pai)))
    } else {
      cloneShouPai = _.orderBy(shouPai)
    }
    // console.log(cloneShouPai);
    if (cloneShouPai.length < 14) {
      return false
    }
    let count = 0
    for (let i = 0; i < cloneShouPai.length; i += 2) {
      if (cloneShouPai[i] == cloneShouPai[i + 1]) {
        count++
      }
    }
    return count == 7
  }

  /**统计一下有哪几个3A */
  static all3Apais(arr_pai: Array<Pai>): Array<Pai> {
    let result: number[] = []
    let count = _.countBy(arr_pai, n => n)
    for (let i in count) {
      if (count[i] == 3) {
        result.push(parseInt(i))
      }
    }
    return result
  }

  /**统计一下有哪几个4A */
  static all4Apais(arr_pai: Array<Pai>): Array<Pai> {
    let result: number[] = []
    let count = _.countBy(arr_pai, n => n)
    for (let i in count) {
      if (count[i] == 4) {
        result.push(parseInt(i))
      }
    }
    return result
  }

  /**是否存在4A */
  static exits4A(shouPai: Array<Pai>): boolean {
    return !_.isEmpty(this.all4Apais(shouPai))
  }

  /**是否是龙七对，也就是里面有个4A */
  static HuisNongQiDui(group_shoupai: GroupConstructor, na_pai: Pai) {
    let cloneShouPai = _.orderBy(_.clone(group_shoupai.shouPai.concat(na_pai)))
    if (this._HuisQiDui(group_shoupai.shouPai, na_pai)) {
      return this.exits4A(cloneShouPai)
    }
  }
  // /**是否是清一色屁胡，而七对的清一色需要使用isYise! */
  // static HuisYise(group_shoupai: GroupConstructor, na_pai: Pai): boolean {
  //     let onlyShouPai = this.flat_shou_pai(group_shoupai).concat(na_pai);
  //     // console.log("this.isYise(onlyShouPai):",this.isYise(onlyShouPai));
  //     // console.log("this.HuIsPihu(onlyShouPai)",this.HuIsPihu(onlyShouPai));
  //     return this.isYise(onlyShouPai)
  // }

  /**是否是一色，并不判断是否是胡 */
  static IsYise(group_shoupai: GroupConstructor, na_pai: Pai): boolean {
    let flatShou = this.flat_shou_pai(group_shoupai)
    let cloneShouPai = _.orderBy(flatShou.concat(na_pai))
    return this._isYise(cloneShouPai)
  }

  /**判断是否是同一花色 */
  private static _isYise(test_arr: Array<Pai>): boolean {
    let firstType = getMJType(test_arr[0])
    // console.log("cloneArr, firstType", cloneArr, firstType);
    // console.log("alltypes", cloneArr.map(item=>getMJType(item)));
    for (let i = 1; i < test_arr.length; i++) {
      const thisType = getMJType(test_arr[i])
      if (thisType == firstType) {
        continue
      } else {
        return false
      }
    }
    return true
  }

  /**是否是3A或者4A，其实和isJiJuHua程序差不多！ */
  static is3Aor4A(shouPai: Array<Pai>, first = true): boolean {
    // console.log("is3Aor4A shouPai:", shouPai);
    //检测到最后是个空数组，说明都是几句话！
    if (_.isEmpty(shouPai)) {
      return first ? false : true
    }
    shouPai = _.orderBy(shouPai) //每次都要排序！防止不连续的情况
    // let threeTest = []
    let result: any
    //判断开头是否是4个连续，首先检测这个，从大的开始检测
    result = this.isAndDel4A(shouPai)
    if (!!result) {
      // console.log(result.remainArr);
      if (this.is3Aor4A(result.remainArr, false)) {
        return true
      }
    }
    result = this.isAndDelAAA(shouPai)
    //判断开头是否是三个连续
    if (!!result) {
      // 检测剩下的的是否是几句话
      return this.is3Aor4A(result.remainArr, false)
    } else {
      return false
    }
  }

  /**剩下的shouPai去掉重复之后只剩下将，就是碰碰胡了！ todo: 可以与判断几句话合并*/
  static HuisPengPeng(group_shoupai: GroupConstructor, na_pai?: Pai): boolean {
    let flatShou = this.flat_shou_pai(group_shoupai)
    let cloneShouPai = _.orderBy(_.clone(flatShou.concat(na_pai)))
    // console.log(cloneShouPai);
    if (cloneShouPai.length < 14) {
      //不够14张，不可能胡！
      console.warn("牌不够14张：", flatShou)
      return false
    }
    return this._HuisPengPeng(cloneShouPai)
  }

  private static _HuisPengPeng(shouPai: Array<Pai>): boolean {
    // let cloneShouPai = _.orderBy(_.clone(shouPai.concat(na_pai)))
    //判断除了将之外是否都是连续的3A,4A。
    let allJiang = this.getAllJiangArr(shouPai)
    let isHu = false
    if (allJiang) {
      allJiang.some(jiang => {
        //删除牌里面的将牌，因为是排序好了的，所以一次删除两个即可！
        let newClone = _.clone(shouPai)
        let index = newClone.indexOf(jiang)
        newClone.splice(index, 2)

        isHu = this.is3Aor4A(newClone)
        if (isHu) {
          // console.log('hu:', jiang);
          return true
        }
      })
    }
    return isHu
  }

  /**平手牌，指13张牌，将其它的碰、杠都转换成一维手牌数组！ */
  static flat_shou_pai(group_shou_pai: GroupConstructor): Array<Pai> {
    let onlyShouPai = []
    group_shou_pai.anGang.forEach(pai => {
      for (let i = 0; i < 4; i++) {
        onlyShouPai.push(pai)
      }
    })
    group_shou_pai.mingGang.forEach(pai => {
      for (let i = 0; i < 4; i++) {
        onlyShouPai.push(pai)
      }
    })
    group_shou_pai.peng.forEach(pai => {
      for (let i = 0; i < 3; i++) {
        onlyShouPai.push(pai)
      }
    })
    group_shou_pai.selfPeng.forEach(pai => {
      for (let i = 0; i < 3; i++) {
        onlyShouPai.push(pai)
      }
    })

    onlyShouPai = onlyShouPai.concat(group_shou_pai.shouPai)
    return _.orderBy(onlyShouPai)
  }
  /**
   * group手牌胡哪些牌
   * @param group_shoupai
   * @param is_liang 是否亮牌了
   */
  static HuWhatGroupPai(
    group_shoupai: GroupConstructor,
    is_liang: boolean
  ): hupaiConstructor {
    let hupai_dict = {}

    for (var i = 0; i < all_single_pai.length; i++) {
      let na_pai = all_single_pai[i]
      let newShouPai: Array<Pai> = this.flat_shou_pai(group_shoupai)
        .concat(na_pai)
        .sort()

      // 是否已经存在4个single_pai? 如果存在，肯定不会胡这张牌！
      let already4A = this.all4Apais(newShouPai).includes(na_pai)
      //不能再做为将的牌
      let cannotJiang =
        group_shoupai.anGang.includes(na_pai) ||
        group_shoupai.mingGang.includes(na_pai)
      if (already4A || cannotJiang) {
        continue
      } else {
        let hupai_typesCode = this.HupaiTypeCodeArr(
          group_shoupai,
          na_pai,
          is_liang
        )
        if (!_.isEmpty(hupai_typesCode)) {
          hupai_dict[na_pai] = hupai_typesCode
        }
      }
    }
    let all_hupai_zhang = _.keys(hupai_dict).map(v => parseInt(v))
    let flatten_hupai_data: Array<number> = _.flatten(_.values(hupai_dict))
    let all_hupai_typesCode: Array<number> = _.uniq(flatten_hupai_data)
    //如果hupai_data为空，sortBy也会返回空
    //哪怕是个空，也要返回其基本的数据结构，因为可能会有数组的判断在里面
    if (_.isEmpty(all_hupai_zhang)) {
      return {
        all_hupai_zhang: [],
        all_hupai_typesCode: [],
        hupai_dict: {}
      }
    }
    return {
      all_hupai_zhang: _.orderBy(all_hupai_zhang),
      all_hupai_typesCode: _.orderBy(all_hupai_typesCode),
      hupai_dict: hupai_dict
    }
  }

  /**胡什么牌，不仅要知道胡什么牌，还得知道是什么胡！*/
  static HuWhatPai(shou_pai: Array<Pai>): hupaiConstructor {
    let hupai_dict = {}
    let newShouPai: Array<Pai> = _.clone(shou_pai)

    for (var i = 0; i < all_single_pai.length; i++) {
      let na_pai = all_single_pai[i]

      // 是否已经存在4个single_pai? 如果存在，肯定不会胡这张牌！
      let already4A = this.all4Apais(shou_pai).includes(na_pai)
      if (already4A) {
        continue
      } else {
        let hupai_typesCode = this.HupaiTypeCodeArr(
          {
            anGang: [],
            mingGang: [],
            peng: [],
            selfPeng: [],
            shouPai: newShouPai
          },
          na_pai
        )
        //如果没有胡牌码
        if (!_.isEmpty(hupai_typesCode)) {
          // 保存胡牌及胡牌类型到hupai_dict中
          hupai_dict[na_pai] = hupai_typesCode
        }
      }
    }
    let all_hupai_zhang = _.keys(hupai_dict).map(n => parseInt(n))
    let flatten_hupai_data: Array<number> = _.flatten(_.values(hupai_dict))
    let all_hupai_typesCode: Array<number> = _.uniq(flatten_hupai_data)
    //如果hupai_data为空，sortBy也会返回空
    //哪怕是个空，也要返回其基本的数据结构，因为可能会有数组的判断在里面
    if (_.isEmpty(all_hupai_zhang)) {
      return {
        all_hupai_zhang: [],
        all_hupai_typesCode: [],
        hupai_dict: {}
      }
    }
    return {
      all_hupai_zhang: _.orderBy(all_hupai_zhang),
      all_hupai_typesCode: _.orderBy(all_hupai_typesCode),
      hupai_dict: hupai_dict
    }
  }
  /**group手牌中只有手牌，anGang, mingGang, peng都为空 */
  private static isOnlyShouPai(group_shoupai: GroupConstructor) {
    return (
      group_shoupai.anGang.length == 0 &&
      group_shoupai.mingGang.length == 0 &&
      group_shoupai.selfPeng.length == 0 &&
      group_shoupai.peng.length == 0
    )
  }

  // // static all_hupai_zhang(shou_pai) {
  // //   let hupai_data = this.HuWhatPai(shou_pai);
  // //   return _.map(hupai_data, item => item.hupai_zhang);
  // // }

  // // static all_hupai_types(shou_pai) {
  // //   let hupai_data = this.HuWhatPai(shou_pai);
  // //   let arr1 = [];
  // //   hupai_data.forEach(item => {
  // //     item.hupai_types.forEach(h_type => {
  // //       arr1.push(h_type);
  // //     });
  // //   });
  // //   return _.uniq(arr1);
  // // }

  /**是否是卡五星
   * @param na_pai 这张牌是否是4，6中间的牌
   */
  public static HuisKaWuXing(group_shoupai: GroupConstructor, na_pai: Pai) {
    // console.log(group_shoupai, na_pai);
    if (typeof na_pai != "number") {
      throw new Error("na_pai并非是数值")
    }

    let isHu = false
    if (na_pai != 5 && na_pai != 15) {
      //是否是5筒或者5条，不是就肯定不是卡五星
      return false
    } else {
      //取出这个5的左边及右边，再看剩下的是否是几句话。
      let flatShou = group_shoupai.shouPai
      let cloneShou = _.orderBy(flatShou.concat(na_pai))
      let allJiang = this.getAllJiangArr(cloneShou)

      allJiang.some(jiang => {
        let newClone = _.clone(cloneShou)
        let index = newClone.indexOf(jiang)
        newClone.splice(index, 2)
        //删除卡三星的三张牌
        index = newClone.indexOf(na_pai - 1)
        if (index > -1) {
          //如果没有3，那么肯定不是卡王星
          newClone.splice(index, 1)
        } else {
          return false
        }
        index = newClone.indexOf(na_pai)
        if (index > -1) {
          //5也可能是将，删除后就找不到喽！
          newClone.splice(index, 1)
        } else {
          return false
        }
        index = newClone.indexOf(na_pai + 1)
        if (index > -1) {
          newClone.splice(index, 1)
        } else {
          return false
        }

        // console.log("将，删除卡三张后：", jiang, newClone);
        //将删除掉，卡五星也删除之后为空，类似于b1 b2 t4 t5 t6这种特殊情况也是卡五星
        if (newClone.length == 0) {
          isHu = true
          return true
        }
        // console.log("删除卡三张后：", newClone.map(ka=>typeof ka));

        //看剩下的牌是否是几句话
        isHu = this.isJiJuhua(newClone)
        // console.log("isHu:", isHu);

        if (isHu) {
          // console.log('hu:', jiang);
          return true
        }
      })
      return isHu
    }
  }

  /**是否是小三元
   * 小三元是zh, fa, di中有一对将，其它为刻子，比如zh zh, fa fa fa, di di di。。。就是小三元了
   */
  static HuisXiaoShanYuan(group_shoupai: GroupConstructor, na_pai: Pai) {
    return this._HuisWhichShanYuan(this.flat_shou_pai(group_shoupai), na_pai, 2)
  }
  /**小三元检测 */
  static _HuisWhichShanYuan(
    shou_arr: Array<Pai>,
    na_pai: Pai,
    which: number = 2
  ) {
    let cloneShouPai = _.orderBy(_.clone(shou_arr).concat(na_pai))
    if (cloneShouPai.length < 14) {
      throw new Error(`shou_pai: ${shou_arr} must larger than 14 values`)
    }
    // console.log("====================================");
    // console.log(result);
    // console.log(this._HuisPihu(shou_pai, na_pai));
    // console.log("====================================");
    let allZhiPai = cloneShouPai.filter(v => v > 30)
    //少于8张字牌肯定不是卡五星
    if (allZhiPai.length < which + 3 + 3) {
      return false
    }
    //统计字牌出现的次数，比如
    // c1=_.countBy([31,31,33,33,33,35,35,35], i=>i)
    // =>{31: 2, 33: 3, 35: 3}
    let countZhiPai = _.countBy(allZhiPai, i => i)
    //取得他们的次数并排序[2,3,3]
    let values = _.values(countZhiPai).sort()
    //如果有将并且其它两类大于2，也就是3或者4张
    if (values[0] == which && values[1] > 2 && values[2] > 2) {
      //得到所有的非字牌，这时候不需要再去判断将了，因为小三元里面肯定有一个将！
      let remainPais = cloneShouPai.filter(v => v < 30)
      if (which == 2) {
        //小三元只需要检测剩下的牌是否是几句话即可！
        return this.isJiJuhua(remainPais)
      } else if (which == 3) {
        //大三元要检测剩下带将的几句话
        return this.jiangJiJuhua(remainPais)
      }
    } else {
      //屁胡都不是，自然也不是小三元了
      return false
    }
  }

  /**只判断三个即可，这也包括了四个的情况！
   * 大三元其实最好判断了，三个一样的zh,fa,di检测即可！
   */
  static HuisDaShanYuan(group_shoupai: GroupConstructor, na_pai: Pai): boolean {
    return this._HuisWhichShanYuan(this.flat_shou_pai(group_shoupai), na_pai, 3)
  }

  //杠上开花，自己杠了个牌，然后胡了,要与玩家杠之后联系上。
  static _HuisGangShangKai(
    group_shoupai: GroupConstructor,
    na_pai: Pai,
    isSelfGang: boolean
  ) {
    //杠了之后才会去检测是否胡，还得检测是哪种胡！
    if (isSelfGang) {
      //还得知道是哪种胡！但肯定不会是七对类型的。返回的其实就应该是整个胡牌的情况，杠上开会在胡牌的基础上多算番
      return this.HupaiTypeCodeArr(group_shoupai, na_pai)
    }
    return false
  }
  //杠上炮，别人打的杠牌，你可以胡, other_pai看是否是别人打的。
  static HuisGangShangPao(
    group_shoupai: GroupConstructor,
    na_pai: Pai,
    isOtherDaGangpai: boolean
  ) {
    if (isOtherDaGangpai) {
      return this.HupaiTypeCodeArr(group_shoupai, na_pai)
    }
    return false
  }

  /**明四归 */
  static HuisMingSiGui(
    group_shou_pai: GroupConstructor,
    na_pai: Pai,
    is_liang: boolean
  ) {
    if (this.HuisPihu(group_shou_pai, na_pai)) {
      if (group_shou_pai.peng.includes(na_pai)) {
        return true
      }
      //如果亮牌，并且存在三张同样的na_pai这也是明四归
      if (is_liang && this.exist3A(group_shou_pai.shouPai, na_pai)) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
  /**
   * 是否存在pai_name的3张重复牌？
   * @param arr_pai
   * @param pai_name 牌名称
   */
  static exist3A(arr_pai: Array<Pai>, pai_name: Pai) {
    console.log("arr_pai.filter(pai => pai == pai_name)",arr_pai.filter(pai => pai == pai_name));
    
    return arr_pai.filter(pai => pai == pai_name).length === 3
  }
  /**暗四归 */
  static HuisAnSiGui(
    group_shou_pai: GroupConstructor,
    na_pai: Pai,
    is_liang: boolean
  ) {
    if (this.HuisPihu(group_shou_pai, na_pai)) {
      if (group_shou_pai.selfPeng.includes(na_pai)) {
        return true
      }
      //如果手牌里面有三张na_pai, 还要看是否亮牌，亮了就不是暗四归了！
      if (this.exist3A(group_shou_pai.shouPai, na_pai)) {
        if (is_liang) {
          return false
        } else {
          return true
        }
      }
      return false
    } else {
      return false
    }
  }

  /**胡牌类型码数组，象杠上开花是多算番的胡，并不是基本的胡牌*/
  static HupaiTypeCodeArr(
    group_shoupai: GroupConstructor,
    na_pai: Pai,
    is_liang = false
  ): Array<number> {
    let huArr = []

    if (this.HuisKaWuXing(group_shoupai, na_pai)) {
      huArr.push(config.HuisKaWuXing)
    }
    if (this.HuisQiDui(group_shoupai, na_pai)) {
      huArr.push(config.HuisQidui)
    }
    if (this.HuisNongQiDui(group_shoupai, na_pai)) {
      huArr.push(config.HuisNongQiDui)
    }
    if (this.HuisPengPeng(group_shoupai, na_pai)) {
      huArr.push(config.HuisPengpeng)
    }
    if (this.HuisXiaoShanYuan(group_shoupai, na_pai)) {
      huArr.push(config.HuisXiaoShanYuan)
    }
    if (this.HuisDaShanYuan(group_shoupai, na_pai)) {
      huArr.push(config.HuisDaShanYuan)
    }
    if (this.HuisMingSiGui(group_shoupai, na_pai, is_liang)) {
      huArr.push(config.HuisMingSiGui)
    }
    if (this.HuisAnSiGui(group_shoupai, na_pai, is_liang)) {
      huArr.push(config.HuisAnSiGui)
    }
    //只有不是大胡的时候才去检测屁胡！
    if (_.isEmpty(huArr) && this.HuisPihu(group_shoupai, na_pai)) {
      huArr.push(config.HuisPihu)
    }
    //如果有胡，才去检测是否是清一色
    if (!_.isEmpty(huArr) && this.IsYise(group_shoupai, na_pai)) {
      huArr.push(config.IsYise)
    }
    // console.log(_huArr.map(n=>typeof n));

    return _.orderBy(huArr)
  }
  /**获取到所有胡牌类型的名称 */
  static HuPaiNames(group_shoupai: GroupConstructor, na_pai: Pai) {
    let result = []
    // console.log(group_shoupai);
    // console.log("this.HupaiTypeCodeArr(group_shoupai, na_pai):",this.HupaiTypeCodeArr(group_shoupai, na_pai));

    this.HupaiTypeCodeArr(group_shoupai, na_pai).forEach(item => {
      result.push(config.HuPaiSheet[item].name)
    })
    return result
  }
  /**胡牌文字描述 */
  static HuPaiNamesFrom(hupaicodeArr: number[]): string[] {
    return hupaicodeArr.map(code => {
      // return config.HuPaiSheet[item].name;
      return config.HuPaiSheet.find(item => item.type == code).name
    })
  }
  static GangNamesFrom(gangCodeArr: number[], is_win: boolean): string[] {
    let result = []
    let name: string
    gangCodeArr.forEach(code => {
      if (is_win) {
        name = config.GangWinSheet.find(item => item.type === code).name
        result.push(name)
      } else {
        name = config.GangLoseSheet.find(item => item.type === code).name
        result.push(name)
      }
    })
    return result
  }

  /**放炮文字描述 */
  static LoseNamesFrom(loseData: any[]): string[] {
    let loseCodesArr = loseData.map(item => item.type)
    return loseCodesArr.map(code => {
      return config.GangLoseSheet.find(item => item.type == code).name
    })
  }

  /**通过胡的类型码数组来判断是否是大胡*/
  static isDaHu(hupaicodeArr: Array<number>) {
    if (_.isEmpty(hupaicodeArr)) {
      return false
    }
    if (
      //新版本的一色肯定是大胡，因为清一色的判断是在有胡的基础上才会判断的！
      hupaicodeArr.includes(config.IsYise) ||
      hupaicodeArr.includes(config.HuisKaWuXing) ||
      hupaicodeArr.includes(config.HuisQidui) ||
      hupaicodeArr.includes(config.HuisNongQiDui) ||
      hupaicodeArr.includes(config.HuisPengpeng) ||
      hupaicodeArr.includes(config.HuisXiaoShanYuan) ||
      hupaicodeArr.includes(config.HuisDaShanYuan) ||
      hupaicodeArr.includes(config.HuisMingSiGui) ||
      hupaicodeArr.includes(config.HuisAnSiGui)
    ) {
      return true
    }
    return false
  }

  /**能碰吗？ */
  static canPeng(shouPai: Array<Pai>, pai_name: Pai, isLiang: boolean) {
    //如果玩家已经亮牌，就不再检测手牌里面是否能碰了！如果有三张，玩家可以选择成为selfPeng，或者亮牌
    // 这样也不能再碰
    if (isLiang) {
      return false
    }
    //判断下玩家手牌中是否有两张na_pai即可
    let countPai = shouPai.filter(pai => pai == pai_name)
    return countPai.length === 2
  }
  /**检测group_shoupai中的shouPai是否能扛, 也就是检测剩下的没有碰、杠的牌 */
  static _canGang(shouPai: Array<Pai>, pai_name: Pai) {
    //判断手牌中是否有na_pai三张
    let countPai = shouPai.filter(pai => pai == pai_name)
    return countPai.length === 3
  }
  /**
   * group牌能杠吗？
   * @param group_shoupai
   * @param pai_name 能否杠此牌
   * @param isLiang 是否亮了
   * @param selfMo 是否是自己摸的牌，默认非自己摸牌
   */
  static canGang(
    group_shoupai: GroupConstructor,
    pai_name: Pai,
    isLiang: boolean,
    selfMo: boolean = false
  ) {
    let result = false
    //不管啥情况 ，只要selfPeng里面包括这张pai_name, 那么就肯定可以扛！
    //selfPeng只有在用户亮的时候才会出现！
    if (group_shoupai.selfPeng.includes(pai_name)) {
      // if (!isLiang) {
      //   throw new Error(`已经有selfPeng了，居然还没有亮牌？${group_shoupai}`)
      // }
      return true
    }
    // 如果selfPeng里面不包括这张pai_name
    //如果亮牌了那么碰里面包括自己摸的牌，说明是个擦炮！不管有没有亮！
    if (group_shoupai.peng.includes(pai_name) && selfMo) {
      return true
    }
    if (!isLiang) {
      //没有亮牌
      //看手牌里面是否有三张牌！是否是自己摸的不重要，只要自己手里有三张就能扛
      let countPai = group_shoupai.shouPai.filter(v => v == pai_name).length
      result = countPai === 3
    }
    //最后，手里面是否已经有四张相同的牌了？
    return result
  }

  /**
   * 能够在peng, selfPeng里可以自扛以及暗杠的牌，扛别人的牌要用canGang方法
   * @param group_shoupai
   * @param mo_pai 玩家摸到的牌
   */
  static canGangPais(group_shoupai: GroupConstructor, mo_pai: Pai): number[] {

    let output: number[] = []
    //peng里面是否包含shouPai中的一张，自己摸的，还要判断下有没有mo_pai!
    output = output.concat(
      group_shoupai.peng.filter(pai => group_shoupai.shouPai.includes(pai))
    )
    //自己隐藏的selfPeng里面是否包含shouPai中的自摸牌？
    output = output.concat(
      group_shoupai.selfPeng.filter(pai => group_shoupai.shouPai.includes(pai))
    )
    //mo_pai不为空，那么还要判断peng,selfPeng里面是否包含mo_pai!
    if (mo_pai != null) {
      if (group_shoupai.peng.includes(mo_pai)) {
        output.push(mo_pai)
      }
      if (group_shoupai.selfPeng.includes(mo_pai)) {
        output.push(mo_pai)
      }
      // console.log("group_shoupai.shouPai, mo_pai:",group_shoupai.shouPai, mo_pai);
      
      //如果摸牌可以在shouPai中找到3个，自然也是可以扛的！
      if ( this.exist3A(group_shoupai.shouPai, mo_pai)) {
        output.push(mo_pai)
      }
    }
    //最后看看shouPai里面有没有本来就是4A的，有可能留着以后再扛
    output = output.concat(NMajiangAlgo.all4Apais(group_shoupai.shouPai))
    return _.orderBy(output)
  }
}
