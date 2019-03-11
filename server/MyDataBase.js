"use strict";
exports.__esModule = true;
var MyDataBase = /** @class */ (function () {
    function MyDataBase() {
    }
    MyDataBase.getInstance = function () {
        if (!this.instance) {
            this.instance = new MyDataBase();
        }
        return this.instance;
    };
    /**保存玩家数据到数据库中 */
    MyDataBase.prototype.save = function (person) {
        console.log("todo: \u4FDD\u5B58\u73A9\u5BB6" + person.username + "\u7684\u5F97\u5206\u5230\u6570\u636E\u5E93\u4E2D...");
    };
    return MyDataBase;
}());
exports.MyDataBase = MyDataBase;
