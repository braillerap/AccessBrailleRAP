
import React from 'react';



class TextInput extends React.Component {
    
    constructor(props) {

      super(props);
      
      this.state = {
        txt: this.props.src
      };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) 
    {
      
    }
    
    handleChange(event) 
    {
      //console.log (event.target.value)
      this.setState({txt: event.target.value});
      this.props.textcb (event.target.value);
    }
    render ()
    {
      return (
            <div >
              
              <h1 aria-label='Formulaire de saisie du texte'>Saisie du texte</h1>
              
              <form onSubmit={this.handleSubmit} >
                <textarea  aria-label='zone de saisie du texte pour transcription' value={this.state.txt} onChange={this.handleChange} 
                rows={this.props.options.nbline} cols={this.props.options.nbcol} className="BrailleInput">{this.state.txt}</textarea>
            
              </form>
            
            
          </div>
        );
    }
  }
  
  export default TextInput;