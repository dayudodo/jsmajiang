import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

// import TimerMixin from 'react-timer-mixin';

import MJWhich from './MJWhich'
import Play from './Play'
import About from './About'
import Rules from './Rules'
import Header from './Header';

// var APP = React.createClass({
// 	render(){
// 		return(
// 		<div>
// 			<Header />

// 	  	</div>
// 		)
// 	}
// })

var routes = (
	<div>
		<Header />
		<Router history={ hashHistory } >
		  <Route path="/" component={ Play }/>
		  <Route path="/mjwhich" component={ MJWhich }/>
		  <Route path="/about" component={ About }/>
		  <Route path="/rules" component={ Rules }/>

		</Router>
	</div>
)

ReactDOM.render(routes, document.getElementById('app'));
