"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
const _ = require("lodash");
const MajiangAlgo_1 = require("./MajiangAlgo");
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
    return this;
};
class TablePaiManager {
    constructor() { }
    /**按顺序发牌 */
    static fapai_sequence() {
        return _.clone(config.all_pai);
    }
    /**随机发牌 */
    static fapai_random() {
        return _.shuffle(_.clone(config.all_pai));
    }
    /**七对放炮 */
    static qidiu_ting() {
        var allpais = TablePaiManager.fapai_random();
        var player1 = MajiangAlgo_1.getArr("b1 t1 t1 t3 t7 b8 b9 zh zh fa di di di");
        var player2 = MajiangAlgo_1.getArr("b1 b1 b2 b2 b3 b3 b5 b6 b7 b8 b8 b9 b9");
        var newPais = [];
        newPais = newPais.concat(player1);
        newPais = newPais.concat(player2);
        player1.forEach((pai, index) => {
            allpais.remove(pai);
        });
        player2.forEach((pai, index) => {
            allpais.remove(pai);
        });
        newPais = newPais.concat(allpais);
        return newPais;
    }
    /**碰了打牌之后能亮 */
    static penggang_da_liang() {
        var allpais = TablePaiManager.fapai_random();
        var player1 = "b1 t1 t1 t3 t7 t8 t9 zh zh fa di di di".split(" ");
        var player2 = "b1 b1 b7 b8 b9 t1 t2 t3 t4 t5 t6 fa fa".split(" ");
        var newPais = [];
        newPais = newPais.concat(player1);
        newPais = newPais.concat(player2);
        player1.forEach((pai, index) => {
            allpais.remove(pai);
        });
        player2.forEach((pai, index) => {
            allpais.remove(pai);
        });
        newPais = newPais.concat(allpais);
        return newPais;
    }
    /**庄家打牌就有人能杠 */
    static fapai_gang() {
        var allpais = TablePaiManager.fapai_random();
        var player1 = "b1 t1 t1 t3 t7 t8 t9 zh zh fa di di di".split(" ");
        var player2 = "b1 b1 b1 b2 b3 b4 t1 t2 t4 t5 zh fa fa".split(" ");
        var newPais = [];
        newPais = newPais.concat(player1);
        newPais = newPais.concat(player2);
        player1.forEach((pai, index) => {
            allpais.remove(pai);
        });
        player2.forEach((pai, index) => {
            allpais.remove(pai);
        });
        newPais = newPais.concat(allpais);
        return newPais;
    }
    /**庄家打牌就能亮 */
    static dapai_liang() {
        var allpais = TablePaiManager.fapai_random();
        var player1 = "b1 b2 b3 b4 b5 b9 t4 t4 t6 t6 t6 di di".split(" ");
        var player2 = "b1 b1 b1 b2 b3 b4 t1 t2 t3 t6 fa fa di".split(" ");
        var player3 = "b4 b5 b6 b7 b8 b9 t1 t7 t7 t7 t8 t8 di".split(" ");
        var fa_pais = "t4".split(' ');
        var newPais = [];
        newPais = newPais.concat(player1);
        newPais = newPais.concat(player2);
        newPais = newPais.concat(player3);
        newPais = newPais.concat(fa_pais);
        player1.forEach((pai, index) => {
            allpais.remove(pai);
        });
        player2.forEach((pai, index) => {
            allpais.remove(pai);
        });
        fa_pais.forEach((pai, index) => {
            allpais.remove(pai);
        });
        newPais = newPais.concat(allpais);
        return newPais;
    }
}
exports.TablePaiManager = TablePaiManager;
// console.log('====================================');
// console.log(TablePaiManager.fapai_gang());
// console.log('====================================');
//# sourceMappingURL=TablePaiManager.js.map