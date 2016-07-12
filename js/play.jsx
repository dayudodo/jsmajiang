var React = require('react');
var ReactDOM = require('react-dom');

var Play=React.createClass({

  render: function(){


     return(
       <div>
           { this.props.params.name } play in here.
       </div>
     );
  }
});

module.exports = Play