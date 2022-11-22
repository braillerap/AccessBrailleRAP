
import React from 'react';
import BrailleTranslatorFactory from '../modules/BrailleTranslatorFactory';
import BraillePaginator from '../modules/BraillePaginator';
import PageDisplay from './components/PageDisplay';
import BrailleToGeometry from '../modules/BrailleToGeometry';
import GeomToGCode from '../modules/GeomToGCode';
import FileSaver from 'file-saver';

import { eel } from "./../eel.js";

class BrailleView extends React.Component {
    
    constructor(props) {

      super(props);
      
      this.state = {
        txt: '',
        src: props.src, 
        page:0
      };
    
    
      this.cnt = 0;
      let f = new BrailleTranslatorFactory ();
      this.Braille = f.getTranslator("TBFR2007");
      this.paginator = new BraillePaginator ();
      this.HandlePrec = this.HandlePrec.bind(this);
      this.HandleNext = this.HandleNext.bind(this);
      this.HandlePrint = this.HandlePrint.bind (this);
      console.log ("BrailleView constructor ")

    }

    HandlePrec ()       
    {
      if (this.state.page > 0)
        this.setState ({page:this.state.page - 1});
    }

    HandleNext ()
    {
      console.log (this.state.page);
      if (this.state.page < this.paginator.getPageNumber() - 1)
        this.setState ({page:this.state.page + 1});
    }

    HandleDownload ()
    {
      let geom = new BrailleToGeometry ();
      let ptcloud = geom.BraillePageToGeom (this.paginator.getPage (this.state.page), 5, 5);
      console.log (typeof(ptcloud));
      let gcoder = new GeomToGCode ();
      gcoder.GeomToGCode (ptcloud);
      let gcode = gcoder.GetGcode ();
      console.log (gcode);
      let blob = new Blob([gcode], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "braille.gcode"); 
    }
    HandlePrint ()
    {
      let geom = new BrailleToGeometry ();
      let ptcloud = geom.BraillePageToGeom (this.paginator.getPage (this.state.page), 5, 5);
      console.log (typeof(ptcloud));
      let gcoder = new GeomToGCode ();
      gcoder.GeomToGCode (ptcloud);
      let gcode = gcoder.GetGcode ();
      console.log (gcode);
      eel.PrintGcode (gcode, this.props.options.comport)

    }
    componentDidMount ()
    {
        
        this.cnt += 1;
        
    }
    render ()
    {
      this.Braille.setSrc (this.state.src);
      this.Braille.translate ();
 
      
      let linesb = this.Braille.getBrailleLines ();
      
      console.log ("Braille pagination " + this.state.page.toString());
      this.paginator.setcols (this.props.options.nbcol);
      this.paginator.setrow (this.props.options.nbline);

      this.paginator.setSrcLines(linesb);
      this.paginator.Update ();
      console.log ("brailleview " + this.state.page.toString());
      return (
            
            
            
            <div >
            <label aria-label="Visualisation de la transcription Braille "></label>
            <h1 aria-hidden="true">Visualisation Braille</h1>  
            <label aria-label="Boutons de commandes: "></label>
            <button aria-label="page précédente " className="pure-button pure-button-primary pad-button" onClick={this.HandlePrec}>Page précédente</button>
            <button aria-label="page suivante " className="pure-button pure-button-primary pad-button" onClick={this.HandleNext}>Page suivante</button>
            <button aria-label="imprimer  " className="pure-button pure-button-primary pad-button" onClick={this.HandlePrint}>Imprimer</button>
            <label aria-label="Informations: "></label>
            <p aria-label='Page  {this.state.page + 1}'>Page {this.state.page + 1}</p>
            <PageDisplay pagenbr={this.state.page} pages={this.paginator} />  
            </div>
            
          
        );
    }
  }
  
  export default BrailleView;