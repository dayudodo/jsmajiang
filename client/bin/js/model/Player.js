var mj;
(function (mj) {
    var model;
    (function (model) {
        class Player {
            constructor() {
                this.shou_pai = [];
                this.used_pai = [];
            }
            da_pai(pai) {
                this.shou_pai.push(pai); //打牌的时候才会把牌保存到手牌中统一处理！
                let firstIndex = this.shou_pai.indexOf(pai);
                if (firstIndex > -1) {
                    this.shou_pai.splice(firstIndex, 1);
                    this.used_pai.push(pai);
                }
                else {
                    throw new Error(`我居然打了张不存在的牌？${pai}`);
                }
            }
        }
        model.Player = Player;
    })(model = mj.model || (mj.model = {}));
})(mj || (mj = {}));
//# sourceMappingURL=Player.js.map