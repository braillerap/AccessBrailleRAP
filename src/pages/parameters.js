
import React from 'react';
import { json } from 'react-router-dom';

import { eel } from "./../eel.js";

class Parameters extends React.Component {

    constructor (props)
    {
        super (props);
        this.state = {
            data:[],
            nbcol:28,
            nbline:21,
            comport:"COM1",
            options : this.props.options
        }

        this.handleChangeNbCol = this.handleChangeNbCol.bind (this);
        this.handleChangeNbLine = this.handleChangeNbLine.bind (this);
        this.handleChangePort =this.handleChangePort.bind(this);
    }

    async componentDidMount()
    {
        let list = await eel.gcode_get_serial()();
        console.log (list)
        let portinfo = JSON.parse(list);
        this.setState ({data:portinfo})
    }
    

    
    handleChangeNbCol(event)
    {
      console.log (event);
      console.log (event.target.value);
      let option = this.state.options
      option.nbcol = event.target.value;

      
      if (this.props.optioncb)
        this.props.optioncb(option)
      this.setState({options:option});  
        
    }
    handleChangeNbLine(event)
    {
      console.log (event);
      console.log (event.target.value);
      let option = this.state.options
      option.nbline = event.target.value;

      
      if (this.props.optioncb)
        this.props.optioncb(option)
      else
        this.setState({options:option});  
    }

    handleChangePort (event)
    {
      console.log (event);
      console.log (event.target.value);
      console.log (event);
      console.log (event.target.value);
      let option = this.state.options
      option.comport = event.target.value;

      if (this.props.optioncb)
        this.props.optioncb(option);
      this.setState({options:option});  
      
        
     
    }

    render_comport ()
    {
      if (this.state.data === null)
        return (
          <p>Aucun port de communication</p>
        );
      else if (this.state.data.length === 0)
        return (
        <p>Aucun port de communication</p>
            );
      else  
          return (
         
         <select aria-label="Port de communication " onChange={this.handleChangePort} value={this.state.options.comport} name="selectport">
               {this.state.data.map ((line, index)=> (
                  <option key={line.device} value={line.device}>{line.device} {line.description}</option>))}
                    
         </select>
         
        );
    }
    
    render ()
    {
        console.log (this.state.data);
        console.log ("type :" + typeof(this.state.data).toString());
      return (
            
              <div>
                <label aria-label="Formulaire de paramétrage de l'application"></label>
                <h1 aria-hidden="true">Paramètres</h1>
              <form className='pure-form pure-form-aligned'>
                <fieldset>
                <div className="pure-control-group">
                <label aria-label='Nombre de caractères par ligne ' for='nbcol'><span aria-hidden="true">Nombre de caractères par ligne:</span></label>
                  <input type="number" step="1" min="5" max="35" name="nbcol" value={this.state.options.nbcol} onChange={this.handleChangeNbCol}/>
                
                </div>
                <div className="pure-control-group">
                <label aria-label='Nombre de lignes par page ' for='nbline'><span aria-hidden="true">Nombre de lignes par page:</span></label> 
                  <input type="number" step="1" min="5" max="35" name="nbline" value={this.state.options.nbline} onChange={this.handleChangeNbLine} />
                
                </div>
                <div className="pure-control-group">
                  <label aria-label='Port de communication' for='selectport'><span aria-hidden='true'>Port de communication</span></label>
                    {this.render_comport()}
                
                </div>
                </fieldset>
                
                
              </form>
              
              
              </div>


          
        );
    }
  }

  export default Parameters;