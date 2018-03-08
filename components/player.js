//每一个玩家的数据保存在此类中

class Player {
    constructor(){
        this.allPai = []
    }
    receive_pai(pai){
        this.allPai.push(pai)
    }
}

var p= new Player()
p.receive_pai('b1')
p.receive_pai('b2')

console.dir(p.allPai)