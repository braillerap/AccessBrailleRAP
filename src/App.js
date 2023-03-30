import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './layout'
import BrailleView from './pages/brailleview';
import Home from './pages/home'
import TextInput from './pages/textinput'
import BrailleTable from './pages/BrailleTable'
import Parameters from "./pages/parameters";
import "./App.css";

import { eel } from "./eel.js";

import AppOption from "./pages/components/AppOption";
import libLouis from "./modules/libLouisReact";

class App extends Component {
    constructor(props)
    {
        super(props);
        eel.set_host("ws://localhost:8888");
        //eel.hello();
        this.state= (
            {
                logstr : '',
                srctxt : '',
                options : AppOption

            }
        );
        this.LogCallBack = this.LogCallBack.bind(this);
        this.SetText = this.SetText.bind(this);
        this.SetNbLine = this.SetNbLine.bind(this);
        this.SetNbCol = this.SetNbCol.bind(this);
        this.SetComPort = this.SetComPort.bind(this);
        this.SetOption = this.SetOption.bind(this);

        this.louis = new libLouis();
    }
    componentDidMount ()
    {
      alert ("load");
      this.louis.load ();
      if (this.louis.isInit())
        alert ("liblouis ok");
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
      console.log (opt);
      this.setState ({option:opt});
      eel.gcode_set_parameters(opt);
    }
    LogCallBack (str)
    {
      this.setState ({logstr : this.state.logstr + str + '\r\n'});

    }
    render ()
    {
      return (
      <BrowserRouter>
            <Routes >
              <Route path="/" element={<Layout />}>
                <Route index element={<TextInput logger={this.LogCallBack} src={this.state.srctxt} textcb={this.SetText}/> } />
                <Route path="/braille" element={<BrailleView logger={this.LogCallBack} src={this.state.srctxt}/>} />
                <Route path="/parametre" element={<Parameters logger={this.LogCallBack} src={this.state.srctxt} 
                  options={this.state.options} nblinecb={this.SetNbLine} nbcolcb={this.SetNbCol} comportcb={this.SetComPort} optioncb={this.SetOption}/> } />

                <Route path="*" element={<TextInput logger={this.LogCallBack} src={this.state.srctxt} textcb={this.SetText}/>} />
              </Route>
            </Routes>
          </BrowserRouter>
      );
    }
}

export default App;
