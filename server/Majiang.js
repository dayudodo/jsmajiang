//麻将判胡算法主程序

import _ from "lodash";
import chalk from "chalk";
import * as config from "./../config";
// 全局常量，所有的牌
var BING = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"];
var TIAO = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"];
// 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
var ZHIPAI = ["zh", "fa", "di"];

var all_single_pai = BING.concat(TIAO).concat(ZHIPAI);

Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
  return this;
};
Array.prototype.equalArrays = function(b) {
  if (this.length != b.length) return false; // Different-size arrays not equal
  for (
    var i = 0;
    i < this.length;
    i++ // Loop through all elements
  )
    if (this[i] !== b[i]) return false; // If any differ, arrays not equal
  return true; // Otherwise they are equal
};

function checkValidAndReturnArr(str) {
  if (!str || str.length == 0) {
    throw new Error("str is empty");
    //如果是数组，那么就直接返回，可能就是一套手牌，比如["b1","b2"...]
  } else if (str instanceof Array) {
    return str;
  } else {
    let result = str.replace(/\s+/g, ""); //首先去掉空格
    if (result.length == 0) {
      throw new Error("str is empty");
    }
    result = result.match(/(..)/g); //再二二分割
    if (result.length == 0) {
      throw new Error("result is empty");
    } else {
      return result.sort();
    }
  }
}

function getAllJiangArr(result) {
  return result.join("").match(/(..)\1/g);
}

export class Majiang {
  /*
可以把b1b1b1或者说b1 b1 b1转换成双字符规则数组["b1","b1","b1"]
*/

  static isAA(str) {
    let result = checkValidAndReturnArr(str);
    if (result.length != 2) {
      throw new Error(`str${str} must have 2 values`);
    }
    //不支持Es6语法，奈何？
    let s1 = result[0],
      s2 = result[1];
    return s1 == s2;
  }

  static isAAA(str) {
    let result = checkValidAndReturnArr(str);
    if (result.length != 3) {
      throw new Error(`str${str} must have 3 values`);
    }
    let s1 = result[0],
      s2 = result[1],
      s3 = result[2];
    return s1 == s2 && s2 == s3;
  }

  static is4A(str) {
    let result = checkValidAndReturnArr(str);
    if (result.length != 4) {
      throw new Error(`str${str} must have 4 values`);
    }
    let s1 = result[0],
      s2 = result[1],
      s3 = result[2],
      s4 = result[3];
    return s1 == s2 && s2 == s3 && s3 == s4;
  }
  //一套牌能够碰给出的pai
  static canPeng(shouPai, pai) {
    if (typeof pai != "string") {
      throw new Error(`pai must be a string`);
    }
    //貌似会改变以前的数组值，所以得克隆一份来进行检测
    let result = _.clone(checkValidAndReturnArr(shouPai));
    let newstr = result
      .concat(pai)
      .sort()
      .join("");
    let paiThreeTimesReg = new RegExp(`(${pai})\\1\\1`);
    return paiThreeTimesReg.test(newstr.replace(/\s+/g, ""));
  }
  static canGang(shouPai, pai) {
    if (typeof pai != "string") {
      throw new Error(`pai must be a string`);
    }
    let result = checkValidAndReturnArr(shouPai);
    let newstr = result
      .concat(pai)
      .sort()
      .join("");
    let paiFourTimesReg = new RegExp(`(${pai})\\1\\1\\1`);
    return paiFourTimesReg.test(newstr.replace(/\s+/g, ""));
  }
  static isABC(str) {
    let result = checkValidAndReturnArr(str);
    if (result.length != 3) {
      throw new Error(`str${str} must have 3 values`);
    }
    let s1 = result[0],
      s2 = result[1],
      s3 = result[2];
    //判断首字母是否相同(判断相同花色)以及 是否是1，2，3这样的顺序
    let isABC =
      s2[1] - 1 == s1[1] &&
      s3[1] - 1 == s2[1] &&
      (s1[0] == s2[0] && s2[0] == s3[0]);
    return isABC;
  }

  static isABCorAAA(str) {
    return this.isAAA(str) || this.isABC(str);
  }
  static is2ABC(str) {
    //like 123456 or 122334,233445这样的牌型
    let result = checkValidAndReturnArr(str);
    if (result.length != 6) {
      throw new Error(`str${str} must have 6 values`);
    }
    let s1 = result[0],
      s2 = result[1],
      s3 = result[2],
      s4 = result[3],
      s5 = result[4],
      s6 = result[5];
    let frontThree = [s1, s2, s3];
    let lastThree = [s4, s5, s6];
    //特殊情况，比如112233的情况？
    if (s1 == s2 && s3 == s4 && s5 == s6) {
      return this.isABC([s1, s3, s5]);
    }
    if (this.isABCorAAA(frontThree) && this.isABCorAAA(lastThree)) {
      return true;
    } else {
      //交换2,3 比如将122334中间的两个交换过来，再检查
      frontThree = [s1, s2, s4];
      lastThree = [s3, s5, s6];
      // console.log(frontThree,lastThree)
      if (this.isABCorAAA(frontThree) && this.isABCorAAA(lastThree)) {
        return true;
      } else {
        return false;
      }
    }
  }

