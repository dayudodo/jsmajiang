"use strict";
//麻将判胡算法主程序，纯数字版本
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const config = require("./config");
// 全局常量，所有的牌,饼为1，条为2，万为3，中国、发财、白板为不连续的三张牌
var BING = [0, 1, 2, 3, 4, 5, 6, 7, 8]; //小于10的就是饼
var TIAO = [10, 11, 12, 13, 14, 15, 16, 17, 18]; //大于10并且小于20的是条
//卡五星里面暂时用不上这个万，只有上面的两种可以使用
// var WAN: Array<Pai> = [20, 21, 22, 23, 24, 25, 26, 27, 28];
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
        //字牌
        return config.TYPE_ZHIPAI;
    }
}
/**麻将胡牌算法 */
class NMajiangAlgo {
    /**获取到所有的将牌 */
    static getAllJiangArr(test_arr) {
        if (_.isEmpty(test_arr)) {
            return [];
        }
        let allArr = new Set(); //有可能检测到相同的，所以使用set保证唯一
        for (let index = 0; index < test_arr.length; index++) {
            const jiang = test_arr[index];
            if (jiang == test_arr[index + 1]) {
                allArr.add(jiang);
            }
        }
        return Array.from(allArr);
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
    static isJiJuhua(shouPai, first = true) {
        //检测到最后是个空数组，说明都是几句话！
        if (_.isEmpty(shouPai)) {
            return first ? false : true;
        }
        shouPai = _.orderBy(shouPai); //每次都要排序！防止不连续的情况
        // let threeTest = []
        let result;
        //判断开头是否是ABC
        result = this.isAndDelABC(shouPai);
        if (!!result) {
            // console.log(result.remainArr);
            //如果结果是true,返回，否则还要进行下面的检测, 并告诉剩下的数组并非是初次检测
            if (this.isJiJuhua(result.remainArr, false)) {
                return true;
            }
        }
        //判断开头是否是4个连续，首先检测这个，从大的开始检测
        result = this.isAndDel4A(shouPai);
        if (!!result) {
            // console.log(result.remainArr);
            if (this.isJiJuhua(result.remainArr, false)) {
                return true;
            }
        }
        result = this.isAndDelAAA(shouPai);
        //判断开头是否是三个连续
        if (!!result) {
            // 检测剩下的的是否是几句话
            return this.isJiJuhua(result.remainArr, false);
        }
        else {
            return false;
        }
    }
    /**统计有几句话，最多只有4句话，将除外！ */
    static countJiJuhua(shouPai, first = true) {
        //检测到最后是个空数组，说明都是几句话！但，头回不能是个空！
        if (_.isEmpty(shouPai)) {
            return first ? -1 : 0;
        }
        shouPai = shouPai.sort(); //每次都要排序！防止不连续的情况
        // let threeTest = []
        let countJuHua = 0;
        let result;
        //判断开头是否是ABC
        result = this.isAndDelABC(shouPai);
        if (!!result) {
            ++countJuHua;
            //如果结果是true,返回，否则还要进行下面的检测
            let ret = this.countJiJuhua(result.remainArr, false);
            countJuHua += ret;
        }
        //判断开头是否是4个连续，首先检测这个，从大的开始检测
        result = this.isAndDel4A(shouPai);
        if (!!result) {
            ++countJuHua;
            // console.log(result.remainArr);
            countJuHua += this.countJiJuhua(result.remainArr, false);
        }
        result = this.isAndDelAAA(shouPai);
        //判断开头是否是三个连续
        if (!!result) {
            // 检测剩下的的是否是几句话
            ++countJuHua;
            countJuHua += this.countJiJuhua(result.remainArr, false);
        }
        return countJuHua;
    }
    /**数字版本屁胡，todo:包括七对！ */
    static HuIsPihu(shouPai, na_pai) {
        let cloneShouPai = _.orderBy(_.clone(shouPai.concat(na_pai)));
        if (cloneShouPai.length < 14) { //不够14张，自然有问题，不可能胡！最少的也是3*4+2
            return false;
        }
        let allJiang = this.getAllJiangArr(cloneShouPai);
        // console.log(cloneShouPai, allJiang);
        let isHu = false;
        if (allJiang) {
            allJiang.some(jiang => {
                //删除牌里面的将牌，因为是排序好了的，所以一次删除两个即可！
                let newClone = _.clone(cloneShouPai);
                let index = newClone.indexOf(jiang);
                newClone.splice(index, 2);
                isHu = this.isJiJuhua(newClone);
                if (isHu) {
                    // console.log('hu:', jiang);
                    return true;
                }
            });
        }
        return isHu;
    }
    /**统计group手牌中已经碰、杠的几句话 */
    static getJijuhua(group_shoupai) {
        return (group_shoupai.anGang.length +
            group_shoupai.mingGang.length +
            group_shoupai.selfPeng.length +
            group_shoupai.peng.length);
    }
    /**判断七对 */
    static HuisQiDui(group_shoupai, na_pai) {
        //杠过、碰过都不可能再算是七对，也就是门清
        if (this.getJijuhua(group_shoupai) > 1) {
            return false;
        }
        else {
            return this._HuisQiDui(group_shoupai.shouPai, na_pai);
        }
    }
    static _HuisQiDui(shouPai, na_pai) {
        let cloneShouPai;
        if (na_pai) {
            cloneShouPai = _.orderBy(_.clone(shouPai.concat(na_pai)));
        }
        else {
            cloneShouPai = _.orderBy(shouPai);
        }
        // console.log(cloneShouPai);
        if (cloneShouPai.length < 14) {
            return false;
        }
        let count = 0;
        for (let i = 0; i < cloneShouPai.length; i += 2) {
            if (cloneShouPai[i] == cloneShouPai[i + 1]) {
                count++;
            }
        }
        return count == 7;
    }
    static exits4A(shouPai) {
        for (let i = 0; i < shouPai.length; i++) {
            const pai = shouPai[i];
            if (pai == shouPai[i + 1]
                && shouPai[i + 1] == shouPai[i + 2]
                && shouPai[i + 2] == shouPai[i + 3]) {
                return true;
            }
        }
        return false;
    }
    /**是否是龙七对，也就是里面有个4A */
    static HuisNongQiDui(group_shoupai, na_pai) {
        let cloneShouPai = _.orderBy(_.clone(group_shoupai.shouPai.concat(na_pai)));
        if (this._HuisQiDui(group_shoupai.shouPai, na_pai)) {
            return this.exits4A(cloneShouPai);
        }
    }
    // /**是否是清一色屁胡，而七对的清一色需要使用isYise! */
    // static HuisYise(group_shoupai: GroupConstructor, na_pai: Pai): boolean {
    //     let onlyShouPai = this.flat_shou_pai(group_shoupai).concat(na_pai);
    //     // console.log("this.isYise(onlyShouPai):",this.isYise(onlyShouPai));
    //     // console.log("this.HuIsPihu(onlyShouPai)",this.HuIsPihu(onlyShouPai));
    //     return this.isYise(onlyShouPai)
    // }
    /**判断是否是同一花色 */
    static isYise(test_arr) {
        let cloneArr = _.clone(test_arr);
        let firstType = getMJType(cloneArr[0]);
        // console.log("cloneArr, firstType", cloneArr, firstType);
        // console.log("alltypes", cloneArr.map(item=>getMJType(item)));
        for (let i = 1; i < cloneArr.length; i++) {
            const thisType = getMJType(cloneArr[i]);
            if (thisType == firstType) {
                continue;
            }
            else {
                return false;
            }
        }
        return true;
    }
    // private static _HuisYise(shou_pai: Array<Pai>, na_pai) {
    //   let result = getArr(shou_pai)
    //     .concat(na_pai)
    //     .sort();
    //   // if (result.length < 14) {
    //   //   throw new Error(`shou_pai: ${shou_pai}  must larger than 14 values`);
    //   // }
    //   //不仅要是一色而且还得满足屁胡
    //   return this.isYise(result) && this._HuisPihu(shou_pai, na_pai);
    // }
    // /**是否是碰碰胡 */
    // static HuisPengpeng(group_shoupai: GroupConstructor, na_pai: Pai): boolean {
    //   let len = this.flat_shou_pai(group_shoupai).push(na_pai);
    //   if (len < 14) {
    //     // throw new Error(`${group_shoupai} 碰碰胡检测少于14张`);
    //     return false;
    //   }
    //   return this._HuisPengpeng(group_shoupai.shouPai, na_pai);
    // }
    // /**管你几句话，只要是剩下的shouPai去掉重复之后只剩下将，就是碰碰胡了！ */
    // private static _HuisPengpeng(shou_pai: Array<Pai>, na_pai) {
    //   let result = getArr(shou_pai)
    //     .concat(na_pai)
    //     .sort();
    //   //把所有三个或四个相同的干掉，看最后剩下的是否是将
    //   let reg = /(..)\1\1\1?/g;
    //   let jiang = result.join("").replace(reg, "");
    //   if (jiang.length != 4) {
    //     return false;
    //   }
    //   return this.isAA(getArr(jiang));
    // }
    /**平手牌，指13张牌，将其它的碰、杠都转换成一维手牌数组！ */
    static flat_shou_pai(group_shou_pai) {
        let onlyShouPai = [];
        group_shou_pai.anGang.forEach(pai => {
            for (let i = 0; i < 4; i++) {
                onlyShouPai.push(pai);
            }
        });
        group_shou_pai.mingGang.forEach(pai => {
            for (let i = 0; i < 4; i++) {
                onlyShouPai.push(pai);
            }
        });
        group_shou_pai.peng.forEach(pai => {
            for (let i = 0; i < 3; i++) {
                onlyShouPai.push(pai);
            }
        });
        group_shou_pai.selfPeng.forEach(pai => {
            for (let i = 0; i < 3; i++) {
                onlyShouPai.push(pai);
            }
        });
        onlyShouPai = onlyShouPai.concat(group_shou_pai.shouPai);
        return onlyShouPai.sort();
    }
    // /**
    //  * group手牌胡哪些牌
    //  * @param group_shoupai
    //  * @param is_liang 是否亮牌了
    //  */
    // static HuWhatGroupPai(group_shoupai: GroupConstructor, is_liang): hupaiConstructor {
    //   let hupai_dict = {};
    //   for (var i = 0; i < all_single_pai.length; i++) {
    //     let single_pai = all_single_pai[i];
    //     let newShouPai: Array<Pai> = this.flat_shou_pai(group_shoupai)
    //       .concat(single_pai)
    //       .sort();
    //     // let isFiveRepeat = /(..)\1\1\1\1\1/g.test(newShouPaiStr);
    //     let isFiveRepeat = newShouPai.filter(pai => pai == single_pai).length === 5;
    //     // let isFiveRepeat = _.countBy(newShouPai, pai=>pai == single_pai).true === 5
    //     if (isFiveRepeat) {
    //       continue;
    //     } else {
    //       let hupai_typesCode = this.HupaiTypeCodeArr(group_shoupai, single_pai, is_liang);
    //       if (!_.isEmpty(hupai_typesCode)) {
    //         hupai_dict[single_pai] = hupai_typesCode;
    //       }
    //     }
    //   }
    //   let all_hupai_zhang = _.keys(hupai_dict);
    //   let flatten_hupai_data: Array<number> = _.flatten(_.values(hupai_dict));
    //   let all_hupai_typesCode: Array<number> = _.uniq(flatten_hupai_data);
    //   //如果hupai_data为空，sortBy也会返回空
    //   //哪怕是个空，也要返回其基本的数据结构，因为可能会有数组的判断在里面
    //   if (_.isEmpty(all_hupai_zhang)) {
    //     return {
    //       all_hupai_zhang: [],
    //       all_hupai_typesCode: [],
    //       hupai_dict: {}
    //     };
    //   }
    //   return {
    //     all_hupai_zhang: all_hupai_zhang.sort(),
    //     all_hupai_typesCode: all_hupai_typesCode.sort(),
    //     hupai_dict: hupai_dict
    //   };
    // }
    // /**胡什么牌，不仅要知道胡什么牌，还得知道是什么胡！*/
    // static HuWhatPai(shou_pai: Array<Pai>): hupaiConstructor {
    //   let result: Array<Pai> = getArr(shou_pai);
    //   let hupai_dict = {};
    //   for (var i = 0; i < all_single_pai.length; i++) {
    //     let single_pai = all_single_pai[i];
    //     let newShouPai: Array<Pai> = result.concat(single_pai).sort();
    //     // console.log(newstr)
    //     let isFiveRepeat = newShouPai.filter(pai => pai == single_pai).length === 5;
    //     if (isFiveRepeat) {
    //       continue;
    //       // console.log(newstr.match(/(..)\1\1\1\1/g))
    //       // throw new Error('irregular Pai, record in database, maybe Hacker.')
    //       //貌似屁胡已经包括了碰碰胡，还需要整理下，为啥龙七对不能包括在内呢？怪事儿。
    //     } else {
    //       let hupai_typesCode = this.HupaiTypeCodeArr(
    //         { anGang: [], mingGang: [], peng: [], selfPeng: [], shouPai: result },
    //         single_pai
    //       );
    //       if (!_.isEmpty(hupai_typesCode)) {
    //         hupai_dict[single_pai] = hupai_typesCode;
    //       }
    //     }
    //   }
    //   let all_hupai_zhang = _.keys(hupai_dict);
    //   let flatten_hupai_data: Array<number> = _.flatten(_.values(hupai_dict));
    //   let all_hupai_typesCode: Array<number> = _.uniq(flatten_hupai_data);
    //   //如果hupai_data为空，sortBy也会返回空
    //   //哪怕是个空，也要返回其基本的数据结构，因为可能会有数组的判断在里面
    //   if (_.isEmpty(all_hupai_zhang)) {
    //     return {
    //       all_hupai_zhang: [],
    //       all_hupai_typesCode: [],
    //       hupai_dict: {}
    //     };
    //   }
    //   return {
    //     all_hupai_zhang: all_hupai_zhang.sort(),
    //     all_hupai_typesCode: all_hupai_typesCode.sort(),
    //     hupai_dict: hupai_dict
    //   };
    // }
    /**group手牌中只有手牌，anGang, mingGang, peng都为空 */
    static isOnlyShouPai(group_shoupai) {
        return (group_shoupai.anGang.length == 0 &&
            group_shoupai.mingGang.length == 0 &&
            group_shoupai.selfPeng.length == 0 &&
            group_shoupai.peng.length == 0);
    }
}
exports.NMajiangAlgo = NMajiangAlgo;
//# sourceMappingURL=NMajiangAlgo.js.map