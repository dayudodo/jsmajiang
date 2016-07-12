import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
// import TimerMixin from 'react-timer-mixin';

import MJWhich from './MJWhich'
import Play from './Play'
import About from './About'
import Rules from './Rules'

//level中的牌都是可以胡的

ReactDOM.render((
  <Router history={ hashHistory }>
    <Route path="/" component={ MJWhich }/>
    <Route path="/play/:name" component={ Play }/>
    <Route path="/about" component={ About }/>
    <Route path="/rules" component={ Rules }/>
  </Router>
), document.getElementById('app'));