  static is3ABC(str) {
    let result = checkValidAndReturnArr(str);
    if (result.length != 9) {
      throw new Error(`str${str} must have 9 values`);
    }
    let frontThree = result.slice(0, 3);
    let lastSix = result.slice(3, 9);
    let frontSix = result.slice(0, 6);
    let lastThree = result.slice(6, 9);
    // console.log(frontThree,lastSix)
    if (this.isABCorAAA(frontThree) && this.is2ABC(lastSix)) {
      return true;
    } else if (this.is2ABC(frontSix) && this.isABCorAAA(lastThree)) {
      return true;
    } else {
      return false;
    }
  }
  static is4ABC(str) {
    let result = checkValidAndReturnArr(str);
    if (result.length != 12) {
      throw new Error(`str${str} must have 9 values`);
    }
    let frontThree = result.slice(0, 3);
    let lastNine = result.slice(3, 12);
    let frontNine = result.slice(0, 9);
    let lastThree = result.slice(9, 12);
    let frontSix = result.slice(0, 6);
    let lastSix = result.slice(6, 12);
    if (this.is2ABC(frontSix) && this.is2ABC(lastSix)) {
      return true;
    }
    if (this.isABCorAAA(frontThree) && this.is3ABC(lastNine)) {
      return true;
    } else if (this.is3ABC(frontNine) && this.isABCorAAA(lastThree)) {
      return true;
    } else {
      return false;
    }
  }
  /*
返回所有的将，比如"b1b2b2b3b3b4b4b5b5b5b6b7b7b7"会返回
["b2b2", "b3b3", "b4b4", "b5b5", "b7b7"]
*/

  static HuisPihu(str, na_pai) {
    let result = checkValidAndReturnArr(str)
      .concat(na_pai)
      .sort();
    let allJiang = getAllJiangArr(result);
    let is_hu = false;
    let reg_four = /(..)\1\1\1/g;
    let reg_three = /(..)\1\1/g;
    // console.log(allJiang)
    //循环的目的是因为可能胡不止一张牌
    if (allJiang) {
      allJiang.forEach(item => {
        // console.log(item)
        var newstr = result.join("");
        //首先去掉四个一样的牌，杠可能有多个
        newstr = newstr.replace(item, "");
        var origin = newstr;
        newstr = newstr.replace(reg_four, "");
        // console.log(newstr)
        for (var i = 0; i < 2; i++) {
          if (newstr.length == 0) {
            console.log(`检查${origin}, 可能不是一手牌`);
            // 有可能遇到全是杠的情况
            is_hu = true;
            break;
          } else {
            let last_result = checkValidAndReturnArr(newstr);
            // console.log(last_result)
            switch (last_result.length) {
              case 3:
                if (this.isABCorAAA(last_result)) {
                  is_hu = true;
                }
                break;
              case 6:
                if (this.is2ABC(last_result)) {
                  is_hu = true;
                }
                break;
              case 9:
                if (this.is3ABC(last_result)) {
                  is_hu = true;
                }
                break;
              case 12:
                if (this.is4ABC(last_result)) {
                  is_hu = true;
                }
                break;
            }
            if (false == is_hu) {
              newstr = origin.replace(reg_three, "");
            }
          }
        }
      });
      return is_hu;
    } else {
      //连将都没有，自然不是屁胡
      return false;
    }
  }

