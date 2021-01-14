"use strict";
exports.__esModule = true;
exports.PaiConvertor = void 0;
var _ = require("lodash");
var BING = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"];
var TIAO = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"];
// 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
var ZHIPAI = ["zh", "fa", "di"];
//数字麻将表，加速版本
var N_BING = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var N_TIAO = [11, 12, 13, 14, 15, 16, 17, 18, 19];
// var N_WAN = [21, 22, 23, 24, 25, 26, 27, 28, 29];
var N_ZHIPAI = [31, 33, 35];
var PaiConvertor = /** @class */ (function () {
    function PaiConvertor() {
    }
    PaiConvertor.getStrArr = function (strs) {
        if (!strs || strs.length == 0) {
            // throw new Error("str is empty");
            return [];
            //如果是数组，那么就直接返回，可能就是一套手牌，比如["b1","b2"...]
        }
        else if (strs instanceof Array) {
            return strs;
        }
        else {
            var result = strs.replace(/\s+/g, ""); //首先去掉空格
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
    };
    //转换b1到11， t1到22，
    PaiConvertor.ToNumber = function (str) {
        var index = BING.indexOf(str);
        if (index > -1) {
            return N_BING[index];
        }
        index = TIAO.indexOf(str);
        if (index > -1) {
            return N_TIAO[index];
        }
        index = ZHIPAI.indexOf(str);
        if (index > -1) {
            return N_ZHIPAI[index];
        }
        if (index == -1) {
            throw new Error("\u9519\u8BEF\u7684\u53C2\u6570\uFF1A" + str + "\uFF0C\u662F\u5426\u5DF2\u7ECF\u8F6C\u6362\u8FC7\u4E86\uFF1F");
        }
    };
    PaiConvertor.ToNumberArr = function (strs) {
        var _this = this;
        var strArr = this.getStrArr(strs);
        if (_.isEmpty(strArr)) {
            return [];
        }
        return strArr.map(function (item) {
            return _this.ToNumber(item);
        });
    };
    PaiConvertor.pais = function (strs) {
        return this.ToNumberArr(strs);
    };
    PaiConvertor.ToShou = function (str) {
        return "shou_" + this.ToNumber(str) + ".png";
    };
    PaiConvertor.ToZheng = function (str) {
        return "zheng_" + this.ToNumber(str) + ".png";
    };
    PaiConvertor.ToCe = function (str) {
        return "ce_" + this.ToNumber(str) + ".png";
    };
    /**
     * 转换类似于zh,fa的字符串到shou_31.png, shou_32.png的字符串
     * @param all_pais 所有服务器发过来的牌
     */
    PaiConvertor.ToShouArray = function (all_pais) {
        var _this = this;
        return all_pais.map(function (item) {
            return _this.ToShou(item);
        });
    };
    PaiConvertor.ToZhengArray = function (all_pais) {
        var _this = this;
        return all_pais.map(function (item) {
            return _this.ToZheng(item);
        });
    };
    PaiConvertor.ToCeArray = function (all_pais) {
        var _this = this;
        return all_pais.map(function (item) {
            return _this.ToCe(item);
        });
    };
    return PaiConvertor;
}());
exports.PaiConvertor = PaiConvertor;
