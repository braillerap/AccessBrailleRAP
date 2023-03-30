
import React from 'react';
import { json } from 'react-router-dom';

import { eel } from "../eel.js";

function  braille_info (fname, desc, lang, region) {
  this.fname =fname;
  this.desc = desc;
  this.lang = lang;
  this.region = region;
  
}

class Parameters extends React.Component {

    constructor (props)
    {
        super (props);
        this.state = {
            data:null,
            nbcol:28,
            nbline:21,
            options:this.props.options,
            comevent:"",
            louis:this.props.louis,
            brailleinfo:[]
        }

        this.handleChangeNbCol = this.handleChangeNbCol.bind (this);
        this.handleChangeNbLine = this.handleChangeNbLine.bind (this);
        this.handleChangePort =this.handleChangePort.bind(this);
        this.handleRefreshPort = this.handleRefreshPort.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeBraille = this.handleChangeBraille.bind(this);
        //console.log ("constructor");
    }

    async componentDidMount()
    {
      let list = await eel.gcode_get_serial()();
      //console.log (list)
      let portinfo = JSON.parse(list);
      this.setState ({data:portinfo})
     
      
      //console.log ("louis es tu la ?");  
      //console.log (this.props.glouis());  
      if (this.props.glouis())
      {
        let brtable = [];
        let louis = this.props.glouis();
        let nbr = this.props.glouis().get_table_nbr();
        for (let i = 0; i < nbr; i++)
        {
          let description = louis.get_table_description(i);
          let br = new braille_info(
            louis.get_table_fname(i), 
            description,
            louis.get_table_lang(i), 
            louis.get_table_region(i)
          );
          brtable.push (
            br
          );
          //console.log (this.props.glouis().get_table_fname(i));
        }
        this.setState({brailleinfo:brtable})
      }
      //else
      //  console.log ("louis dead");

        if (this.props.focusref)
          this.props.focusref.current.focus ();
    }
    
    handleSubmit (event)
    {
      event.preventDefault();
    }

    handleRefreshPort ()
    {
      this.setState ({comevent:"Patientez"})
      eel.gcode_get_serial()(list => {
          let portinfo = JSON.parse(list);
          this.setState ({data:portinfo, comevent:"Ports de communications actualisés"})

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

    handleChangeBraille(event)
    {
      let option = this.props.options
      option.brailletbl = event.target.value;

      if (this.props.optioncb)
        this.props.optioncb(option);
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
    render_braille_lang ()
    {
      if (this.state.brailleinfo.length === 0)
      {
        return (<p aria-hidden='true'>Aucune table de transcription</p>)
      }
      let selectedtable ="vide";
      if (this.state.options.brailletbl < this.state.brailleinfo.length)
        selectedtable = this.state.brailleinfo[this.state.options.brailletbl].desc;
      return (
        <>
        <p aria-label={'Table de transcription ' + selectedtable + ' : '} >{'Table de transcription  ' + selectedtable}</p>
        <label aria-hidden='true' htmlFor='selectbraille'>Table Braille</label>
        <select onChange={this.handleChangeBraille}  value={this.props.options.brailletbl} name="selectbraille"
           autoFocus
           ref={this.props.focusref}>
           
        
        {this.state.brailleinfo.map ((item, index)=> {
                 if (index === this.props.options.brailletbl)
                   return (<option  aria-selected='true' key={index} value={index}>{item.lang + " - " + item.desc}</option>);
                 else
                   return (<option  aria-selected='false' key={index} value={index}>{item.lang + " - " + item.desc}</option>);
              })
             }
                   
        </select>

        </>
       );

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
                {this.render_braille_lang()}
                </div>
                <div className="pure-control-group">
                <label  htmlFor='nbcol' aria-label='Nombre de caractères par ligne'>
                  Nombre de caractères par ligne
                </label>
                  <input type="number" aria-label='Nombre de caractères par ligne' 
                    step="1" min="5" max="35" name="nbcol" id="nbcol"
                    value={this.props.options.nbcol} 
                    onChange={this.handleChangeNbCol} 
                   
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
                <div 
                >
                  
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
              <h2>{this.state.comevent}</h2>
              
              </div>


          
        );
    }
  }

  export default Parameters;