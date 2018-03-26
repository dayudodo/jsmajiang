import * as config from "./../config";

class Timer {
  constructor() {
    this.allTimers = [];
  }
  run(fn, maxWaitTime = 2) {
    if (typeof fn !== "function") {
      throw new Error("fn必须是个函数");
    }
    setTimeout(() => {
      fn();
    }, maxWaitTime * 1000);
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
