
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
      //console.log ("BrailleView constructor ")

    }

    HandlePrec ()       
    {
      if (this.state.page > 0)
        this.setState ({page:this.state.page - 1});
    }

    HandleNext ()
    {
      //console.log (this.state.page);
      if (this.state.page < this.paginator.getPageNumber() - 1)
        this.setState ({page:this.state.page + 1});
    }

    HandleDownload ()
    {
      let geom = new BrailleToGeometry ();
      let ptcloud = geom.BraillePageToGeom (this.paginator.getPage (this.state.page), 5, 5);
      //console.log (typeof(ptcloud));
      let gcoder = new GeomToGCode ();
      gcoder.GeomToGCode (ptcloud);
      let gcode = gcoder.GetGcode ();
      //console.log (gcode);
      let blob = new Blob([gcode], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "braille.gcode"); 
    }
    HandlePrint ()
    {
      let geom = new BrailleToGeometry ();
      let ptcloud = geom.BraillePageToGeom (this.paginator.getPage (this.state.page), 5, 5);
      //console.log (typeof(ptcloud));
      let gcoder = new GeomToGCode ();
      gcoder.GeomToGCode (ptcloud);
      let gcode = gcoder.GetGcode ();
      //console.log (gcode);
      eel.PrintGcode (gcode, this.props.options.comport)

    }
    componentDidMount ()
    {
        
        this.cnt += 1;
        if (this.props.focusref)
          this.props.focusref.current.focus ();
    }

    fpageprec ()
    {
      if (this.paginator.getPageNumber() > 1 && this.state.page > 0)
        return (<button  className="pure-button pure-button-primary pad-button" onClick={this.HandlePrec}>Page précédente</button>);
      else
      return (<button  aria-label='bouton page précédente' disabled={true}   className="pure-button pure-button-primary pad-button" onClick={this.HandlePrec}>Page précédente</button>);
    }
    fpagenext ()
    {
      if (this.state.page + 1 < this.paginator.getPageNumber())
      return (<button  className="pure-button pure-button-primary pad-button" onClick={this.HandleNext}>Page suivante</button>);
      else
      return (<button  aria-label='bouton page suivante' disabled={true}  className="pure-button pure-button-primary pad-button" onClick={this.HandleNext}>Page suivante</button>);
    }
    render ()
    {
      this.Braille.setSrc (this.state.src);
      this.Braille.translate ();
 
      
      let linesb = this.Braille.getBrailleLines ();
      
      //console.log ("Braille pagination " + this.state.page.toString());
      if (! this.props.options)
      {
        this.paginator.setcols (this.props.options.nbcol);
        this.paginator.setrow (this.props.options.nbline);
      }  
      this.paginator.setSrcLines(linesb);
      this.paginator.Update ();
      //console.log ("brailleview " + this.state.page.toString());
      return (
                   
            
            <div>
            <label aria-label="Sélection de la page à imprimer : "></label>
            <h1 aria-hidden={true}>Sélection de la page à imprimer</h1>  
            <label aria-label="Boutons de commandes  : "></label>
            <div aria-live="polite" role="log" aria-relevant="all" aria-atomic={false}>
            {this.fpageprec()}
            {this.fpagenext()}
            <button aria-label="imprimer  : " ref={this.props.focusref} className="pure-button pure-button-primary pad-button" onClick={this.HandlePrint}>Imprimer</button>
            </div>
            <label aria-label="Informations  : "></label>
            
            <p aria-live="assertive" role="alert" aria-relevant="all" aria-atomic={true}>Page {this.state.page + 1} sur {this.paginator.getPageNumber()}</p>
            <PageDisplay pagenbr={this.state.page} pages={this.paginator} />  
            </div>
                      
        );
    }
  }
  
  export default BrailleView;