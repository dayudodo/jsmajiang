import React from 'react'
import ReactDOM from 'react-dom'

var Images = React.createClass({
  imgClick: function(item,index){
    if(this.props.sendMeToUser) {   this.props.sendMeToUser(item)   }
    if(this.props.deleteMe)     {   this.props.deleteMe(item)       }
      // this.props.onClick && this.props.onClick()
  },
  render: function(){
     const lineBreak = this.props.lineBreak? this.props.lineBreak : 100
     const allImages = this.props.results.map((item,index)=>{
              if (all_single_pai.indexOf(item)!==-1) {
               let imgSrc = `image/${item}.png` 
               return (  <div1 key={index}>
                           <img  src={imgSrc} onClick={this.imgClick.bind(null,item,index)} />
                           { (index + 1) % lineBreak ==0  ? <br />:null}
                         </div1>
                     )
              }
           })

     return(
       <div className='col-lg-12 col-md-12'>
           { allImages }
       </div>
     );
  }
})

module.exports = Images;

