"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
const _ = require("lodash");
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
    /**打牌就有人能杠 */
    static fapai_gang() {
        var allpais = TablePaiManager.fapai_random();
        var player1 = "b1 t1 t1 t3 t7 t8 t9 zh zh fa di di di".split(' ');
        var player2 = "b1 b1 b1 b2 b3 b4 t1 t2 t4 t5 zh fa fa".split(' ');
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
}
exports.TablePaiManager = TablePaiManager;
// console.log('====================================');
// console.log(TablePaiManager.fapai_gang());
// console.log('====================================');
//# sourceMappingURL=TablePaiManager.js.map