import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './layout'
import BrailleView from './pages/brailleview';
import TextInput from './pages/textinput'
import Parameters from "./pages/parameters";
import './App.css';

import AppOption from "./pages/components/AppOption";
import libLouis from "./modules/WrapLibLouisReact.js";
import { FormattedMessage } from "react-intl";
import { IntlContext } from './components/intlwrapper.js';


class App extends Component {
  static contextType = IntlContext;

    constructor(props)
    {
        super(props);
        
        this.state= (
            {
                logstr : '',
                srctxt : '',
                options : AppOption,
                serialstatus:0,
                louisloaded:false,
                webviewready:false
            }
        );

        // attach methods to instance
        this.LogCallBack = this.LogCallBack.bind(this);
        this.SetText = this.SetText.bind(this);
        this.SetNbLine = this.SetNbLine.bind(this);
        this.SetNbCol = this.SetNbCol.bind(this);
        this.SetComPort = this.SetComPort.bind(this);
        this.SetOption = this.SetOption.bind(this);
        this.onMenuClick = this.onMenuClick.bind (this);    
        this.GetLouis = this.GetLouis.bind(this);
        this.LouisLoaded = this.LouisLoaded.bind (this);
        this.webviewloaded = this.webviewloaded.bind(this);
        this.webviewloadedSec = this.webviewloadedSec.bind(this);
        
        // create reference for focus setting
        this.focusReference = React.createRef();
    }
    
    async webviewloadedSec ()
    {
      console.log ("pywebview loaded timer");
      if (window.pywebview.state)
        console.log (window.pywebview.state); 
      {
        console.log ("pywebviewready event");
        
        window.pywebview.state = {};
        let option = await window.pywebview.api.gcode_get_parameters();
        console.log (option);
        let params = JSON.parse(option);

        this.setState({webviewready:true});
        console.log (navigator.language);
        if (params.lang === "")
        {
            params.lang = "fr";
            this.SetOption (params);
        }
        else
          this.setState ({options:params})
        this.context.setLanguage (params["lang"]);
        this.context.setTheme(params["theme"]);
        this.louis = new libLouis();
        this.louis.load (this.LouisLoaded);
        
      }
      
    }

    async webviewloaded ()
    {
      console.log ("pywebview loaded std");
      if (window.pywebview.state)
        console.log ("state:", window.pywebview.state); 
      else
          window.pywebview.state = {};
      
      if (window.pywebview.state) {
        console.log ("pywebviewready event");

        // kill check timer if event received
        if (this.timerload)
            clearInterval (this.timerload);

        // load app config
        let option = await window.pywebview.api.gcode_get_parameters();
        console.log ("option", option);
        let params = JSON.parse(option);

        this.setState({webviewready:true});
        console.log (navigator.language);
        if (params.lang === "")
        {
            params.lang = "fr";      // set default language
            this.SetOption (params); // set default option
        }
        else
          this.setState ({options:params})
          
        this.context.setLanguage (params["lang"]);
        this.context.setTheme(params["theme"]);
        
        // load liblouis web assembly
        this.louis = new libLouis();
        this.louis.load (this.LouisLoaded);
        
      }
      
    }
    async componentDidMount ()
    {
      console.log ("componentDidMount event");
      if (window.pywebview)  
      {
        console.log ("direct event call");
        this.webviewloaded(); // direct call we are late to register event
      }
      else
      {
          console.log ("register pywebview event");  
          window.addEventListener('pywebviewready', this.webviewloaded);
          // start a timer to secure loading
          this.timerload = setInterval (()=> {
            console.log ("check loaded");
            if (window.pywebview)
            {
                clearInterval (this.timerload);
                console.log ("webview detected on timer");
                this.webviewloadedSec ();
            }
          }, 30000
          );
      }
      
    }
    componentWillUnmount () 
    {
        if (this.timerload)
            clearInterval (this.timer);
    }
    onMenuClick ()
    {
        if (this.focusReference)
          this.focusReference.current.focus ();
    }
   
    SetText (str)
    {
      this.setState ({srctxt :str});
    }
    SetNbLine (nbline)
    {
      this.setState ({nbline :nbline});
    }
    SetNbCol (nbcol)
    {
      this.setState ({nbcol:nbcol});
    }
    SetComPort (comport)
    {
      this.setState ({comport:comport});
    }
    SetOption (opt)
    {
      console.log ("theme received " + opt.theme.toString());
      console.log ("option received " + opt.toString());
      this.setState ({option:opt});
      window.pywebview.api.gcode_set_parameters (opt);
    }
    SetStatus (status)
    {
      this.setState({serialstatus: status})
    }
    LogCallBack (str)
    {
      this.setState ({logstr : this.state.logstr + str + '\r\n'});

    }
    LouisLoaded (success)
    {
      // set louis loglevel to LOG_OFF
      this.louis.lou_setLogLevel(60000);

      // signal liblouis is loaded and ok
      this.setState({louisloaded:success});
    }
    GetLouis()
    {
      return this.louis;
    }
    render ()
    {
      if (! this.state.webviewready)
        return (
        <h1>
          <FormattedMessage id="app.loading" defaultMessage="Waiting webview..."/>
        </h1>);

      if (! this.state.louisloaded)
        return (
        <h1>
          <FormattedMessage id="app.loading" defaultMessage="Chargement..."/>
        </h1>);

      return (
      
        <BrowserRouter>
            <Routes >
              <Route path="/" element={<Layout focuscb={this.onMenuClick} status={this.state.serialstatus}/>}>
                <Route index element={<TextInput logger={this.LogCallBack} src={this.state.srctxt} textcb={this.SetText} options={this.state.options} focusref={this.focusReference}/> } />
                <Route path="/impression" element={<BrailleView logger={this.LogCallBack} src={this.state.srctxt} glouis={this.GetLouis}
                    options={this.state.options} focusref={this.focusReference} statuscb={this.SetStatus}/>} />
                <Route path="/parametre" element={<Parameters logger={this.LogCallBack} src={this.state.srctxt} glouis={this.GetLouis}
                   options={this.state.options} nblinecb={this.SetNbLine} nbcolcb={this.SetNbCol} comportcb={this.SetComPort} optioncb={this.SetOption} focusref={this.focusReference}/> } />

                <Route path="*" element={<TextInput logger={this.LogCallBack} src={this.state.srctxt} textcb={this.SetText} options={this.state.options} focusref={this.focusReference}/>} />
              </Route>
            </Routes>
          </BrowserRouter>
      
      );
    }
}

export default App;
