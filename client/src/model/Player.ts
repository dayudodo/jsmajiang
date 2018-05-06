module mj.model {
    export class Player {
        public username: string
        public user_id: string
        public shou_pai: string[] = []
        public used_pai: string[] = []
        public room_name: string
        public hupai_zhang: string
        private _table_pai: string
        /**         是否是庄家         */
        public east = false;
        /**         玩家的席位！         */
        public seat_index = null;
        /**玩家的积分 */
        public score = 0;
        /** 在界面中的序号，左玩家是0，右玩家是2, 上玩家是1，自己是3 */
        public ui_index: number = null;

        constructor() {
        }
        /**         加入参数pai到玩家手牌之中         */
        set table_pai(pai) {
            this._table_pai = pai
            this.shou_pai.push(pai)
        }
        get table_pai() {
            return this._table_pai
        }
        /**         从玩家手牌中删除pai         */
        da_pai(pai) {

            let firstIndex = this.shou_pai.indexOf(pai);
            if (firstIndex > -1) {
                this.shou_pai.splice(firstIndex, 1)
                this.shou_pai.sort() //删除元素之后排序
                this.used_pai.push(pai)
            } else {
                throw new Error(`${this.username}居然打了张不存在的牌？${pai}`);
            }
            this._table_pai = null //打牌之后说明玩家的桌面牌是真的没有了
        }
    }
}