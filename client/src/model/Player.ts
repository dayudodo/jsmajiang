module mj.model {
    export class Player {
        public username: string
        public user_id: string
        public shou_pai: Pai[] = []
        public used_pai: Pai[] = []
        public room_name: string
        public hupai_zhang: string
        private _table_pai: Pai
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
        set table_pai(pai: Pai) {
            this._table_pai = pai
            this.shou_pai.push(pai)
        }
        get table_pai() {
            return this._table_pai
        }
        /** 最后一张打出的牌在out中的坐标 */
        get last_out_coordinate(): [number, number] {
            let line = 0, row = 0
            let len = this.used_pai.length
            if (len >= config.OutLineBreakCount) {
                line = 1
                row = len - config.OutLineBreakCount
            } else {
                line = 0
                row = (len == 0 ? 0 : len - 1)
            }
            return [line, row]
        }
        /**         从玩家手牌中删除pai         */
        da_pai(pai: Pai) {

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