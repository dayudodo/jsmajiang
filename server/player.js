"use strict";
exports.__esModule = true;
exports.Player = void 0;
var _ = require("lodash");
var NMajiangAlgo_1 = require("./NMajiangAlgo");
//每一个玩家的数据保存在此类中
var config = require("./config");
var chalk_1 = require("chalk");
var Player = /** @class */ (function () {
    //新建，用户就会有一个socket_id，一个socket其实就是一个连接了
    function Player(_a) {
        var group_shou_pai = _a.group_shou_pai, socket = _a.socket, username = _a.username, user_id = _a.user_id;
        /**用户是否连接？有可能掉线！*/
        this.connect = false;
        /**IP地址 */
        this.ip = null;
        /**用户是否已经准备好，全部准备好后就可以开始了*/
        this.ready = false;
        /**是否是房主 */
        this.master = false;
        /**用户是否是东家*/
        this.east = false;
        /** 玩家在房间的座位号，也是加入房间的顺序号 */
        this.seat_index = null; //玩家的座位号，关系到发牌的顺序，以及碰之后顺序的改变需要使用
        /**判断玩家能亮的时候，给出玩家能够选择的隐藏牌 */
        this.canHidePais = [];
        /**能够扛的牌 */
        this.canGangPais = [];
        /**玩家摸的牌，其实也就是服务器发的牌，保存到自己的group手牌中
         * 一旦打出，才会清空
         */
        this._mo_pai = null;
        /**玩家打牌形成的数组 */
        this.arr_dapai = []; //打过的牌有哪些，断线后可以重新发送此数据
        /**玩家可以选择的操作数组 */
        this.arr_selectShow = [];
        /** 玩家是否亮牌，只在可以听胡的时候才能亮牌, 注意，胡里面也包括有亮的信息*/
        this.is_liang = false;
        /**是否是自摸，其实不能算是一种胡牌，而是一种状态，杠上胡也可以算！加番的一种方式。 */
        this.is_zimo = false;
        /**是否放炮 */
        this.is_fangpao = false;
        /**全部的牌是否变动过 */
        this.is_grouppai_changed = true;
        /**玩家放杠、放炮的记录，但于结算！user_id牌放给谁了，如果杠的玩家是自己，那么就得其它两家出钱了 */
        //数据类似于：
        // {type: config.FangGang, pai:''},
        // {type: config.FangGangShangGang, pai:''},
        // {type: config.FangPihuPao, pai:''},
        // {type: config.FangDaHuPao, pai:''}
        this.innerGang_lose_data = [];
        /**玩家的积分 */
        this.score = 0;
        /**一局得分 */
        this.oneju_score = 0;
        /**玩家财富 */
        this.treasure = {};
        /**暗杠数量 */
        this.count_anGang = 0;
        /**明杠数量 */
        this.count_mingGang = 0;
        /**自摸数量 */
        this.count_zimo = 0;
        /**放炮数量，8局为一次？需要合在一起进行计算，但是每一次的计算放哪儿呢？ */
        this.count_fangPao = 0;
        /**最后胡的是哪张牌 */
        this.hupai_zhang = null;
        this._allGangPais = [];
        // private _allHidePais: Array<Pai> = []
        // /**获取到所有能隐藏的牌，放入selfPeng中 */
        // get allHidePais() {
        //   return this._allHidePais
        // }
        this._other_dapai = {};
        /**摸扛之后是否打牌 */
        this.after_mo_gang_dapai = false;
        /**客户端能打牌的控制变量 */
        this.can_dapai = false;
        /**临时的赢代码，比如杠 */
        this.gang_win_codes = [];
        this.group_shou_pai = group_shou_pai;
        this.socket = socket;
        this.username = username;
        this.user_id = user_id;
    }
    Object.defineProperty(Player.prototype, "isShowHu", {
        get: function () {
            return this.arr_selectShow[0];
        },
        set: function (value) {
            this.arr_selectShow[0] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "isShowLiang", {
        get: function () {
            return this.arr_selectShow[1];
        },
        set: function (value) {
            this.arr_selectShow[1] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "isShowGang", {
        get: function () {
            return this.arr_selectShow[2];
        },
        set: function (value) {
            this.arr_selectShow[2] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "isShowPeng", {
        get: function () {
            return this.arr_selectShow[3];
        },
        set: function (value) {
            this.arr_selectShow[3] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "mo_pai", {
        get: function () {
            return this._mo_pai;
        },
        set: function (pai) {
            if (this._mo_pai) {
                //设置的时候一定要保证其是个空，并且服务器没有发牌，你就摸了一张，肯定是有bug或者黑客入侵
                throw new Error("\u5DF2\u7ECF\u6478\u8FC7\u724C:" + this._mo_pai + "\uFF0C\u9700\u8981\u5148\u6253\u4E00\u5F20");
            }
            this._mo_pai = pai;
            //如果是杠别人的牌之后发的牌，那么此时mo_pai也肯定是空的。
            this.after_mo_gang_dapai = false;
            //扛或者碰之后就会清除_mo_pai,由他们来添加这张摸牌
            // this.group_shou_pai.shouPai.push(pai);
            // this.group_shou_pai.shouPai.sort();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "is_hu", {
        //哪个玩家还在想，有人在想就不能打牌！记录好玩家本身的状态就好
        // public is_thinking = false
        /**是否胡了，依赖hupai_zhang */
        get: function () {
            return this.hupai_zhang != null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "allGangPais", {
        /**所有的扛牌，内部计算 */
        get: function () {
            return this._allGangPais;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "otherDapai", {
        get: function () {
            return this._other_dapai;
        },
        /**记录其他人的打牌 */
        set: function (dapai) {
            this._other_dapai = dapai;
            //todo: 应该有个消息通知，其它人打牌了！
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "otherPlayersInRoom", {
        get: function () {
            var _this = this;
            // console.log("查找本玩家%s的其它玩家", person.username);
            return this.room.players.filter(function (p) { return p.user_id != _this.user_id; });
        },
        enumerable: false,
        configurable: true
    });
    /**保存杠上杠，并通知放杠家伙! */
    Player.prototype.saveGangShangGang = function (fangGangPlayer, pai_name) {
        this.gang_win_codes.push(config.HuisGangShangGang);
        fangGangPlayer.innerGang_lose_data.push({
            type: config.LoseGangShangGang,
            pai: pai_name
        });
    };
    /**保存普通杠消息，并通知放杠者 */
    Player.prototype.saveGang = function (fangGangPlayer, pai_name) {
        this.gang_win_codes.push(config.HuisGang);
        fangGangPlayer.innerGang_lose_data.push({
            type: config.LoseGang,
            pai: pai_name
        });
    };
    /**保存擦炮的消息，并通知其它的玩家你得掏钱了! */
    Player.prototype.saveCaPao = function (other_players, pai_name) {
        this.gang_win_codes.push(config.HuisCaPao);
        other_players.forEach(function (person) {
            person.innerGang_lose_data.push({
                type: config.LoseCaPao,
                pai: pai_name
            });
        });
    };
    /**保存暗杠的消息，改变其它两个玩家的扣分! */
    Player.prototype.saveAnGang = function (other_players, pai_name) {
        this.gang_win_codes.push(config.HuisAnGang);
        other_players.forEach(function (person) {
            person.innerGang_lose_data.push({
                type: config.LoseAnGang,
                pai: pai_name
            });
        });
    };
    Object.defineProperty(Player.prototype, "innerGanglose_names", {
        /**到底要出哪些杠钱的名称！包括屁胡炮，大胡炮 */
        get: function () {
            return NMajiangAlgo_1.NMajiangAlgo.LoseNamesFrom(this.innerGang_lose_data);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "gang_lose_codes", {
        /**出杠钱的数字代码 */
        get: function () {
            return this.innerGang_lose_data.map(function (d) { return d.type; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "gang_win_names", {
        /**赢了哪些杠 */
        get: function () {
            return NMajiangAlgo_1.NMajiangAlgo.GangNamesFrom(this.gang_win_codes, true);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "gang_lose_names", {
        /**放了哪些杠 */
        get: function () {
            return NMajiangAlgo_1.NMajiangAlgo.GangNamesFrom(this.gang_lose_codes, false);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "all_win_names", {
        /**胡了哪些项目 */
        get: function () {
            return NMajiangAlgo_1.NMajiangAlgo.HuPaiNamesFrom(this.all_win_codes);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "all_win_codes", {
        /**返回所有赢代码，如果没胡，只返回杠的 */
        get: function () {
            if (this.is_hu) {
                //todo: 胡之后，如何得到所有的胜类型代码？
                return this.hupai_typesCode().concat(this.gang_win_codes);
            }
            else {
                return this.gang_win_codes;
            }
        },
        enumerable: false,
        configurable: true
    });
    /**当前玩家的胡牌类型码，可以在最后胡牌的时候进行修改 */
    Player.prototype.hupai_typesCode = function () {
        if (this.is_hu) {
            return this.hupai_data.hupai_dict[this.hupai_zhang];
        }
        else {
            return [];
        }
    };
    Object.defineProperty(Player.prototype, "result_info", {
        /**玩家胜负结果信息 */
        get: function () {
            //todo: 返回玩家的胜负两种消息！即使没胡，还是可能会有收入的！
            //或者只显示你赢了多少钱，哪怕是个单杠！
            // if (this.is_hu) {
            //   return this.all_win_names.join(" ");
            // } else {
            //   return this.lose_names.join(" ");
            // }
            return {
                win_info: this.all_win_names.join(" "),
                lose_info: this.innerGanglose_names.join(" ")
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "result_shou_pai", {
        /**返回result可用的手牌，把anGang移动到mingGang中，selfPeng移动到peng里面 */
        //胜负最后需要显示的shou_pai, 所有的牌都需要显示出来！
        get: function () {
            var result = _.cloneDeep(this.group_shou_pai);
            if (result.anGang.length > 0) {
                result.anGang.forEach(function (pai) {
                    result.mingGang.push(pai);
                });
                result.anGang = [];
            }
            if (result.selfPeng.length > 0) {
                result.selfPeng.forEach(function (pai) {
                    result.peng.push(pai);
                });
                result.selfPeng = [];
            }
            return result;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "canAnGang", {
        // /**是否放炮 */
        // get is_fangpao(): boolean {
        //   // return this.gang_lose_data.some(item => item.type == config.LoseDaHuPao || item.type == config.LosePihuPao);
        //   return true;
        // }
        get: function () {
            return !_.isEmpty(this.canZhiGangPais());
        },
        enumerable: false,
        configurable: true
    });
    /**能够自己杠的牌*/
    Player.prototype.canZhiGangPais = function () {
        return NMajiangAlgo_1.NMajiangAlgo.canZhiGangPais(this.group_shou_pai, this.mo_pai);
    };
    /**返回group.shouPai中出现3次的牌！ */
    Player.prototype.PaiArr3A = function () {
        return NMajiangAlgo_1.NMajiangAlgo.all3Apais(this.group_shou_pai.shouPai);
    };
    /**摸牌后四张，用于判断暗四归，暗杠，在group手牌中存在3张相同的牌，因为mo_pai后会添加到shouPai中，
     * 所以需要检查数量是否为4
     */
    Player.prototype.isMoHouSi = function (pai_name) {
        var countPai = this.group_shou_pai.shouPai.filter(function (pai) { return pai == pai_name; });
        return (countPai.length === 4 || this.group_shou_pai.selfPeng.includes(pai_name));
    };
    Player.prototype.canZhiMo = function () {
        if (this.mo_pai == null) {
            console.warn(chalk_1["default"].red(this.username + " \u6CA1\u6709\u6478\u724C\u600E\u4E48\u81EA\u6478\uFF1F"));
            return false;
        }
        return this.canHu(this.mo_pai);
    };
    /**能否胡pai_name */
    Player.prototype.canHu = function (pai_name) {
        if (pai_name == null) {
            console.warn("canHu\u53C2\u6570pai_name\u4E3A\u7A7A\uFF01");
        }
        this.calculateHu();
        if (this.hupai_data.all_hupai_zhang.includes(pai_name)) {
            return true;
        }
        else {
            return false;
        }
    };
    /**是否是大胡 */
    Player.prototype.isDaHu = function (pai_name) {
        return NMajiangAlgo_1.NMajiangAlgo.isDaHu(this.hupai_data.hupai_dict[pai_name]);
    };
    Object.defineProperty(Player.prototype, "flat_shou_pai", {
        /** 玩家手牌数组，从group_shou_pai中生成 */
        get: function () {
            return NMajiangAlgo_1.NMajiangAlgo.flat_shou_pai(this.group_shou_pai);
            // return []
        },
        enumerable: false,
        configurable: true
    });
    /** 从牌数组中删除一张牌 */
    Player.prototype.delete_pai = function (arr, pai) {
        var firstIndex = arr.indexOf(pai);
        if (firstIndex > -1) {
            arr.splice(firstIndex, 1);
            return true;
        }
        else {
            return false;
        }
    };
    // /**能否听牌，玩家没亮的时候，屁胡不能听牌！其它情况下是可以的！ */
    // canTing(): boolean {
    //   return this.hupai_data.all_hupai_zhang.length > 0;
    // }
    /**能亮否？能胡就能亮？ */
    Player.prototype.canLiang = function () {
        // return MajiangAlgo.isDaHu(this.hupai_data.all_hupai_typesCode)
        return this.hupai_data.all_hupai_zhang.length > 0;
    };
    /**能碰吗？只能是手牌中的才能检测碰，已经碰的牌就不需要再去检测碰了 */
    Player.prototype.canPeng = function (pai) {
        return NMajiangAlgo_1.NMajiangAlgo.canPeng(this.group_shou_pai.shouPai, pai, this.is_liang);
        // return true
    };
    /**能杠吗？分碰了之后杠还是本来就有三张牌，亮牌后只有selfPeng可以扛！ */
    Player.prototype.canGangOther = function (pai) {
        var selfMo = this.mo_pai != null;
        //能否杠还能分你是自摸碰还是求人碰，selfPeng是可以随便杠的，但是求人碰则得自己摸牌才能杠！
        return NMajiangAlgo_1.NMajiangAlgo.canGang(this.group_shou_pai, pai, this.is_liang, selfMo);
        // return true
    };
    Player.prototype.confirm_peng = function (pai) {
        this._mo_pai = null;
        // this.is_thinking = false
        this.group_shou_pai.peng.push(pai);
        //从手牌中删除二张牌，因为把别人的牌当成是mo_pai加入了手牌！
        //这样的话其它玩家liang, guo之后就知道碰玩家是摸牌的人了！
        for (var i = 0; i < 2; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, pai);
        }
        //删除掉重新排序
        this.shouPaiInGroupReOrder();
        //碰了之后能够打牌
        this.can_dapai = true;
    };
    Player.prototype.shouPaiInGroupReOrder = function () {
        this.group_shou_pai.shouPai = _.orderBy(this.group_shou_pai.shouPai);
    };
    Player.prototype.confirm_gang = function (pai_name) {
        //除了不能扛自己的打牌，其它的都可以扛
    };
    /**自己摸的牌就是暗杠了*/
    Player.prototype.confirm_anGang = function (pai_name) {
        // this.is_thinking = false
        this.after_mo_gang_dapai = false;
        //摸牌会添加到手牌之中，这样就会有4张牌
        if (this.mo_pai) {
            this.group_shou_pai.shouPai.push(this._mo_pai);
        }
        //不管是扛牌还是其它牌，总还是要删除4张
        for (var i = 0; i < 4; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, pai_name);
        }
        this._mo_pai = null; //清空摸牌
        this.group_shou_pai.anGang.push(pai_name);
        this.shouPaiInGroupReOrder();
        // todo: 扛之后会发牌，所以需要在发牌里面算胡！或者还是在算胡的时候判断下牌有没有变化！
        this.calculateHu();
        //碰了之后能够打牌
        this.can_dapai = true;
        //需要通知其它人我暗扛了，这样其它人才会去扣掉扛分
        this.saveAnGang(this.otherPlayersInRoom, pai_name);
    };
    /**
     * 杠别人的牌是明杠
     * @param da_pai 其他人打牌
     * @param saved 是否已经通知过他人明扛，默认是没通知
     */
    Player.prototype.confirm_mingGang = function (da_pai, saved) {
        if (saved === void 0) { saved = false; }
        if (!this.canGangOther(da_pai)) {
            throw new Error("\u65E0\u6CD5\u625B" + da_pai);
        }
        this._mo_pai = null;
        // this.is_thinking = false
        this.after_mo_gang_dapai = false;
        this.group_shou_pai.mingGang.push(da_pai);
        //需要删除杠之前的3张牌，可能存在于peng, selfPeng, shoupai之中！
        //如果是碰了之后杠，需要删除这张碰牌
        this.group_shou_pai.peng.remove(da_pai);
        //包括亮牌中的selfPeng，因为peng, selfPeng里面只可能有一个，所以都删除不会出错！
        this.group_shou_pai.selfPeng.remove(da_pai);
        //当自己摸牌杠的时候，其实是需要删除4次的！好在delete_pai找不到的时候并不会出错！
        //不过自己摸牌其实是属于暗杠的范围了
        for (var i = 0; i < 3; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, da_pai);
        }
        this.shouPaiInGroupReOrder();
        //杠之后需要重新算下胡牌！
        this.calculateHu();
        //碰了之后能够打牌
        this.can_dapai = true;
        //需要通知其它人我暗扛了，这样其它人才会去扣掉扛分
        if (!saved) {
            if (this.room && this.room.dapai_player) {
                this.saveGang(this.room.dapai_player, da_pai);
            }
        }
    };
    /**亮牌时需要确定自碰牌，将三张pai从shouPai中移动到selfPeng之中！这样还有机会杠，并且不会展示 */
    Player.prototype.confirm_selfPeng = function (pai) {
        //这个操作只会出现在玩家亮牌以后
        this._mo_pai = null;
        // this.is_thinking = false
        for (var i = 0; i < 3; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, pai);
        }
        this.group_shou_pai.selfPeng.push(pai);
        this.shouPaiInGroupReOrder();
        // this.can_dapai = true
    };
    /**  从玩家手牌中删除pai并计算胡牌*/
    Player.prototype.daPai = function (pai_name) {
        //如果有摸牌，先保存，再删除，避免出现奇怪的问题。
        if (this.mo_pai) {
            this.group_shou_pai.shouPai.push(this.mo_pai);
            this._mo_pai = null; //添加之后清空，打牌之后玩家处于非摸牌状态
        }
        if (this.delete_pai(this.group_shou_pai.shouPai, pai_name)) {
            this.arr_dapai.push(pai_name);
        }
        else {
            throw new Error(this.username + "\u6253\u4E86\u5F20\u975E\u6CD5\u724C\uFF1F" + pai_name);
        }
        //如果打的牌与摸牌相同，不用重复计算，就算是以前手牌里面有，其实也相当于是打了张摸牌
        //如果拿的是别人的牌，那么mo_pai为空，自然牌也改变了，需要重新算胡
        //todo: 如何判断牌改变了？
        this.is_grouppai_changed = true;
        if (this.is_grouppai_changed) {
            //手牌变化也说明这张牌有用，需要看mo_pai是否为空
            //不为空就需要把这张摸牌添加到shouPai中！如果已经碰了或者扛了，那么就不需要再次添加！
            //为空可能是碰的或者扛的别人牌，并非是摸牌
            this.shouPaiInGroupReOrder();
            this.calculateHu();
        }
        this.after_mo_gang_dapai = true;
        this.can_dapai = false; //打过后就不能再打牌了！
        this.arr_selectShow = []; //打牌之后，先清空，再去检测是否还能有选择菜单，比如亮牌
    };
    /**计算各种胡牌的状态 */
    Player.prototype.calculateHu = function () {
        //手牌改变，都需要重新计算胡牌！
        //todo: 如果已经亮牌，则不再继续计算胡牌，但是要确认你首先打了一张牌之后再选择亮
        // if(this.is_liang){
        //   return
        // }
        var changed = true;
        if (changed) {
            this.hupai_data = NMajiangAlgo_1.NMajiangAlgo.HuWhatGroupPai(this.group_shou_pai, this.is_liang);
        }
    };
    /**别人打的牌，看自己能有哪些操作 */
    Player.prototype.kanOtherDapai = function (pai_name) {
        var selfMo = this.mo_pai != null;
        var isOtherDapai = !selfMo;
        var isShowHu = false, isShowLiang = false, isShowGang = false, isShowPeng = false;
        //能否胡
        isShowHu = this.decideShowHu(pai_name);
        //能否亮
        isShowLiang = this.decideShowLiang();
        //能否扛，里面的两种扛都已经包括了is_liang， selfMo的检测！
        isShowGang = this.decideShowGang(isOtherDapai, pai_name);
        //能否碰，如果没有亮才能检测碰
        isShowPeng = this.decideShowPeng(pai_name);
    };
    /**玩家是否能够亮牌, 并获取到所有的隐藏牌selfPeng */
    Player.prototype.decideShowLiang = function () {
        //如果已经亮了，自然不能再亮
        if (this.is_liang) {
            return false;
        }
        //玩家没有摸牌，才去检测亮。如果不选择隐藏牌，那么就会全部亮出来！貌似不能再扛了？
        if (!this.mo_pai) {
            this.calculateHu();
            if (this.canLiang()) {
                console.log("\u623F\u95F4" + this.room.id + " \u73A9\u5BB6" + this.username + "\u53EF\u4EE5\u4EAE\u724C:");
                puts(this.hupai_data);
                // this._allHidePais = this.PaiArr3A()
                return true;
            }
            else {
                return false;
            }
        }
    };
    Player.prototype.decideShowPeng = function (pai_name) {
        //亮牌了就不能再显示碰了？有隐藏的牌还是可以碰的
        // if (this.is_liang) { return false }
        if (this.canPeng(pai_name)) {
            console.log("\u623F\u95F4" + this.room.id + " \u73A9\u5BB6" + this.username + "\u53EF\u4EE5\u78B0\u724C" + pai_name);
            return true;
        }
        else {
            return false;
        }
    };
    Player.prototype.decideShowGang = function (isOtherDapai, pai_name) {
        this._allGangPais = this.getAllGangPais(isOtherDapai, pai_name);
        if (this._allGangPais.length > 0) {
            return true;
        }
        return false;
    };
    /**获取到所有的杠牌 */
    Player.prototype.getAllGangPais = function (isOtherDapai, pai_name) {
        var allGangPais = this.canZhiGangPais();
        if (allGangPais.length > 0) {
            console.log("\u623F\u95F4" + this.room.id + " \u73A9\u5BB6" + this.username + "\u53EF\u4EE5\u81EA\u6760\u724C:" + allGangPais);
        }
        if (isOtherDapai && this.canGangOther(pai_name)) {
            //如果能够扛其它人的牌
            //还要把这张能够扛的牌告诉客户端，canGangPais是发往客户端告诉你哪些牌能扛的！
            //todo:如果canGangPais为空，那么就不要让用户选择！如果只有一个，也不需要用户选择，直接扛
            allGangPais.push(pai_name);
            console.log("\u623F\u95F4" + this.room.id + " \u73A9\u5BB6" + this.username + "\u53EF\u4EE5\u7684\u724C" + allGangPais);
        }
        return allGangPais;
    };
    Player.prototype.decideShowHu = function (pai_name) {
        if (this.canHu(pai_name)) {
            console.log("\u623F\u95F4" + this.room.id + " \u73A9\u5BB6" + this.username + "\u53EF\u4EE5\u81EA\u6478\u80E1" + pai_name);
            return true;
        }
        return false;
    };
    /**可以返回到客户端的玩家属性数组 */
    Player.filter_properties = [
        "username",
        "user_id",
        "seat_index",
        "group_shou_pai",
        "arr_dapai",
        "is_liang"
    ];
    /**胜负属性组 */
    Player.result_properties = [
        "user_id",
        "username",
        "seat_index",
        "result_shou_pai",
        "result_info",
        "is_hu",
        "hupai_zhang",
        "is_fangpao",
        "oneju_score"
    ];
    return Player;
}());
exports.Player = Player;
