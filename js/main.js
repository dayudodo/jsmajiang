		var MJInput=React.createClass({
		 getInitialState:function(){
		 	return {
		 		text: ''
		 	  , single: ''
		 	  , results: []
		 	}
		 },
		 onChange:function(e){
		 	// var imgSrc= "image/"+ e.target.value + ".png"

		 	this.setState({text: e.target.value})
		 	
		 },
		 handleSubmit: function(e){
		 	e.preventDefault()
		 	// this.setState({single: imgSrc})
		 	if (this.state.text || this.state.text=='') {
				this.setState( {results:  checkValidAndReturnArr(this.state.text) } )
			}
		 },

		  render: function(){
		  	const allImages = this.state.results.map(function(item,index){
		  		let imgSrc = `image/${item}.png` 
		  		return( <img key={index} src={imgSrc} />)
		  	})
		    return(
		    	<div>
			      <form onSubmit={this.handleSubmit}>
			        <input onChange={this.onChange} value={this.state.text} />
			        { allImages }
			      </form>
		      </div>
		      );
		  }
		});

		ReactDOM.render( <MJInput />,  document.getElementById('app') );