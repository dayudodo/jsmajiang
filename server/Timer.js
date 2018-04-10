import * as config from "./../config";

class Timer {
  constructor() {
    this.allTimers = {};
  }
  //计时过后运行fn
  run(fn, maxWaitTime = 2) {
    if (typeof fn !== "function") {
      throw new Error("fn必须是个函数");
    }
    let timeout = setTimeout(() => {
      fn();
    }, maxWaitTime * 1000);
    this.allTimers[fn] =  timeout
  }
  //取消某个函数引起的计时
  cancel(fn){
    console.log(this.allTimers[fn])
    clearTimeout(this.allTimers[fn])
  }
}

var t = new Timer();
function mylog() {
  console.log("aha");
}
var another = () => {
  console.log("another");
};
t.run(mylog);

t.run(another, 4);
t.cancel(another)
