module mj.model {
    export class Player {
        public username: string
        public user_id: string
        public shou_pai: string[] = []
        public used_pai: string[] = []
        public room_name: string
        public hupai_zhang: string
        private _table_pai: string 

        constructor() {
        }
        /**
         * 加入参数pai到玩家手牌之中
         */
        set table_pai(pai){
            this._table_pai = pai
            this.shou_pai.push(pai)
        }
        get table_pai(){
            return this._table_pai
        }
        /**
         * 删除玩家手牌index处的牌
         * @param index 
         */
        da_pai(index: number) {

            let firstIndex = this.shou_pai.indexOf(this.shou_pai[index]);
            if (firstIndex > -1) {
                this.shou_pai.splice(firstIndex, 1)
                this.shou_pai.sort() //删除元素之后排序
                this.used_pai.push(this.shou_pai[index])
            } else {
                throw new Error(
                    `我居然打了张不存在的牌？index: ${index}`
                );
            }
            this._table_pai = null //打牌之后说明桌面牌是真的没有了
        }
    }
}