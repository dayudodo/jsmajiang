var React = require('react');
var ReactDOM = require('react-dom');

var Play=React.createClass({
	getInitialState() {
	    return {
	        status:"等待其它玩家加入。。。"  
	    };
	},

  render: function(){


     return(
       <div>
           { this.state.status}
       </div>
     );
  }
});

module.exports = Play