  static HuisQidui(str, na_pai) {
    //判断是否是七对
    let result = checkValidAndReturnArr(str)
      .concat(na_pai)
      .sort();
    if (result.length < 13) {
      throw new Error(`str${str} must have 13 values`);
    }
    // console.log(result)
    for (var i = 0; i < result.length; i += 2) {
      if (result[i] == result[i + 1]) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  }
  static HuisNongQiDui(str, na_pai) {
    let result = checkValidAndReturnArr(str)
      .concat(na_pai)
      .sort();
    if (result.length < 13) {
      throw new Error(`str:${str} must have 13 values`);
    }
    if (this.HuisQidui(str, na_pai)) {
      let uniq = new Set(result);
      return uniq.size < 7;
    } else {
      return false;
    }
  }
  //是否是清一色，
  static HuisYise(str, na_pai) {
    let result = checkValidAndReturnArr(str)
      .concat(na_pai)
      .sort();
    if (result.length < 14) {
      throw new Error(`str:${str}  must larger than 14 values`);
    }
    let first = result.map(item => item[0]);
    let isUniq = new Set(first).size;
    //不仅要是一色而且还得满足平胡
    return isUniq == 1 && this.HuisPihu(str, na_pai);
  }
  static HuisPengpeng(str, na_pai) {
    let result = checkValidAndReturnArr(str)
      .concat(na_pai)
      .sort();
    if (result.length < 14) {
      throw new Error(`str:${str} must larger than 14 values`);
    }
    //把所有三个或四个相同的干掉，看最后剩下的是否是将
    let reg = /(..)\1\1\1?/g;
    let jiang = result.join("").replace(reg, "");
    if (jiang.length != 4) {
      return false;
    }
    return this.isAA(jiang);
  }

  //胡什么牌，以前的名称是WhoIsHu，不仅要知道胡什么牌，还得知道是什么胡！
  static HuWhatPai(shou_pai) {
    let result = checkValidAndReturnArr(shou_pai);
    let hupai_data = [];

    for (var i = 0; i < all_single_pai.length; i++) {
      let single_pai = all_single_pai[i];
      let newShouPaiStr = result
        .concat(single_pai)
        .sort()
        .join("");
      // console.log(newstr)
      let isFiveRepeat = /(..)\1\1\1\1/g.test(newShouPaiStr);
      if (isFiveRepeat) {
        continue;
        // console.log(newstr.match(/(..)\1\1\1\1/g))
        // throw new Error('irregular Pai, record in database, maybe Hacker.')
        //貌似屁胡已经包括了碰碰胡，还需要整理下，为啥龙七对不能包括在内呢？怪事儿。
      } else {
        let hupai_types = this.HupaiTypeCodeArr(result, single_pai);
        if (!_.isEmpty(hupai_types)) {
          hupai_data.push({
            hupai_zhang: single_pai,
            hupai_types: hupai_types
          });
        }
      }
    }
    if (_.isEmpty(hupai_data)) {
      //如果没有找到，就返回false,便于判断
      return false;
    } else {
      return _.sortBy(hupai_data, item=>item.hupai_zhang)
    }
  }

  static isDaHuTing(shou_pai){
    let hupai_data = this.HuWhatPai(shou_pai)
    return _.some(hupai_data, item=>this.isDaHu(item.hupai_types))
  }

  static HuisKaWuXing(str, na_pai) {
    let result = checkValidAndReturnArr(str)
      .concat(na_pai)
      .sort();
    if (result.length < 14) {
      throw new Error(`str${str} must larger than 14 values`);
    }
    //胡牌但是并不是碰胡也不是将牌，就是卡五星,或者胡牌并且两边有4，5，也是卡五星，如果是45556的情况？
    if (this.HuisPihu(result)) {
      if (na_pai[1] == 5) {
        let four = na_pai[0] + "4";
        let six = na_pai[0] + "6";
        let is_huwu = result.includes(four) && result.includes(six);
        //去掉这三张牌，看剩下的是否符合手牌规则
        if (is_huwu) {
          let after_delete_kawa = result
            .remove(na_pai)
            .remove(four)
            .remove(six);
          return this.HuisPihu(after_delete_kawa);
        }
      }
    }
    return false;
  }

  //只能重复两次，不能重复三次！
  static isRepeatTwiceOnly(shou_pai_str, str) {
    if (typeof shou_pai_str != "string") {
      throw new Error(chalk.red("isRepeatTwiceOnly首参数必须是字符串！"));
    }
    let m = shou_pai_str.match(new RegExp(`(${str})+`));
    if (m && m[0]) {
      return m[0].length == 4; //如果不等于4说明并不是重复了2次！
    }
    return false;
  }

  static HuisXiaoShanYuan(str, na_pai) {
    //小三元是zh, fa, di中有一对将，其它为刻子，比如zh zh, fa fa fa, di di di。。。就是小三元了
    let result = checkValidAndReturnArr(str)
      .concat(na_pai)
      .sort();
    if (result.length < 14) {
      throw new Error(`str${str} must larger than 14 values`);
    }
    if (this.HuisPihu(result)) {
      //将里面有没有zh, fa, di, 或者可以用表查询来做，毕竟组合就那么几个
      let xiaoSheet = [
        ["zh", "fafafa", "dididi"],
        ["fa", "zhzhzh", "dididi"],
        ["di", "zhzhzh", "fafafa"]
      ];
      let shouStr = result.join("");
      let isXiao = false;
      xiaoSheet.forEach(s => {
        //只要判断是否有上面的三种即可！
        let [xiaoReg1, xiaoReg2] = [new RegExp(s[1]), new RegExp(s[2])];
        if (
          this.isRepeatTwiceOnly(shouStr, s[0]) &&
          xiaoReg1.test(shouStr) &&
          xiaoReg2.test(shouStr)
        ) {
          isXiao = true;
        }
      });
      return isXiao;
    } else {
      //屁胡都不是，自然也不是小三元了
      return false;
    }
  }

  //只判断三个即可，这也包括了四个的情况！
  static HuisDaShanYuan(str, na_pai) {
    //大三元其实最好判断了，三个一样的zh,fa,di检测即可！
    let result = checkValidAndReturnArr(str)
      .concat(na_pai)
      .sort();
    if (result.length < 14) {
      throw new Error(`str${str} must larger than 14 values`);
    }
    if (this.HuisPihu(result)) {
      let shouStr = result.join("");
      let isDa = false;
      //只要判断是否有上面的三种即可！
      let [xiaoReg0, xiaoReg1, xiaoReg2] = [
        new RegExp("zhzhzh"),
        new RegExp("fafafa"),
        new RegExp("dididi")
      ];
      if (
        xiaoReg0.test(shouStr) &&
        xiaoReg1.test(shouStr) &&
        xiaoReg2.test(shouStr)
      ) {
        isDa = true;
      }
      return isDa;
    }
    //屁胡都不是，自然也不是大三元了
    return false;
  }
  //杠上开花，自己杠了个牌，然后胡了,要与玩家杠之后联系上。
  static HuisGangShangKai(shou_pai, na_pai, isSelfGang) {
    //杠了之后才会去检测是否胡，还得检测是哪种胡！
    if (isSelfGang) {
      //还得知道是哪种胡！但肯定不会是七对类型的。返回的其实就应该是整个胡牌的情况，杠上开会在胡牌的基础上多算番
      return this.HupaiTypeCodeArr(shou_pai, na_pai);
    }
    return false;
  }
  //杠上炮，别人打的杠牌，你可以胡, other_pai看是否是别人打的。
  static HuisGangShangPao(shou_pai, na_pai, isOtherDaGangpai) {
    if (isOtherDaGangpai) {
      return this.HupaiTypeCodeArr(shou_pai, na_pai);
    }
    return false;
  }

  //哪种基本的胡牌，象杠上开花是多算番的胡，并不是基本的胡牌
  static HupaiTypeCodeArr(str, na_pai) {
    let _huArr = [];
    if (this.HuisYise(str, na_pai)) {
      _huArr.push(config.HuisYise);
    }
    if (this.HuisKaWuXing(str, na_pai)) {
      _huArr.push(config.HuisKaWuXing);
    }
    if (this.HuisQidui(str, na_pai)) {
      _huArr.push(config.HuisQidui);
    }
    if (this.HuisNongQiDui(str, na_pai)) {
      _huArr.push(config.HuisNongQiDui);
    }
    if (this.HuisPengpeng(str, na_pai)) {
      _huArr.push(config.HuisPengpeng);
    }
    if (this.HuisXiaoShanYuan(str, na_pai)) {
      _huArr.push(config.HuisXiaoShanYuan);
    }
    if (this.HuisDaShanYuan(str, na_pai)) {
      _huArr.push(config.HuisDaShanYuan);
    }
    // if (this.HuisGangShangKai(str, na_pai)) {
    //   _huArr.push(config.HuisGangShangKai);
    // }
    // if (this.HuisGangShangPao(str, na_pai)) {
    //   _huArr.push(config.HuisGangShangPao);
    // }
    if (this.HuisPihu(str, na_pai)) {
      _huArr.push(config.HuisPihu);
    }
    return _huArr;
  }
  static HuPaiNames(str, na_pai) {
    let _output = [];
    this.HupaiTypeCodeArr(str, na_pai).forEach(item => {
      _output.push(config.HuPaiSheet[item].name);
    });
    return _output;
  }
  static HuPaiNamesFromArr(hupaicodeArr) {
    return hupaicodeArr.map(item => {
      return config.HuPaiSheet[item].name;
    });
  }
  //是否是大胡，通过胡的类型码数组来进行判断
  static isDaHu(hupaicodeArr) {
    if (!_.isArray(hupaicodeArr)) {
      throw new Error(`hupaicodeArr必须是个数组，但：${hupaicodeArr}`);
    }
    if (
      hupaicodeArr.includes(config.HuisYise) ||
      hupaicodeArr.includes(config.HuisKaWuXing) ||
      hupaicodeArr.includes(config.HuisQidui) ||
      hupaicodeArr.includes(config.HuisNongQiDui) ||
      hupaicodeArr.includes(config.HuisPengpeng) ||
      hupaicodeArr.includes(config.HuisXiaoShanYuan) ||
      hupaicodeArr.includes(config.HuisDaShanYuan)
    ) {
      return true;
    }
    return false;
  }
}
