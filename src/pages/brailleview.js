
import React from 'react';
import BrailleTranslatorFactory from '../modules/BrailleTranslatorFactory';
import BraillePaginator from '../modules/BraillePaginator';
import PageDisplay from './components/PageDisplay';
import BrailleToGeometry from '../modules/BrailleToGeometry';
import GeomToGCode from '../modules/GeomToGCode';
import FileSaver from 'file-saver';
import Modal from 'react-modal';
import { FormattedMessage } from 'react-intl';
import { eel } from "../eel.js";



class BrailleView extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      txt: '',
      src: props.src,
      page: 0,
      showModal: false,
      comevent: "",
      printstatus:""
    };
    let louis = this.props.glouis();
    let f = new BrailleTranslatorFactory();
    this.Braille = f.getTranslator("LOUIS", louis, this.props.options.brailletbl);
    this.paginator = new BraillePaginator();
    this.HandlePrec = this.HandlePrec.bind(this);
    this.HandleNext = this.HandleNext.bind(this);
    this.HandlePrint = this.HandlePrint.bind(this);
    //console.log ("BrailleView constructor ")
    
  }
  componentDidMount() {
    // set focus on screen creation
    if (this.props.focusref)
      this.props.focusref.current.focus();
      
  }
  componentWillUnmount ()
  {
    if (this.timer)
      clearInterval(this.timer);
    if (this.props.glouis())
      this.props.glouis().lou_free ();
  }

  HandlePrec() {
    if (this.state.page > 0)
      this.setState({ page: this.state.page - 1 });
  }

  HandleNext() {

    //console.log (this.state.page);
    if (this.state.page < this.paginator.getPageNumber() - 1)
      this.setState({ page: this.state.page + 1 });
  }

  HandleDownload() {
    let geom = new BrailleToGeometry();
    let ptcloud = geom.BraillePageToGeom(this.paginator.getPage(this.state.page), 5, 5);
    //console.log (typeof(ptcloud));
    let gcoder = new GeomToGCode();
    gcoder.GeomToGCode(ptcloud);
    let gcode = gcoder.GetGcode();
    //console.log (gcode);
    let blob = new Blob([gcode], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, "braille.gcode");
  }

  StatusPrintEnd ()
  {
    if (this.timer)
      clearInterval(this.timer);
    this.setState({comevent:"Impression terminée " + this.state.printstatus});
  }

  HandlePrint() {
    // clear print status for screen reader
    this.setState({ comevent: "" });

    // build Braille GCODE for current page
    let geom = new BrailleToGeometry();
    let ptcloud = geom.BraillePageToGeom(this.paginator.getPage(this.state.page), 5, 5);
    let gcoder = new GeomToGCode();
    gcoder.GeomToGCode(ptcloud);
    let gcode = gcoder.GetGcode();
    
    // display modal status screen
    this.setState({ showModal: true });

    // request backend to print gcode
    eel.PrintGcode(gcode, this.props.options.comport)(status => {
        // remove modal status screen
        this.setState({ showModal: false, printstatus:status});
        // set a timer to call setstate with a little delay
        // because form change are disabled for screen reader due to
        // modal status box
        this.timer = setInterval(() => {
          this.StatusPrintEnd();
        }, 500);
      }
    );
  }
 
  

  fpageprec() {
    // display prev button according to page position
    if (this.paginator.getPageNumber() > 1 && this.state.page > 0)
      return (<button className="pure-button pad-button" onClick={this.HandlePrec}>
        
        <FormattedMessage id="print_button_prec" defaultMessage="Page précédente"/>
        </button>);
    else
      return (<button aria-label='bouton page précédente' disabled={true} className="pure-button pad-button" onClick={this.HandlePrec}>
        <FormattedMessage id="print_button_prec" defaultMessage="Page précédente"/>
        </button>);
  }
  fpagenext() {
    // display next button according to page position
    if (this.state.page + 1 < this.paginator.getPageNumber())
      return (<button className="pure-button pad-button" onClick={this.HandleNext}>
        <FormattedMessage id="print_button_next" defaultMessage="Page suivante"/>
        </button>);
    else
      return (<button aria-label='bouton page suivante' disabled={true} className="pure-button pad-button" onClick={this.HandleNext}>
        <FormattedMessage id="print_button_next" defaultMessage="Page suivante"/>
        </button>);
  }
  render() {
    this.Braille.setSrc(this.state.src);
    this.Braille.translate();

    let linesb = this.Braille.getBrailleLines();

    //console.log ("Braille pagination " + this.state.page.toString());
    
    if (this.props.options) {
      this.paginator.setcols(this.props.options.nbcol);
      this.paginator.setrow(this.props.options.nbline);
    }
    this.paginator.setSrcLines(linesb);
    this.paginator.Update();
    //console.log ("brailleview " + this.state.page.toString());
    return (


      <div>

        <Modal
          isOpen={this.state.showModal}
          contentLabel=""
          aria = {{hidden:false, label:' '}}
        >
          <div aria-hidden={false} className='ModalView'>
            <label aria-label=' '></label>
            <br/>
            <label aria-label='Impression en cours'>
            <FormattedMessage id="print.printinprogress" defaultMessage="Impression en cours"/>
              </label>
            <br/>
            <label aria-label='Merci de patienter'>
            <FormattedMessage id="print.printwait" defaultMessage="Merci de patienter"/>
              </label>

          </div>
        </Modal>
        <label aria-label="Sélection de la page à imprimer : "></label>
        <h1 aria-hidden={true}>
        <FormattedMessage id="print.printselectpage" defaultMessage="Sélection de la page à imprimer"/>
          </h1>

        <label aria-label="Boutons de commandes  : "></label>
        <div aria-live="polite" role="log" aria-relevant="all" aria-atomic={false} className="menu_font">
          
          {this.fpageprec()}
          {this.fpagenext()}
          <button
            aria-label="imprimer "
            ref={this.props.focusref}
            className="pad-button pure-button"
            onClick={this.HandlePrint}
          >Imprimer
          </button>
        </div>
        <label aria-label="Informations "></label>

        <p aria-live="polite" role="log" aria-relevant="all" aria-atomic={true}>Page {this.state.page + 1} sur {this.paginator.getPageNumber()}</p>
        <p aria-live="polite" role="log" aria-relevant="all" aria-atomic={true}>{this.state.comevent}</p>

        <PageDisplay pagenbr={this.state.page} pages={this.paginator} />
      </div>

    );
  }
}

export default BrailleView;