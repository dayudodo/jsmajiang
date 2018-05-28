var mj;
(function (mj) {
    var utils;
    (function (utils) {
        var BING = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"];
        var TIAO = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"];
        // 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
        var ZHIPAI = ["zh", "fa", "di"];
        //数字麻将表，加速版本
        var N_BING = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        var N_TIAO = [9, 10, 11, 12, 13, 14, 15, 16, 17];
        var N_ZHIPAI = [31, 32, 33];
        var PaiConverter = /** @class */ (function () {
            function PaiConverter() {
            }
            //转换b1到11， t1到22，
            PaiConverter.ToNumber = function (str) {
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
                    throw new Error("\u9519\u8BEF\u7684\u53C2\u6570" + str);
                }
            };
            PaiConverter.ToShou = function (str) {
                return "shou_" + this.ToNumber(str) + ".png";
            };
            /**
             * 返回类似于ui/majiang/shou_??.png的字符串，用于替换麻将牌的显示
             * @param str
             */
            PaiConverter.skinOfShou = function (str) {
                return "ui/majiang/" + this.ToShou(str);
            };
            PaiConverter.skinOfShouBack = function () {
                return "ui/majiang/zheng_an.png";
            };
            /** 打出牌的样子，以zheng开头的图形 */
            PaiConverter.skinOfZheng = function (str) {
                return "ui/majiang/" + this.ToZheng(str);
            };
            /** 别家打出牌的样子，以ce开头的图形 */
            PaiConverter.skinOfCe = function (str) {
                return "ui/majiang/" + this.ToCe(str);
            };
            PaiConverter.ToZheng = function (str) {
                return "zheng_" + this.ToNumber(str) + ".png";
            };
            /**
             * 转化成左右风格的牌面（牌是横着的），以ce开头的图片
             * @param str
             */
            PaiConverter.ToCe = function (str) {
                return "ce_" + this.ToNumber(str) + ".png";
            };
            /** 转换类似于zh,fa的字符串到shou_31.png, shou_32.png的字符串 */
            PaiConverter.ToShouArray = function (all_pais) {
                var _this = this;
                return all_pais.map(function (item) {
                    return _this.ToShou(item);
                });
            };
            PaiConverter.ToZhengArray = function (all_pais) {
                var _this = this;
                return all_pais.map(function (item) {
                    return _this.ToZheng(item);
                });
            };
            /** 转换成以ce开头的横牌url数组，比如fa,zh变成ce_31.png, ce_32.png */
            PaiConverter.ToCeArray = function (all_pais) {
                var _this = this;
                return all_pais.map(function (item) {
                    return _this.ToCe(item);
                });
            };
            /** 根据countNum计算出其图片skin */
            PaiConverter.CountDownNumSkin = function (countNum) {
                if (countNum > 99) {
                    console.warn('最多只能显示2位数字！');
                }
                var num1, num0;
                if (countNum > 9) {
                    num1 = new String(countNum)[0];
                    num0 = new String(countNum)[1];
                }
                else {
                    num1 = "0";
                    num0 = new String(countNum)[0];
                }
                return ["ui/game/" + num1 + ".png", "ui/game/" + num0 + ".png"];
            };
            return PaiConverter;
        }());
        utils.PaiConverter = PaiConverter;
    })(utils = mj.utils || (mj.utils = {}));
})(mj || (mj = {}));
//# sourceMappingURL=PaiConverter.js.map