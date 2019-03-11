"use strict";
//麻将判胡算法主程序
exports.__esModule = true;
var _ = require("lodash");
var chalk_1 = require("chalk");
var config = require("./config");
// 全局常量，所有的牌
var BING = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"];
var TIAO = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"];
// 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
var ZHIPAI = ["zh", "fa", "di"];
var all_single_pai = BING.concat(TIAO).concat(ZHIPAI);
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
    return this;
};
Array.prototype.equalArrays = function (b) {
    if (this.length != b.length)
        return false; // Different-size arrays not equal
    for (var i = 0; i < this.length; i++ // Loop through all elements
    )
        if (this[i] !== b[i])
            return false; // If any differ, arrays not equal
    return true; // Otherwise they are equal
};
function getArr(str) {
    if (!str || str.length == 0) {
        // throw new Error("str is empty");
        return [];
        //如果是数组，那么就直接返回，可能就是一套手牌，比如["b1","b2"...]
    }
    else if (str instanceof Array) {
        return str;
    }
    else {
        var result = str.replace(/\s+/g, ""); //首先去掉空格
        if (result.length == 0) {
            throw new Error("str is empty");
        }
        result = result.match(/(..)/g); //再二二分割
        if (result.length == 0) {
            throw new Error("result is empty");
        }
        else {
            return result.sort();
        }
    }
}
exports.getArr = getArr;
function getAllJiangArr(result) {
    return result.join("").match(/(..)\1/g);
}
/**麻将胡牌算法 */
var MajiangAlgo = /** @class */ (function () {
    function MajiangAlgo() {
    }
    /*
  可以把b1b1b1或者说b1 b1 b1转换成双字符规则数组["b1","b1","b1"]
  */
    MajiangAlgo.isAA = function (test_arr) {
        // if (test_arr.length != 2) {
        //   throw new Error(`test_arr:  ${test_arr} must have 2 values`);
        // }
        if (_.isEmpty(test_arr)) {
            return false;
        }
        var s1 = test_arr[0], s2 = test_arr[1];
        return s1 == s2;
    };
    MajiangAlgo._isAAA = function (test_arr) {
        var result = getArr(test_arr);
        if (result.length != 3) {
            throw new Error("test_arr: " + test_arr + " \u5FC5\u987B\u7B49\u4E8E3");
        }
        var s1 = result[0], s2 = result[1], s3 = result[2], s4 = result[3];
        return s1 == s2 && s2 == s3;
    };
    MajiangAlgo._is4A = function (test_arr) {
        var result = getArr(test_arr);
        if (result.length != 4) {
            throw new Error("test_arr: " + test_arr + "\u5FC5\u987B\u7B49\u4E8E4");
        }
        var s1 = result[0], s2 = result[1], s3 = result[2], s4 = result[3];
        return s1 == s2 && s2 == s3 && s3 == s4;
    };
    // static is34A(test_arr) {
    //   let result = checkValidAndReturnArr(test_arr);
    //   if (result.length == 3) {
    //     return this._isAAA(test_arr);
    //   }
    //   if (result.length == 4) {
    //     return this._is4A(test_arr);
    //   }
    // }
    MajiangAlgo.isABC = function (test_arr) {
        var result = getArr(test_arr);
        if (result.length < 3) {
            // throw new Error(`test_arr: ${test_arr} 必须大于等于3`);
            return false;
        }
        var s1 = result[0], s2 = result[1], s3 = result[2];
        //判断首字母是否相同(判断相同花色)以及 是否是1，2，3这样的顺序
        var isABC = parseInt(s2[1]) - 1 == parseInt(s1[1]) &&
            parseInt(s3[1]) - 1 == parseInt(s2[1]) &&
            (s1[0] == s2[0] && s2[0] == s3[0]);
        return isABC;
    };
    MajiangAlgo.isABCorAAA = function (test_arr) {
        var result = getArr(test_arr);
        if (result.length == 3) {
            return this._isAAA(test_arr) || this.isABC(test_arr);
        }
        if (result.length == 4) {
            return this._is4A(test_arr);
        }
    };
    /**是否是2句话，最复杂！ */
    MajiangAlgo.is2ABC = function (test_arr) {
        //like 123456 or 122334,233445这样的牌型
        var result = getArr(test_arr);
        if (result.length < 6) {
            return false;
        }
        if (result.length < 4) {
            //为啥不是6呢？因为在3ABC里面有可能会出现fa fa fa t1 t2 t3 t4 t5 t6这样的情况
            //后面的4个被切掉，前面就不够6个了，自然不是3ABC
            //为啥不是5呢？在小三元的检测里面也会有少于6个的情况。手牌为b1 b1 b1 b2 b3 di di di fa fa zh zh zh
            throw new Error("test_arr: " + test_arr + " \u5FC5\u987B\u5927\u4E8E\u7B49\u4E8E4");
        }
        var s1 = result[0], s2 = result[1], s3 = result[2], s4 = result[3], s5 = result[4], s6 = result[5];
        var startThree = result.slice(0, 3);
        var afterThree = result.slice(3, result.length);
        //前三和后面的几个，比如b1 b2 b3 zh zh zh zh
        var beforeThree = result.slice(0, result.length - 3);
        var endThree = result.slice(result.length - 3, result.length);
        //前四和后面的几个，比如b1 b1 b1 b1 t1 t2 t3
        var startFour = result.slice(0, 4);
        var afterFour = result.slice(4, result.length);
        //特殊情况，比如112233的情况？
        if (result.length == 6) {
            //如果是正规的6张牌
            if (s1 == s2 && s3 == s4 && s5 == s6) {
                return this.isABC([s1, s3, s5]);
            }
            if (this.isABCorAAA(startThree) && this.isABCorAAA(afterThree)) {
                return true;
            }
            else {
                //交换2,3 比如将122334中间的两个交换过来，再检查
                var first3 = [s1, s2, s4];
                var after3 = [s3, s5, s6];
                if (this.isABCorAAA(first3) && this.isABCorAAA(after3)) {
                    return true;
                }
                //b4 b5 b5 b5 b5 b6 则也需要交换一下
                first3 = [s1, s2, s6];
                after3 = [s3, s4, s5];
                if (this.isABCorAAA(first3) && this.isABCorAAA(after3)) {
                    return true;
                }
                return false;
            }
            //如果是有杠的牌, 三种情况，二个杠， 前杠后ABC，前ABC后杠
        }
        else {
            if (this.isABCorAAA(startThree) && this.isABCorAAA(afterThree)) {
                // console.log("startThree,afterThree ",startThree,afterThree)
                return true;
            }
            if (this.isABCorAAA(startFour) && this.isABCorAAA(afterFour)) {
                // console.log("startFour,afterFour ", startFour, afterFour)
                return true;
            }
            if (this.isABCorAAA(beforeThree) && this.isABCorAAA(endThree)) {
                // console.log("beforeThree,endThree ", beforeThree, endThree)
                return true;
            }
        }
        return false;
    };
    MajiangAlgo.is3ABC = function (test_arr) {
        var result = getArr(test_arr);
        if (result.length < 9) {
            return false;
        }
        if (result.length < 8) {
            throw new Error("test_arr: " + test_arr + "\u5FC5\u987B\u5927\u4E8E\u6216\u7B49\u4E8E8");
        }
        if (result.length > 13) {
            //有可能是3杠
            throw new Error("test_arr: " + test_arr + "\u5FC5\u987B\u5C0F\u4E8E\u6216\u7B49\u4E8E12");
        }
        //前三
        var startThree = result.slice(0, 3);
        var afterThree = result.slice(3, result.length);
        //前四
        var startFour = result.slice(0, 4);
        var afterFour = result.slice(4, result.length);
        //后三
        var beforeThree = result.slice(0, result.length - 3);
        var lastThree = result.slice(result.length - 3, result.length);
        //后四
        var beforeFour = result.slice(0, result.length - 4);
        var lastFour = result.slice(result.length - 4, result.length);
        if (this.isABCorAAA(startThree) && this.is2ABC(afterThree)) {
            // console.log("startThree, afterThree ", startThree, afterThree);
            return true;
        }
        if (this.isABCorAAA(startFour) && this.is2ABC(afterFour)) {
            // console.log("startFour, afterFour ", startFour, afterFour);
            return true;
        }
        if (this.is2ABC(beforeThree) && this.isABCorAAA(lastThree)) {
            // console.log("beforeThree, lastThree ", beforeThree, lastThree);
            return true;
        }
        if (this.is2ABC(beforeFour) && this.isABCorAAA(lastFour)) {
            // console.log("beforeFour, lastFour ", beforeFour, lastFour);
            return true;
        }
        return false;
    };
    MajiangAlgo.is4ABC = function (test_arr) {
        var result = getArr(test_arr);
        if (result.length < 9) {
            throw new Error("test_arr: " + test_arr + " must large than 9 values");
        }
        var startThree = result.slice(0, 3);
        var afterThree = result.slice(3, result.length);
        //取出后三个和前面的几张牌
        // let beforeThree = result.slice(0, result.length - 3);
        // let lastThree = result.slice(result.length - 3, result.length);
        var startFour = result.slice(0, 4);
        var afterFour = result.slice(4, result.length);
        if (this.isABCorAAA(startThree) && this.is3ABC(afterThree)) {
            return true;
        }
        if (this.isABCorAAA(startFour) && this.is3ABC(afterFour)) {
            return true;
        }
        //前6和后6的算法
        var startSix = result.slice(0, 6);
        var afterSix = result.slice(6, result.length);
        if (this.is2ABC(startSix) && this.is2ABC(afterSix)) {
            return true;
        }
        var beforeSix = result.slice(0, result.length - 6);
        var endSix = result.slice(result.length - 6, result.length);
        if (this.is2ABC(beforeSix) && this.is2ABC(endSix)) {
            return true;
        }
        return false;
    };
    /**只要能胡，就应该是屁胡，包括七对！ */
    MajiangAlgo.HuisPihu = function (group_shoupai, na_pai) {
        var _this = this;
        // return this._HuisPihu(group_shoupai.shouPai, na_pai);
        var jijuhua = MajiangAlgo.getJijuhua(group_shoupai);
        var result = getArr(group_shoupai.shouPai)
            .concat(na_pai)
            .sort();
        if (jijuhua > 4) {
            console.warn("!!!\u4F1A\u6709\u8D85\u8FC74\u53E5\u8BDD\u7684\u724C\uFF1F" + group_shoupai);
            return false;
        }
        //如果是4句话，看最后一句是否是将，如果是，自然就是屁胡了。
        if (jijuhua == 4) {
            return this.isAA(result);
        }
        if (this.HuisQiDui(group_shoupai, na_pai)) {
            return true;
        }
        var allJiang = getAllJiangArr(result);
        var is_hu = false;
        // console.log(allJiang)
        //循环的目的是因为可能胡不止一张牌
        if (allJiang) {
            allJiang.forEach(function (jiang) {
                // console.log(item)
                var newstr = result.join("");
                //去掉这两个将,item是这样的"b1b1","didi"
                newstr = newstr.replace(jiang, "");
                var caller;
                //其实只需要检测3- jijuha, 因为在卡五星里面已经删除掉了带有卡5的一句话！
                switch (jijuhua) {
                    case 3:
                        // 特殊的3句话，因为检测卡五星的时候又删除了一句话，最后只剩下一对将，删除掉newstr就成空了。
                        caller = _this.isABCorAAA;
                        break;
                    case 2:
                        caller = _this.is2ABC;
                        break;
                    case 1:
                        caller = _this.is3ABC;
                        break;
                    case 0:
                        caller = _this.is4ABC;
                        break;
                    default:
                        throw new Error("jijuha:" + jijuhua + "\u7684\u503C\u53EA\u80FD\u662F0-3 ");
                }
                // if(jiang == "b1b1"){
                //   console.log(getArr(newstr));
                // }
                if (caller && caller.call(_this, newstr)) {
                    is_hu = true;
                }
            });
        }
        return is_hu;
        // return this._HuisPihu(this.flat_shou_pai(group_shoupai), na_pai);
    };
    /**统计group手牌中已经碰、杠的几句话 */
    MajiangAlgo.getJijuhua = function (group_shoupai) {
        return (group_shoupai.anGang.length +
            group_shoupai.mingGang.length +
            group_shoupai.selfPeng.length +
            group_shoupai.peng.length);
    };
    /** 仅能用来检测4ABC的情况 */
    MajiangAlgo._HuisPihu = function (shou_pai, na_pai) {
        var _this = this;
        var result = getArr(shou_pai)
            .concat(na_pai)
            .sort();
        if (result.length < 14) {
            // console.warn(`只能用来检测4ABC的情况，${shou_pai}`)
            return false;
        }
        var allJiang = getAllJiangArr(result);
        var is_hu = false;
        var reg_four = /(..)\1\1\1/g;
        var reg_three = /(..)\1\1/g;
        // console.log(allJiang)
        //循环的目的是因为可能胡不止一张牌
        if (this._HuisQiDui(shou_pai, na_pai)) {
            return true;
        }
        if (allJiang) {
            allJiang.forEach(function (item) {
                // console.log(item)
                var newstr = result.join("");
                //去掉这两个将,item是这样的"b1b1","didi"
                newstr = newstr.replace(item, "");
                if (_this.is4ABC(newstr)) {
                    is_hu = true;
                }
            });
        }
        return is_hu;
    };
    MajiangAlgo.HuisQiDui = function (group_shoupai, na_pai) {
        //杠过、碰过都不可能再算是七对，也就是门清
        if (this.getJijuhua(group_shoupai) > 1) {
            return false;
        }
        else {
            return this._HuisQiDui(group_shoupai.shouPai, na_pai);
        }
    };
    MajiangAlgo._HuisQiDui = function (shou_pai, na_pai) {
        //判断是否是七对
        var result = getArr(shou_pai)
            .concat(na_pai)
            .sort();
        if (result.length < 13) {
            return false;
            // throw new Error(`shou_pai${shou_pai} must have 13 values`);
        }
        // console.log(result)
        for (var i = 0; i < result.length; i += 2) {
            if (result[i] == result[i + 1]) {
                continue;
            }
            else {
                return false;
            }
        }
        return true;
    };
    MajiangAlgo.HuisNongQiDui = function (group_shoupai, na_pai) {
        var result = getArr(group_shoupai.shouPai)
            .concat(na_pai)
            .sort();
        if (result.length < 13) {
            return false;
            // throw new Error(`str:${shou_pai} must have 13 values`);
        }
        if (this.HuisQiDui(group_shoupai, na_pai)) {
            var uniq = new Set(result);
            return uniq.size < 7;
        }
        else {
            return false;
        }
    };
    /**是否是清一色屁胡，而七对的清一色需要使用isYise! */
    MajiangAlgo.HuisYise = function (group_shoupai, na_pai) {
        if (MajiangAlgo.isOnlyFlatShouPai(group_shoupai)) {
            return MajiangAlgo._HuisYise(group_shoupai.shouPai, na_pai);
        }
        else {
            var unionArr = this.flat_shou_pai(group_shoupai);
            return this.isYise(unionArr) && this.HuisPihu(group_shoupai, na_pai);
        }
    };
    MajiangAlgo.isYise = function (arr) {
        var paiTypeMap = arr.map(function (item) { return item[0]; });
        var typeSet = new Set(paiTypeMap);
        var isUniq = typeSet.size;
        //不仅要是一色而且还得满足平胡
        return isUniq == 1;
    };
    MajiangAlgo._HuisYise = function (shou_pai, na_pai) {
        var result = getArr(shou_pai)
            .concat(na_pai)
            .sort();
        // if (result.length < 14) {
        //   throw new Error(`shou_pai: ${shou_pai}  must larger than 14 values`);
        // }
        //不仅要是一色而且还得满足屁胡
        return this.isYise(result) && this._HuisPihu(shou_pai, na_pai);
    };
    /**是否是碰碰胡 */
    MajiangAlgo.HuisPengpeng = function (group_shoupai, na_pai) {
        var len = this.flat_shou_pai(group_shoupai).push(na_pai);
        if (len < 14) {
            // throw new Error(`${group_shoupai} 碰碰胡检测少于14张`);
            return false;
        }
        return this._HuisPengpeng(group_shoupai.shouPai, na_pai);
    };
    /**管你几句话，只要是剩下的shouPai去掉重复之后只剩下将，就是碰碰胡了！ */
    MajiangAlgo._HuisPengpeng = function (shou_pai, na_pai) {
        var result = getArr(shou_pai)
            .concat(na_pai)
            .sort();
        //把所有三个或四个相同的干掉，看最后剩下的是否是将
        var reg = /(..)\1\1\1?/g;
        var jiang = result.join("").replace(reg, "");
        if (jiang.length != 4) {
            return false;
        }
        return this.isAA(getArr(jiang));
    };
    /**平手牌，指13张牌 */
    MajiangAlgo.flat_shou_pai = function (group_shou_pai) {
        var real_shoupai = [];
        group_shou_pai.anGang.forEach(function (pai) {
            for (var i = 0; i < 4; i++) {
                real_shoupai.push(pai);
            }
        });
        group_shou_pai.mingGang.forEach(function (pai) {
            for (var i = 0; i < 4; i++) {
                real_shoupai.push(pai);
            }
        });
        group_shou_pai.peng.forEach(function (pai) {
            for (var i = 0; i < 3; i++) {
                real_shoupai.push(pai);
            }
        });
        group_shou_pai.selfPeng.forEach(function (pai) {
            for (var i = 0; i < 3; i++) {
                real_shoupai.push(pai);
            }
        });
        real_shoupai = real_shoupai.concat(group_shou_pai.shouPai);
        return real_shoupai.sort();
    };
    /**
     * group手牌胡哪些牌
     * @param group_shoupai
     * @param is_liang 是否亮牌了
     */
    MajiangAlgo.HuWhatGroupPai = function (group_shoupai, is_liang) {
        var hupai_dict = {};
        var _loop_1 = function () {
            var single_pai = all_single_pai[i];
            var newShouPai = this_1.flat_shou_pai(group_shoupai)
                .concat(single_pai)
                .sort();
            // let isFiveRepeat = /(..)\1\1\1\1\1/g.test(newShouPaiStr);
            var isFiveRepeat = newShouPai.filter(function (pai) { return pai == single_pai; }).length === 5;
            // let isFiveRepeat = _.countBy(newShouPai, pai=>pai == single_pai).true === 5
            if (isFiveRepeat) {
                return "continue";
            }
            else {
                var hupai_typesCode = this_1.HupaiTypeCodeArr(group_shoupai, single_pai, is_liang);
                if (!_.isEmpty(hupai_typesCode)) {
                    hupai_dict[single_pai] = hupai_typesCode;
                }
            }
        };
        var this_1 = this;
        for (var i = 0; i < all_single_pai.length; i++) {
            _loop_1();
        }
        var all_hupai_zhang = _.keys(hupai_dict);
        var flatten_hupai_data = _.flatten(_.values(hupai_dict));
        var all_hupai_typesCode = _.uniq(flatten_hupai_data);
        //如果hupai_data为空，sortBy也会返回空
        //哪怕是个空，也要返回其基本的数据结构，因为可能会有数组的判断在里面
        if (_.isEmpty(all_hupai_zhang)) {
            return {
                all_hupai_zhang: [],
                all_hupai_typesCode: [],
                hupai_dict: {}
            };
        }
        return {
            all_hupai_zhang: all_hupai_zhang.sort(),
            all_hupai_typesCode: all_hupai_typesCode.sort(),
            hupai_dict: hupai_dict
        };
    };
    /**胡什么牌，不仅要知道胡什么牌，还得知道是什么胡！*/
    MajiangAlgo.HuWhatPai = function (shou_pai) {
        var result = getArr(shou_pai);
        var hupai_dict = {};
        var _loop_2 = function () {
            var single_pai = all_single_pai[i];
            var newShouPai = result.concat(single_pai).sort();
            // console.log(newstr)
            var isFiveRepeat = newShouPai.filter(function (pai) { return pai == single_pai; }).length === 5;
            if (isFiveRepeat) {
                return "continue";
                // console.log(newstr.match(/(..)\1\1\1\1/g))
                // throw new Error('irregular Pai, record in database, maybe Hacker.')
                //貌似屁胡已经包括了碰碰胡，还需要整理下，为啥龙七对不能包括在内呢？怪事儿。
            }
            else {
                var hupai_typesCode = this_2.HupaiTypeCodeArr({ anGang: [], mingGang: [], peng: [], selfPeng: [], shouPai: result }, single_pai);
                if (!_.isEmpty(hupai_typesCode)) {
                    hupai_dict[single_pai] = hupai_typesCode;
                }
            }
        };
        var this_2 = this;
        for (var i = 0; i < all_single_pai.length; i++) {
            _loop_2();
        }
        var all_hupai_zhang = _.keys(hupai_dict);
        var flatten_hupai_data = _.flatten(_.values(hupai_dict));
        var all_hupai_typesCode = _.uniq(flatten_hupai_data);
        //如果hupai_data为空，sortBy也会返回空
        //哪怕是个空，也要返回其基本的数据结构，因为可能会有数组的判断在里面
        if (_.isEmpty(all_hupai_zhang)) {
            return {
                all_hupai_zhang: [],
                all_hupai_typesCode: [],
                hupai_dict: {}
            };
        }
        return {
            all_hupai_zhang: all_hupai_zhang.sort(),
            all_hupai_typesCode: all_hupai_typesCode.sort(),
            hupai_dict: hupai_dict
        };
    };
    /**group手牌中只有手牌，anGang, mingGang, peng都为空 */
    MajiangAlgo.isOnlyFlatShouPai = function (group_shoupai) {
        return (group_shoupai.anGang.length == 0 &&
            group_shoupai.mingGang.length == 0 &&
            group_shoupai.selfPeng.length == 0 &&
            group_shoupai.peng.length == 0);
    };
    // static all_hupai_zhang(shou_pai) {
    //   let hupai_data = this.HuWhatPai(shou_pai);
    //   return _.map(hupai_data, item => item.hupai_zhang);
    // }
    // static all_hupai_types(shou_pai) {
    //   let hupai_data = this.HuWhatPai(shou_pai);
    //   let arr1 = [];
    //   hupai_data.forEach(item => {
    //     item.hupai_types.forEach(h_type => {
    //       arr1.push(h_type);
    //     });
    //   });
    //   return _.uniq(arr1);
    // }
    /**是否是卡五星
     * @param na_pai 这张牌是否是4，6中间的牌
     */
    MajiangAlgo.HuisKaWuXing = function (group_shoupai, na_pai) {
        //几句话，b1b1b1, b1b2b3, zh zh zh zh都算是一句话！
        var jijuhua = this.getJijuhua(group_shoupai);
        // console.log(jijuhua);
        return this._HuisKaWuXing(group_shoupai.shouPai, na_pai, jijuhua);
    };
    /**带将的1,2,3,4ABC检测，貌似只是为卡五星服务！ */
    MajiangAlgo._jiangNABC = function (shou_pai, jijuhua) {
        var _this = this;
        var result = getArr(shou_pai);
        var allJiang = getAllJiangArr(result);
        var is_hu = false;
        // console.log(allJiang)
        //循环的目的是因为可能胡不止一张牌
        if (allJiang) {
            allJiang.forEach(function (jiang) {
                // console.log(item)
                var newstr = result.join("");
                //去掉这两个将,item是这样的"b1b1","didi"
                newstr = newstr.replace(jiang, "");
                var caller;
                //其实只需要检测3- jijuha, 因为在卡五星里面已经删除掉了带有卡5的一句话！
                switch (jijuhua) {
                    case 3:
                        // 特殊的3句话，因为检测卡五星的时候又删除了一句话，最后只剩下一对将，删除掉newstr就成空了。
                        if (_.isEmpty(newstr)) {
                            is_hu = true;
                        }
                        break;
                    case 2:
                        caller = _this.isABCorAAA;
                        break;
                    case 1:
                        caller = _this.is2ABC;
                        break;
                    case 0:
                        caller = _this.is3ABC;
                        break;
                    default:
                        throw new Error("jijuha:" + jijuhua + "\u7684\u503C\u53EA\u80FD\u662F0-3 ");
                }
                if (caller && caller.call(_this, newstr)) {
                    is_hu = true;
                }
            });
        }
        return is_hu;
    };
    MajiangAlgo._HuisKaWuXing = function (shou_pai, na_pai, jijuhua) {
        //就卡五星来说，大于3句话就肯定不是卡五了，最多三句话！四句话就没办法胡卡五，只能听将！
        if (jijuhua > 3) {
            return false;
        }
        var result = getArr(shou_pai)
            .concat(na_pai)
            .sort();
        // if (result.length < 14) {
        //   throw new Error(`shou_pai${shou_pai} must larger than 14 values`);
        // }
        //胡牌但是并不是碰胡也不是将牌，就是卡五星,或者胡牌并且两边有4，5，也是卡五星，如果是45556的情况？
        if (na_pai[1] != "5") {
            return false;
        }
        else {
            var four = na_pai[0] + "4";
            var six = na_pai[0] + "6";
            var is_huwu = result.includes(four) && result.includes(six);
            //去掉这三张牌，看剩下的是否符合手牌规则
            if (is_huwu) {
                var after_delete_kawa = result
                    .remove(na_pai)
                    .remove(four)
                    .remove(six)
                    .sort();
                // console.log(after_delete_kawa);
                return this._jiangNABC(after_delete_kawa, jijuhua);
            }
            else {
                return false;
            }
        }
    };
    //只能重复两次，不能重复三次！
    MajiangAlgo.isRepeatTwiceOnly = function (shou_pai_str, str) {
        if (typeof shou_pai_str != "string") {
            throw new Error(chalk_1["default"].red("isRepeatTwiceOnly首参数必须是字符串！"));
        }
        var m = shou_pai_str.match(new RegExp("(" + str + ")+"));
        if (m && m[0]) {
            return m[0].length == 4; //如果不等于4说明并不是重复了2次！
        }
        return false;
    };
    /**是否是小三元
     * 小三元是zh, fa, di中有一对将，其它为刻子，比如zh zh, fa fa fa, di di di。。。就是小三元了
     */
    MajiangAlgo.HuisXiaoShanYuan = function (group_shoupai, na_pai) {
        return this._HuisXiaoShanYuan(this.flat_shou_pai(group_shoupai), na_pai);
    };
    MajiangAlgo._HuisXiaoShanYuan = function (shou_pai, na_pai) {
        var _this = this;
        //
        var result = getArr(shou_pai)
            .concat(na_pai)
            .sort();
        if (result.length < 14) {
            throw new Error("shou_pai: " + shou_pai + " must larger than 14 values");
        }
        // console.log("====================================");
        // console.log(result);
        // console.log(this._HuisPihu(shou_pai, na_pai));
        // console.log("====================================");
        if (this._HuisPihu(shou_pai, na_pai)) {
            //将里面有没有zh, fa, di, 或者可以用表查询来做，毕竟组合就那么几个
            var xiaoSheet = [
                ["zh", "fafafa", "fafafafa", "dididi", "didididi"],
                ["fa", "zhzhzh", "zhzhzhzh", "dididi", "didididi"],
                ["di", "zhzhzh", "zhzhzhzh", "fafafa", "fafafafa"]
            ];
            var shouStr_1 = result.join("");
            // console.log("shouStr: ",shouStr);
            var isXiao_1 = false;
            xiaoSheet.forEach(function (item) {
                //只要判断是否有上面的三种即可！
                var _a = [
                    new RegExp(item[1]),
                    new RegExp(item[2]),
                    new RegExp(item[3]),
                    new RegExp(item[4])
                ], reg13 = _a[0], reg14 = _a[1], reg23 = _a[2], reg24 = _a[3];
                if (_this.isRepeatTwiceOnly(shouStr_1, item[0]) &&
                    (reg13.test(shouStr_1) || reg14.test(shouStr_1)) &&
                    (reg23.test(shouStr_1) || reg24.test(shouStr_1))) {
                    isXiao_1 = true;
                }
            });
            return isXiao_1;
        }
        else {
            //屁胡都不是，自然也不是小三元了
            return false;
        }
    };
    /**只判断三个即可，这也包括了四个的情况！
     * 大三元其实最好判断了，三个一样的zh,fa,di检测即可！
     */
    MajiangAlgo.HuisDaShanYuan = function (group_shoupai, na_pai) {
        return this._HuisDaShanYuan(this.flat_shou_pai(group_shoupai), na_pai);
    };
    MajiangAlgo._HuisDaShanYuan = function (shou_pai, na_pai) {
        //
        var result = getArr(shou_pai)
            .concat(na_pai)
            .sort();
        if (result.length < 14) {
            throw new Error("str" + shou_pai + " must larger than 14 values");
        }
        if (this._HuisPihu(result)) {
            var shouStr = result.join("");
            var isDa = false;
            //只要判断是否有上面的三种即可！
            var _a = [
                new RegExp("zhzhzh"),
                new RegExp("zhzhzhzh"),
                new RegExp("fafafa"),
                new RegExp("fafafafa"),
                new RegExp("dididi"),
                new RegExp("didididi")
            ], zhReg3 = _a[0], zhReg4 = _a[1], faReg3 = _a[2], faReg4 = _a[3], diReg3 = _a[4], diReg4 = _a[5];
            if ((zhReg3.test(shouStr) || zhReg4.test(shouStr)) &&
                (faReg3.test(shouStr) || faReg4.test(shouStr)) &&
                (diReg3.test(shouStr) || diReg4.test(shouStr))) {
                isDa = true;
            }
            return isDa;
        }
        //屁胡都不是，自然也不是大三元了
        return false;
    };
    //杠上开花，自己杠了个牌，然后胡了,要与玩家杠之后联系上。
    MajiangAlgo._HuisGangShangKai = function (shou_pai, na_pai, isSelfGang) {
        //杠了之后才会去检测是否胡，还得检测是哪种胡！
        if (isSelfGang) {
            //还得知道是哪种胡！但肯定不会是七对类型的。返回的其实就应该是整个胡牌的情况，杠上开会在胡牌的基础上多算番
            return this.HupaiTypeCodeArr(shou_pai, na_pai);
        }
        return false;
    };
    //杠上炮，别人打的杠牌，你可以胡, other_pai看是否是别人打的。
    MajiangAlgo.HuisGangShangPao = function (shou_pai, na_pai, isOtherDaGangpai) {
        if (isOtherDaGangpai) {
            return this.HupaiTypeCodeArr(shou_pai, na_pai);
        }
        return false;
    };
    /**明四归 */
    MajiangAlgo.HuisMingSiGui = function (group_shou_pai, na_pai, is_liang) {
        if (this.HuisPihu(group_shou_pai, na_pai)) {
            if (group_shou_pai.peng.includes(na_pai)) {
                return true;
            }
            //如果亮牌，并且存在三张同样的na_pai这也是明四归
            if (is_liang && this.exist3A(group_shou_pai.shouPai, na_pai)) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    MajiangAlgo.exist3A = function (shou_pai, pai_name) {
        return shou_pai.filter(function (pai) { return pai == pai_name; }).length === 3;
    };
    /**暗四归 */
    MajiangAlgo.HuisAnSiGui = function (group_shou_pai, na_pai, is_liang) {
        if (this.HuisPihu(group_shou_pai, na_pai)) {
            if (group_shou_pai.selfPeng.includes(na_pai)) {
                return true;
            }
            //如果手牌里面有三张na_pai, 还要看是否亮牌，亮了就不是暗四归了！
            if (this.exist3A(group_shou_pai.shouPai, na_pai)) {
                if (is_liang) {
                    return false;
                }
                else {
                    return true;
                }
            }
            return false;
        }
        else {
            return false;
        }
    };
    /**胡牌类型码数组，象杠上开花是多算番的胡，并不是基本的胡牌*/
    MajiangAlgo.HupaiTypeCodeArr = function (group_shoupai, na_pai, is_liang) {
        if (is_liang === void 0) { is_liang = false; }
        var _huArr = [];
        if (this.HuisYise(group_shoupai, na_pai)) {
            _huArr.push(config.HuisYise);
        }
        if (this.HuisKaWuXing(group_shoupai, na_pai)) {
            _huArr.push(config.HuisKaWuXing);
        }
        if (this.HuisQiDui(group_shoupai, na_pai)) {
            _huArr.push(config.HuisQidui);
        }
        if (this.HuisNongQiDui(group_shoupai, na_pai)) {
            _huArr.push(config.HuisNongQiDui);
        }
        if (this.HuisPengpeng(group_shoupai, na_pai)) {
            _huArr.push(config.HuisPengpeng);
        }
        if (this.HuisXiaoShanYuan(group_shoupai, na_pai)) {
            _huArr.push(config.HuisXiaoShanYuan);
        }
        if (this.HuisDaShanYuan(group_shoupai, na_pai)) {
            _huArr.push(config.HuisDaShanYuan);
        }
        if (this.HuisMingSiGui(group_shoupai, na_pai, is_liang)) {
            _huArr.push(config.HuisMingSiGui);
        }
        if (this.HuisAnSiGui(group_shoupai, na_pai, is_liang)) {
            _huArr.push(config.HuisAnSiGui);
        }
        if (this.HuisPihu(group_shoupai, na_pai)) {
            _huArr.push(config.HuisPihu);
        }
        return _huArr;
    };
    MajiangAlgo.HuPaiNames = function (group_shoupai, na_pai) {
        var _output = [];
        // console.log(group_shoupai);
        // console.log("this.HupaiTypeCodeArr(group_shoupai, na_pai):",this.HupaiTypeCodeArr(group_shoupai, na_pai));
        this.HupaiTypeCodeArr(group_shoupai, na_pai).forEach(function (item) {
            _output.push(config.HuPaiSheet[item].name);
        });
        return _output;
    };
    /**胡牌文字描述 */
    MajiangAlgo.HuPaiNamesFrom = function (hupaicodeArr) {
        return hupaicodeArr.map(function (code) {
            // return config.HuPaiSheet[item].name;
            return config.HuPaiSheet.find(function (item) { return item.type == code; }).name;
        });
    };
    MajiangAlgo.GangNamesFrom = function (gangCodeArr, is_win) {
        var result = [];
        var name;
        gangCodeArr.forEach(function (code) {
            if (is_win) {
                name = config.GangWinSheet.find(function (item) { return item.type === code; }).name;
                result.push(name);
            }
            else {
                name = config.GangLoseSheet.find(function (item) { return item.type === code; }).name;
                result.push(name);
            }
        });
        return result;
    };
    /**放炮文字描述 */
    MajiangAlgo.LoseNamesFrom = function (loseData) {
        var loseCodesArr = loseData.map(function (item) { return item.type; });
        return loseCodesArr.map(function (code) {
            return config.GangLoseSheet.find(function (item) { return item.type == code; }).name;
        });
    };
    /**通过胡的类型码数组来判断是否是大胡*/
    MajiangAlgo.isDaHu = function (hupaicodeArr) {
        if (!hupaicodeArr) {
            return false;
        }
        if (hupaicodeArr.includes(config.HuisYise) ||
            hupaicodeArr.includes(config.HuisKaWuXing) ||
            hupaicodeArr.includes(config.HuisQidui) ||
            hupaicodeArr.includes(config.HuisNongQiDui) ||
            hupaicodeArr.includes(config.HuisPengpeng) ||
            hupaicodeArr.includes(config.HuisXiaoShanYuan) ||
            hupaicodeArr.includes(config.HuisDaShanYuan) ||
            hupaicodeArr.includes(config.HuisMingSiGui) ||
            hupaicodeArr.includes(config.HuisAnSiGui)) {
            return true;
        }
        return false;
    };
    /**能碰吗？ */
    MajiangAlgo.canPeng = function (shouPai, na_pai, isLiang) {
        //如果玩家已经亮牌，就不再检测手牌里面是否能碰了！
        if (isLiang) {
            return false;
        }
        //貌似会改变以前的数组值，所以得克隆一份来进行检测
        var result = _.clone(getArr(shouPai));
        var newstrArr = result
            .concat(na_pai)
            .sort()
            .join("");
        var paiThreeTimesReg = new RegExp("(" + na_pai + ")\\1\\1");
        return paiThreeTimesReg.test(newstrArr.replace(/\s+/g, ""));
    };
    /**能杠吗？ */
    MajiangAlgo._canGang = function (shouPai, pai_name) {
        var result = shouPai.concat(pai_name);
        var countPai = result.filter(function (pai) { return pai == pai_name; });
        return countPai.length === 4;
    };
    /**
     * group牌能杠吗？
     * @param group_shoupai
     * @param pai_name
     * @param isLiang 是否亮了
     * @param selfMo 是否是自己摸的牌
     */
    MajiangAlgo.canGang = function (group_shoupai, pai_name, isLiang, selfMo) {
        if (selfMo === void 0) { selfMo = false; }
        //如果直接用flat_shou_pai来进行判断，其实还是有问题的，比如玩家碰了b1, 但是手牌里面还有1个是用于另一手牌！
        // 如果考虑吃的情况，可能是需要用下面的办法，如果只是卡五星，貌似只用flat也可以了
        //todo: 先碰再杠也可以，前端还要有所变化，让玩家选择要杠哪个牌！因为可能会有多个！
        //peng, selfPeng其实都可以先拿出来，等牌够了再去杠，不过很多有人会这么做吧。
        var prepare_gang = group_shoupai.peng.some(function (pai) { return group_shoupai.shouPai.includes(pai); }) ||
            group_shoupai.selfPeng.some(function (pai) { return group_shoupai.shouPai.includes(pai); });
        if (group_shoupai.selfPeng.includes(pai_name) || prepare_gang) {
            return true;
        }
        if (isLiang) {
            //如果亮牌了那么碰里面包括自己摸的牌，说明是个擦炮！！
            if (group_shoupai.peng.includes(pai_name) && selfMo) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            //没有亮牌
            //看手牌里面是否有三张牌！如果是自己摸的牌，那么需要先从手牌里面移走再去检测，因为player.mo_pai时已经添加进手牌了
            if (selfMo) {
                return MajiangAlgo._canGang(group_shoupai.shouPai.remove(pai_name), pai_name);
            }
            else {
                return MajiangAlgo._canGang(group_shoupai.shouPai, pai_name);
            }
        }
    };
    return MajiangAlgo;
}());
exports.MajiangAlgo = MajiangAlgo;
