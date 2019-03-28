"use strict";
//麻将判胡算法主程序，纯数字版本
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const config = require("./config");
// 全局常量，所有的牌,饼为1，条为2，万为3，中国、发财、白板为不连续的三张牌
var BING = [0, 1, 2, 3, 4, 5, 6, 7, 8]; //小于10的就是饼
var TIAO = [10, 11, 12, 13, 14, 15, 16, 17, 18]; //大于10并且小于20的是条
//卡五星里面暂时用不上这个万，只有上面的两种可以使用
var WAN = [20, 21, 22, 23, 24, 25, 26, 27, 28];
// 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
var ZHIPAI = [30, 32, 34];
var all_single_pai = BING.concat(TIAO).concat(ZHIPAI);
/**删除找到的第一个元素 */
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
/**获取当前牌的类型，比如饼、条、万、字牌,现在数值不确定，所以要用first, last。 */
function getMJType(mjNumber) {
    if (mjNumber >= _.first(BING) && mjNumber <= _.last(BING)) {
        //饼
        return config.TYPE_BING;
    }
    else if (mjNumber >= _.first(TIAO) && mjNumber <= _.last(TIAO)) {
        //条
        return config.TYPE_TIAO;
    }
    else if (mjNumber >= _.first(ZHIPAI) && mjNumber <= _.last(ZHIPAI)) {
        //万
        return config.TYPE_ZHIPAI;
    }
}
/**麻将胡牌算法 */
class NMajiangAlgo {
    /*
  可以把b1b1b1或者说b1 b1 b1转换成双字符规则数组["b1","b1","b1"]
  */
    static isAA(test_arr) {
        // if (test_arr.length != 2) {
        //   throw new Error(`test_arr:  ${test_arr} must have 2 values`);
        // }
        if (_.isEmpty(test_arr)) {
            return false;
        }
        return test_arr[0] == test_arr[1];
    }
    static _isAAA(test_arr) {
        if (test_arr.length != 3) {
            throw new Error(`test_arr: ${test_arr} 必须等于3`);
        }
        let s1 = test_arr[0], s2 = test_arr[1], s3 = test_arr[2];
        return s1 == s2 && s2 == s3;
    }
    static _is4A(test_arr) {
        if (test_arr.length != 4) {
            throw new Error(`test_arr: ${test_arr}必须等于4`);
        }
        let s1 = test_arr[0], s2 = test_arr[1], s3 = test_arr[2], s4 = test_arr[3];
        return s1 == s2 && s2 == s3 && s3 == s4;
    }
    static isABC(test_arr) {
        if (test_arr.length < 3) {
            // throw new Error(`test_arr: ${test_arr} 必须大于等于3`);
            return false;
        }
        let s1 = test_arr[0], s2 = test_arr[1], s3 = test_arr[2];
        //判断首字母是否相同(判断相同花色)以及 是否是1，2，3这样的顺序
        let isABC = s2 - 1 == s1 && s2 + 1 == s3;
        return isABC;
    }
    static isABCorAAA(test_arr) {
        if (test_arr.length == 3) {
            return this._isAAA(test_arr) || this.isABC(test_arr);
        }
        else {
            return false;
        }
    }
    /**是否是2句话，最复杂！ */
    static is2ABC(test_arr) {
        //like 123456 or 122334,233445这样的牌型
        if (test_arr.length < 6) {
            return false;
        }
        if (test_arr.length < 4) {
            //为啥不是6呢？因为在3ABC里面有可能会出现fa fa fa t1 t2 t3 t4 t5 t6这样的情况
            //后面的4个被切掉，前面就不够6个了，自然不是3ABC
            //为啥不是5呢？在小三元的检测里面也会有少于6个的情况。手牌为b1 b1 b1 b2 b3 di di di fa fa zh zh zh
            throw new Error(`test_arr: ${test_arr} 必须大于等于4`);
        }
        let s1 = test_arr[0], s2 = test_arr[1], s3 = test_arr[2], s4 = test_arr[3], s5 = test_arr[4], s6 = test_arr[5];
        let startThree = test_arr.slice(0, 3);
        let afterThree = test_arr.slice(3, test_arr.length);
        //前三和后面的几个，比如b1 b2 b3 zh zh zh zh
        let beforeThree = test_arr.slice(0, test_arr.length - 3);
        let endThree = test_arr.slice(test_arr.length - 3, test_arr.length);
        //前四和后面的几个，比如b1 b1 b1 b1 t1 t2 t3
        let startFour = test_arr.slice(0, 4);
        let afterFour = test_arr.slice(4, test_arr.length);
        //特殊情况，比如112233的情况？
        if (test_arr.length == 6) {
            //如果是正规的6张牌
            if (s1 == s2 && s3 == s4 && s5 == s6) {
                return this.isABC([s1, s3, s5]);
            }
            if (this.isABCorAAA(startThree) && this.isABCorAAA(afterThree)) {
                return true;
            }
            else {
                //交换2,3 比如将122334中间的两个交换过来，再检查
                let first3 = [s1, s2, s4];
                let after3 = [s3, s5, s6];
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
    }
    static is3ABC(test_arr) {
        if (test_arr.length < 9) {
            return false;
        }
        if (test_arr.length < 8) {
            throw new Error(`test_arr: ${test_arr}必须大于或等于8`);
        }
        if (test_arr.length > 13) {
            //有可能是3杠
            throw new Error(`test_arr: ${test_arr}必须小于或等于12`);
        }
        //前三
        let startThree = test_arr.slice(0, 3);
        let afterThree = test_arr.slice(3, test_arr.length);
        //前四
        let startFour = test_arr.slice(0, 4);
        let afterFour = test_arr.slice(4, test_arr.length);
        //后三
        let beforeThree = test_arr.slice(0, test_arr.length - 3);
        let lastThree = test_arr.slice(test_arr.length - 3, test_arr.length);
        //后四
        let beforeFour = test_arr.slice(0, test_arr.length - 4);
        let lastFour = test_arr.slice(test_arr.length - 4, test_arr.length);
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
    }
    static is4ABC(test_arr) {
        if (test_arr.length < 9) {
            throw new Error(`test_arr: ${test_arr} must large than 9 values`);
        }
        let startThree = test_arr.slice(0, 3);
        let afterThree = test_arr.slice(3, test_arr.length);
        //取出后三个和前面的几张牌
        // let beforeThree = result.slice(0, result.length - 3);
        // let lastThree = result.slice(result.length - 3, result.length);
        let startFour = test_arr.slice(0, 4);
        let afterFour = test_arr.slice(4, test_arr.length);
        if (this.isABCorAAA(startThree) && this.is3ABC(afterThree)) {
            return true;
        }
        if (this.isABCorAAA(startFour) && this.is3ABC(afterFour)) {
            return true;
        }
        //前6和后6的算法
        let startSix = test_arr.slice(0, 6);
        let afterSix = test_arr.slice(6, test_arr.length);
        if (this.is2ABC(startSix) && this.is2ABC(afterSix)) {
            return true;
        }
        let beforeSix = test_arr.slice(0, test_arr.length - 6);
        let endSix = test_arr.slice(test_arr.length - 6, test_arr.length);
        if (this.is2ABC(beforeSix) && this.is2ABC(endSix)) {
            return true;
        }
        return false;
    }
    /**获取到所有的将牌 */
    static getAllJiangArr(test_arr) {
        if (_.isEmpty(test_arr)) {
            return [];
        }
        let allArr = [];
        for (let index = 0; index < test_arr.length; index += 2) {
            const jiang = test_arr[index];
            if (jiang == test_arr[index + 1]) {
                allArr.push(jiang);
            }
        }
        return allArr;
    }
    /**寻找ABC，223344，这样的也可以找到 */
    static isAndDelABC(test_arr) {
        if (_.isEmpty(test_arr)) {
            throw new Error("test_arr为空");
        }
        let remainArr = test_arr.slice(1, test_arr.length);
        //如果找到第一个元素，删除之，再继续找，比如开头是个2，会找到3
        let pos = remainArr.indexOf(test_arr[0] + 1);
        if (pos > -1) {
            remainArr.splice(pos, 1);
            pos = remainArr.indexOf(test_arr[0] + 2); //会找到4
            if (pos > -1) { //找到4就删除
                remainArr.splice(pos, 1);
                // console.log("remainArr", remainArr);
                return { remainArr: remainArr };
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    /**判断是否是AAA，查找法哪怕你没有排序也可以找到3A */
    static isAndDelAAA(test_arr) {
        if (_.isEmpty(test_arr)) {
            throw new Error("test_arr为空");
        }
        if (test_arr.length < 3) {
            return false;
        }
        let result = test_arr[0] == test_arr[1]
            && test_arr[1] == test_arr[2];
        if (result) {
            return { remainArr: test_arr.slice(3, test_arr.length) };
        }
        else {
            return false;
        }
    }
    static isAndDel4A(test_arr) {
        if (_.isEmpty(test_arr)) {
            throw new Error("test_arr为空");
        }
        if (test_arr.length < 4) {
            return false;
        }
        let result = test_arr[0] == test_arr[1]
            && test_arr[1] == test_arr[2]
            && test_arr[2] == test_arr[3];
        if (result) {
            return { remainArr: test_arr.slice(4, test_arr.length) };
        }
        else {
            return false;
        }
    }
    /**是否是几句话，总共只有4句话，外带将！ */
    static isJiJuhua(shouPai) {
        //检测到最后是个空数组，说明都是几句话！
        if (_.isEmpty(shouPai)) {
            return true;
        }
        shouPai = shouPai.sort(); //每次都要排序！防止不连续的情况
        let threeTest = [];
        //判断开头是否是三个连续
        let result = this.isAndDelAAA(shouPai);
        if (!!result) {
            // 检测剩下的的是否是几句话
            threeTest.push(this.isJiJuhua(result.remainArr));
        }
        //判断开头是否是4个连续
        result = this.isAndDel4A(shouPai);
        if (!!result) {
            console.log(result.remainArr);
            threeTest.push(this.isJiJuhua(result.remainArr));
        }
        //判断开头是否是ABC
        result = this.isAndDelABC(shouPai);
        if (!!result) {
            threeTest.push(this.isJiJuhua(result.remainArr));
        }
        else {
            return false;
        }
        return !!threeTest.indexOf(true);
    }
}
exports.NMajiangAlgo = NMajiangAlgo;
//# sourceMappingURL=NMajiangAlgo.js.map