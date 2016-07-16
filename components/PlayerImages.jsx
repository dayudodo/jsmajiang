import React from 'react'
import ReactDOM from 'react-dom'

var PlayerImages = React.createClass({
imgClick: function(item,index){
  this.props.imgClick( item,index )
},
moveUp(e){
  let img = ReactDOM.findDOMNode(e.target)
  $(img).removeClass('moveDown').addClass('moveUp')
},
mouseout(e){
  let img = ReactDOM.findDOMNode(e.target)
  $(img).removeClass('moveUp').addClass('moveDown')

},
  render: function(){
     const lineBreak = this.props.lineBreak? this.props.lineBreak : 100
     const allImages = this.props.results.map((item,index)=>{
              if (all_single_pai.indexOf(item)!==-1) {
               let imgSrc = `image/${item}.png` 
               return  <img key={index} src={imgSrc} className="moveDown"
                             onClick={this.imgClick.bind(null,item,index)} 
                             onMouseOver={ this.moveUp } 
                             onMouseOut={ this.mouseout } >
                           { (index + 1) % lineBreak ==0  ? <br />:null}
                        </img>
              }
           })

     return(
       <div className='col-lg-12 col-md-12 moveDown' ref="player_images">
           { allImages }
       </div>
     );
  }
})

module.exports = PlayerImages;

