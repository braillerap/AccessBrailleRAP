
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';

class TextInput extends React.Component {
    
    constructor(props) {

      super(props);
      
      this.state = {
        txt: this.props.src
      };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleimport = this.handleimport.bind(this);
      this.handleload = this.handleload.bind(this);
      this.handlesave = this.handlesave.bind(this);
      this.handlesaveas = this.handlesaveas.bind(this);
    }

    async handlesave (event)
    {
      event.preventDefault();
      let dialogtitle = this.props.intl.formatMessage({id:"input.dialog_saveas_file"})
      let filter = [
        this.props.intl.formatMessage({id:"input.dialog_file_filter_text"}),
        this.props.intl.formatMessage({id:"input.dialog_file_filter_generic"}),
      ]

      let ret = await eel.save_file (this.state.txt, dialogtitle, filter);
            
    }
    async handlesaveas (event)
    {
      event.preventDefault();
      let dialogtitle = this.props.intl.formatMessage({id:"input.dialog_saveas_file"})
      let filter = [
        this.props.intl.formatMessage({id:"input.dialog_file_filter_text"}),
        this.props.intl.formatMessage({id:"input.dialog_file_filter_generic"}),
      ]

      let ret = await eel.saveas_file (this.state.txt, dialogtitle, filter);
            
    }
    async handleload (event)
    {
      event.preventDefault();

      let dialogtitle = this.props.intl.formatMessage({id:"input.dialog_open_file"})
      let filter = [
        this.props.intl.formatMessage({id:"input.dialog_file_filter_text"}),
        this.props.intl.formatMessage({id:"input.dialog_file_filter_generic"}),
      ]
      let ret = await eel.load_file (dialogtitle, filter)();
      console.log (ret);
      if (ret.length > 0)
      {
        //console.log (ret)
        let data = JSON.parse(ret);
        console.log (data);
        //for (let i = 0; i < ret.length; i++)
        this.props.textcb(data.data);
        this.setState({txt: data.data});
      }
    }
    async handleimport(event)
    {
        event.preventDefault();
        let dialogtitle = this.props.intl.formatMessage({id:"input.dialog_import_file"})
        let filter = [
          this.props.intl.formatMessage({id:"input.dialog_file_filter_generic"}),
        ]

        let ret = await eel.import_pandoc (dialogtitle, filter)();
        console.log (ret);
        if (ret.length > 0)
        {
          let data = JSON.parse(ret);
          if (data.data.length > 0)
          {
            console.log (data);
            //for (let i = 0; i < ret.length; i++)
            this.props.textcb(data.data);
            this.setState({txt: data.data});
          }
          else if (data.error.length > 0)
            alert (data.error);
        }
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
    componentDidMount ()
    {
      if (this.props.focusref)
        this.props.focusref.current.focus ();
    }
    render ()
    {
      //console.log (this.props.options);
      if (! this.props.options)
      {
        return (
        <div aria-label='Formulaire de saisie du texte'>
        
        <h1 aria-label='Formulaire de saisie du texte'>
          
          <FormattedMessage id="input.title" defaultMessage="Saisie du texte"/>
          </h1>
        
        <form onSubmit={this.handleSubmit} >
          <textarea  aria-label={this.props.intl.formatMessage({id:"input.text_aria"})} 
            value={this.state.txt} onChange={this.handleChange} 
            rows={10} cols={10} className="BrailleInput">{this.state.txt}</textarea>
      
        </form>
        </div>
      );
      
    
      }
      else
      {
        const ncols = parseInt(this.props.options.nbcol);
        const nlines = parseInt(this.props.options.nbline);
        return (
              <div >
                
                <form onSubmit={this.handleSubmit} >
                  <h1 aria-hidden={true}></h1>
                  <button onClick={this.handleload} className="pad-button pure-button " >{this.props.intl.formatMessage({id:"input.loadfile"})}</button>
                  <button onClick={this.handlesave} className="pad-button pure-button " >{this.props.intl.formatMessage({id:"input.savefile"})}</button>
                  <button onClick={this.handlesaveas} className="pad-button pure-button " >{this.props.intl.formatMessage({id:"input.saveasfile"})}</button>
                  <button onClick={this.handleimport} className="pad-button pure-button " >{this.props.intl.formatMessage({id:"input.importfile"})}</button>
                  <h1 aria-atomic={true}>
                    <FormattedMessage id="input.title2" defaultMessage="Formulaire de saisie du texte"/>
                  </h1>  
                  
                  <textarea  aria-label={this.props.intl.formatMessage({id:"input.text_aria"})}
                    value={this.state.txt} 
                    onChange={this.handleChange} 
                    rows={nlines} 
                    cols={ncols} 
                    ref={this.props.focusref}
                    className="BrailleInput">{this.state.txt}</textarea>
                  
                </form>
            </div>
          );
      }
    }
  }
  
  export default injectIntl(TextInput);