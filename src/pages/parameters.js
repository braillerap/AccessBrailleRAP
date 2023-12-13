
import React from 'react';
import { json } from 'react-router-dom';
import { IntlContext } from '../components/intlwrapper.js';
import { injectIntl } from 'react-intl';
import { FormattedMessage} from 'react-intl';
import { locales } from '../components/locale.js';
//import { eel } from "../eel.js";

function  braille_info (fname, desc, lang, region, flags) {
  this.fname =fname;
  this.desc = desc;
  this.lang = lang;
  this.region = region;
  this.flags = flags;
}

class Parameters extends React.Component {

    static contextType = IntlContext;

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
        this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
        //console.log ("constructor");
    }

    async componentDidMount()
    {
      let list = await window.pywebview.api.gcode_get_serial();
      console.log (list)
      let portinfo = JSON.parse(list);
      this.setState ({data:portinfo})
     
      
      
      if (this.props.glouis())
      {
        let brtable = [];
        let louis = this.props.glouis();
        let nbr = this.props.glouis().get_table_nbr();
        for (let i = 0; i < nbr; i++)
        {
          let description = louis.get_table_description(i);
          let flags = louis.get_table_flags(i);
          //console.log (description + " " + typeof(flags) + " " + flags.toString(16));
          let br = new braille_info(
            louis.get_table_fname(i), 
            description,
            louis.get_table_lang(i), 
            louis.get_table_region(i),
            louis.get_table_flags (i)
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
      let msg = this.props.intl.formatMessage({id:"param.wait"});
      this.setState ({comevent:msg})
      window.pywebview.api.gcode_get_serial().then(list => {
          let portinfo = JSON.parse(list);
          let success = this.props.intl.formatMessage({id:"param.comportrefreshed"});
          this.setState ({data:portinfo, comevent:success})

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

    handleChangeLanguage (event)
    {
      let option = this.props.options
      option.lang = event.target.value;
      this.context.setLanguage (event.target.value);

      if (this.props.optioncb)
        this.props.optioncb(option);
      
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
          <p aria-hidden='true'><FormattedMessage id="param.nocomport" defaultMessage="Aucun port de communication"/></p>
        );
      else if (this.state.data.length === 0)
        return (
        <p aria-hidden='true'><FormattedMessage id="param.nocomport" defaultMessage="Aucun port de communication"/></p>
            );
      else  
      { 
        
        return (
        <>
        <p aria-hidden='true' toto-label={this.props.intl.formatMessage({id:"param.labelport"}) + this.props.options.comport + " : "} >
          <FormattedMessage id="param.labelport" defaultMessage="Port de communication"/> 
            <b>{this.state.options.comport}</b>
        </p>
        <label htmlFor='selectport'>
          <FormattedMessage id="param.labelport" defaultMessage="Port de communication"/> 
        </label>
        <select 
            className='selectbraille' 
            onChange={this.handleChangePort}  
            value={this.props.options.comport} 
            id="selectport"
            name="selectport">    
         
        {this.state.data.map ((line, index)=> {
                  if (line.device === this.props.options.comport)
                    return (<option  aria-selected='true' key={line.device} value={line.device}>{line.device} {line.description} </option>);
                  else
                    return (<option  aria-selected='false' key={line.device} value={line.device}>{line.device} {line.description} </option>);
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
        return (<p aria-hidden='true'><FormattedMessage id="param.nobrailletable" defaultMessage="Aucune table de transcription"/> </p>)
      }
      let selectedtable ="vide";
      if (this.state.options.brailletbl < this.state.brailleinfo.length)
        selectedtable = this.state.brailleinfo[this.state.options.brailletbl].desc;
      return (
        <>
        <p aria-hidden='true' toto-label={'Table de transcription ' + selectedtable + ' : '} >
          <FormattedMessage id="param.brailletable" defaultMessage="Table de transcription  "/>
          <b>{selectedtable}</b>
        </p>
        <label htmlFor='combobraille'>
        <FormattedMessage id="param.brailleselectlabel" defaultMessage="Table Braille"/>
          </label>
        <select className='selectbraille' 
            onChange={this.handleChangeBraille}  
            value={this.props.options.brailletbl} 
            name="combobraille"
            id="combobraille"
           
           ref={this.props.focusref}>
           
        
        {this.state.brailleinfo.map ((item, index)=> {
                 if (index === this.props.options.brailletbl)
                   return (<option  aria-selected='true' key={index} value={index}>{item.lang + " - " + item.desc }</option>);
                 else
                   return (<option  aria-selected='false' key={index} value={index}>{item.lang + " - " + item.desc }</option>);
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
            {this.props.intl.formatMessage({id:"param.wait"})}
          </div>
        );
      }  
        //console.log (this.state.data);
        //console.log ("type :" + typeof(this.state.data).toString());
        console.log (this.context);
        console.log (this.props.IntlContext);
        //const intl = this.props;
        let tat = this.props.intl.formatMessage({id:"param.langtitle"});
        //const tat ="toto";
      return (
            
              <div aria-live="polite" role="log" aria-relevant="all" aria-atomic={true}>
               
              <form 
                aria-label={this.props.intl.formatMessage({id:"param.form_aria"})}  
                className='formparam pure-form pure-form-aligned' 
                aria-live="assertive" 
                role="log" 
                aria-relevant="all" 
                aria-atomic={true}
                onSubmit={this.handleSubmit}
                >
                
                <fieldset>
                
                <h1>
                  <FormattedMessage
                    id = "param.header"
                    defaultMessage="Formulaire de paramétrage de l'application"
                  />
              </h1>
                <div className="pure-control-group">
                {this.render_braille_lang()}
                </div>
                <div className="pure-control-group">
                  <label  htmlFor='nbcol' aria-label={this.props.intl.formatMessage({id:"param.cols_aria"})}>
                  <FormattedMessage id="param.charperline" defaultMessage="Nombre de caractères par ligne"/>
                  </label>
                    <input type="number" aria-label={this.props.intl.formatMessage({id:"param.cols_aria"})} 
                      step="1" min="5" max="35" name="nbcol" id="nbcol"
                      value={this.props.options.nbcol} 
                      onChange={this.handleChangeNbCol} 
                    
                    />
                </div>
                <div className="pure-control-group">
                  <label  
                    aria-label={this.props.intl.formatMessage({id:"param.rows_aria"})} 
                    htmlFor='nbline'>
                    <FormattedMessage id="param.lineperpage" defaultMessage="Nombre de lignes par page"/>
                    
                  </label> 
                  <input  
                    aria-label={this.props.intl.formatMessage({id:"param.rows_aria"})}
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
                <div className='pure-control-group'>
                  
                    {this.render_comport()}
                    <button  
                      aria-label={this.props.intl.formatMessage({id:"param.button_refresh_com_aria"})} 
                      className="pure-button pad-button" 
                      onClick={this.handleRefreshPort}
                      >
                        <FormattedMessage id="param.buttonrefresh" defaultMessage="Actualiser"/>
                        
                    </button>      
                </div>

                <div className='pure-control-group'>
                  <p>
                  <FormattedMessage id="param.langtitle" defaultMessage="Langue de l'application "/>
                    
                    <b>{this.context.locale}</b></p>
                  <label  htmlFor='langid' aria-label={this.props.intl.formatMessage({id:"param.language_aria"})} >
                  <FormattedMessage id="param.langtitle" defaultMessage="Langue de l'application "/>
                  </label>
                  

                  <select id="langid"
                  value={this.context.locale} 
                  onChange={this.handleChangeLanguage}
                  >
                  {locales.map ((item, index)=> {
                    if (this.context.locale === item.lang)
                      return (<option  aria-selected={true} key={item.lang} value={item.lang}>{item.desc}</option>);
                    else
                      return (<option  aria-selected={false} key={item.lang} value={item.lang}>{item.desc}</option>);
              })
             }
                    
                    
                  </select>
                </div>
                </fieldset> 
             
                
              </form>
              <h2>{this.state.comevent}</h2>
              
              </div>


          
        );
    }
  }

  export default injectIntl(Parameters);