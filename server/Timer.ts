import * as config from "./config";

class Timer {
  public allTimers;
  constructor() {
    this.allTimers = {};
  }
  //计时过后运行fn
  run(fn: Function, maxWaitTime = 2) {
    let timeout = setTimeout(() => {
      fn();
    }, maxWaitTime * 1000);
    this.allTimers[fn.name] =  timeout
  }
  //取消某个函数引起的计时
  cancel(fn){
    console.log(this.allTimers[fn.name])
    clearTimeout(this.allTimers[fn.name])
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
