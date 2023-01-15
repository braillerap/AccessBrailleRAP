
import React from 'react';
import { json } from 'react-router-dom';

import { eel } from "./../eel.js";

class Parameters extends React.Component {

    constructor (props)
    {
        super (props);
        this.state = {
            data:null,
            nbcol:28,
            nbline:21,
            options:this.props.options
        }

        this.handleChangeNbCol = this.handleChangeNbCol.bind (this);
        this.handleChangeNbLine = this.handleChangeNbLine.bind (this);
        this.handleChangePort =this.handleChangePort.bind(this);
        this.handleRefreshPort = this.handleRefreshPort.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        console.log ("constructor");
    }

    async componentDidMount()
    {
      let list = await eel.gcode_get_serial()();
      //console.log (list)
      let portinfo = JSON.parse(list);
      this.setState ({data:portinfo})
     
      if (this.props.focusref)
          this.props.focusref.current.focus ();
    
    }
    
    handleSubmit (event)
    {
      event.preventDefault();
    }

    handleRefreshPort ()
    {
      eel.gcode_get_serial()(list => {
          let portinfo = JSON.parse(list);
          this.setState ({data:portinfo})
        }
      );
    }
    
    handleChangeNbCol(event)
    {
      //console.log (event);
      //console.log (event.target.value);
      let option = this.props.options
      option.nbcol = event.target.value;

      
      if (this.props.optioncb)
        this.props.optioncb(option)
      else
        this.setState({options:option});  
        
    }
    handleChangeNbLine(event)
    {
      //console.log (event);
      //console.log (event.target.value);
      let option = this.props.options
      option.nbline = event.target.value;

      
      if (this.props.optioncb)
        this.props.optioncb(option)
      else
        this.setState({options:option});  
    }

    handleChangePort (event)
    {
      let option = this.props.options
      option.comport = event.target.value;

      if (this.props.optioncb)
        this.props.optioncb(option);
      else
        this.setState({options:option});  
    
    }

    render_comport ()
    {
      if (this.state.data === null)
        return (
          <p aria-hidden='true'>Aucun port de com</p>
        );
      else if (this.state.data.length === 0)
        return (
        <p aria-hidden='true'>Aucun port de com</p>
            );
      else  
      { 
        
        return (
         <>
         <p aria-label={'Port de communication ' + this.props.options.comport + ' : '} >{'Port de communication ' + this.state.options.comport}</p>
         <label aria-hidden='true' htmlFor='selectport'>Port de communication</label>
         <select onChange={this.handleChangePort}  value={this.props.options.comport} name="selectport">
            
         
         {this.state.data.map ((line, index)=> {
                  if (line.device === this.props.options.comport)
                    return (<option  aria-selected='true' key={line.device} value={line.device}>{line.device} {line.description}</option>);
                  else
                    return (<option  aria-selected='false' key={line.device} value={line.device}>{line.device} {line.description}</option>);
               })
              }
                    
         </select>

         </>
        );
      }
    }
    
    render ()
    {
      if (! this.state.data || this.state.data.length === 0)
      {
        
        return (
          <div aria-hidden='true'>
            Patientez
          </div>
        );
      }  
        //console.log (this.state.data);
        //console.log ("type :" + typeof(this.state.data).toString());
      return (
            
              <div aria-live="polite" role="log" aria-relevant="all" aria-atomic={true}>
                
              <form 
                aria-label="Formulaire de paramétrage de l'application" 
                className='pure-form pure-form-aligned' 
                aria-live="assertive" 
                role="log" 
                aria-relevant="all" 
                aria-atomic={true}
                onSubmit={this.handleSubmit}
                >
                
                <fieldset>
               
                <h1>Formulaire de paramétrage de l'application</h1>
                <div className="pure-control-group">
                <label  htmlFor='nbcol' aria-label='Nombre de caractères par ligne'>Nombre de caractères par ligne</label>
                  <input type="number" aria-label='Nombre de caractères par ligne' 
                    step="1" min="5" max="35" name="nbcol" id="nbcol"
                    value={this.props.options.nbcol} 
                    onChange={this.handleChangeNbCol} 
                    autoFocus
                    ref={this.props.focusref}
                  />
                
                </div>
                <div className="pure-control-group">
                <label  
                  aria-label='Nombre de lignes par page' 
                  htmlFor='nbline'>
                  Nombre de lignes par page
                </label> 
                <input  
                  aria-label='Nombre de lignes par page' 
                  type="number" 
                  step="1" 
                  min="5" 
                  max="35" 
                  name="nbline" 
                  id="nbline" 
                  value={this.props.options.nbline} 
                  onChange={this.handleChangeNbLine} 
                />
                
                </div>
                <div className="pure-control-group">
                  
                    {this.render_comport()}
                    <button  
                      aria-label='bouton actualiser les ports de communications' 
                      className="pure-button pad-button" 
                      onClick={this.handleRefreshPort}
                      >Actualiser
                    </button>      

                </div>
                
                </fieldset> 
               
                
              </form>
              
              
              </div>


          
        );
    }
  }

  export default Parameters;