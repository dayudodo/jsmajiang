import React from 'react';
import { Link } from 'react-router'

export default class Header extends React.Component {
    render() {
        return (
        	<nav className="navbar navbar-default navbar-inverse">
        	  <div className="container-fluid">
        	    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-9">
        	              <ul className="nav navbar-nav">
        	                <li className="active"><a href="#">玩牌</a></li>
                            <li> <a href="#/mjwhich">看胡</a></li>
                            <li> <a href="#/about">关于</a></li>
        	              </ul>
        	            </div>
        	  </div>
        	</nav>
        )
    }
}

