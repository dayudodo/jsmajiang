"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MyDataBase {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new MyDataBase();
        }
        return this.instance;
    }
    /**保存玩家数据到数据库中 */
    save(person) {
        console.log(`todo: 保存玩家${person.username}的得分到数据库中...`);
    }
}
exports.MyDataBase = MyDataBase;
//# sourceMappingURL=MyDataBase.js.map