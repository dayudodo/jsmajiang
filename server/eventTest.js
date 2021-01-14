var menu = {
  // 当前状态
  currentState: "hide", // 绑定事件
  initialize: function () {
    var self = this
    self.on("hover", self.transition)
  }, // 状态转换
  transition: function (event) {
    switch (this.currentState) {
      case "ready":
        this.currentState = "ready"
        //此时接受所有玩家的准备，如果最后一个也准备了，那么就开始！有没有互斥操作呢？也就是玩家们一起点击ready的时候？
        //immutalbeReady?    
        break
      case "begin":
        this.currentState = "begin"
        break
      case "candapai":
        this.firstPlayerDapai()
        this.currentState = "receive" //改变状态为接受，只有这时候才会接受客户端发来的消息，再来个ready肯定有问题。
        break
      case "能选择":
        this.currentState = "能选择"
        //生成当前玩家的选择项,玩家发的事件和服务器发的事件应该发开，也应该分开。
        this.generateSelectOptions(this.player)
        break
      case "canHu":
        this.send("canHu", this.player)
        break
      default:
        console.log("Invalid State!")
        break
    }
  },
  generateSelectOptions() {
    this.showHu = true
    if (this.isshowliang == false) {
      this.isShowLiang = true
    }
    if (this.canGang) {
      this.showGang = true
    }
  },
}
