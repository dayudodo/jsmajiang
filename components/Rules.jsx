import React from 'react';
import ReactDOM from 'react-dom'
import Images from './Images';

export default class Rules extends React.Component {
	constructor(props){
		super(props)
		this.state= {
			 results:['b1','b2']
		}
	}
    render () {
        return (
	    	<div>
	        	<h1>规则</h1>
	        	<h2>将</h2>
	        	任何一对牌就是一对将，比如：
	        	<Images results={ ['b1','b1'] } /> <Images results={ ['fa','fa'] } /> <Images results={ ['t9','t9'] } />
	        	<h2>一句话</h2>
	        	三个或者四个牌的重复，或者连续的三张牌为一句话，如下：
	        	<Images results={ ['b1','b2','b3'] } />
	        	<Images results={ ['fa','fa','fa'] } />
	        	<Images results={ ['zh','zh','zh','zh'] } />
	        	<h2>胡牌</h2>
	        	四个连续的一句话外加一对将就是胡牌
	        	<Images results={ ['zh','zh','zh','zh'] } />
	        </div>
	    )    
    }
}

