var React = require('react');
var ReactDOM = require('react-dom');

var Images=React.createClass({
  imgClick:function(item,index){
    if (this.props.canClick) {
      //点击后改变results里面的数据，也许用redux会比较方便？这儿其实比较简单。
      this.props.sendMe(item)
    };
  },
  render: function(){
     const lineBreak = this.props.lineBreak? this.props.lineBreak : 100
     const allImages = this.props.results.map((item,index)=>{
              if (all_single_pai.includes(item)) {
               let imgSrc = `image/${item}.png` 
               return (  <div1 key={index}>
                           <img  src={imgSrc} onClick={this.imgClick.bind(null,item,index)} />
                           { (index + 1) % lineBreak ==0  ? <br />:null}
                         </div1>
                     )
              }
           })

     return(
       <div>
           { allImages }
       </div>
     );
  }
});

module.exports = Images