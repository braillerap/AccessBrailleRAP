import React, { Component } from "react";
import { Outlet, Link } from "react-router-dom";
import { IntlContext } from './components/intlwrapper.js';
import { injectIntl } from 'react-intl';
import { FormattedMessage} from 'react-intl';
import { locales } from './components/locale.js';


import './App.css';


class Layout extends Component 
{
  static contextType = IntlContext;
  constructor (props)
  {
    super (props);

    this.onClickMenu = this.onClickMenu.bind(this);
  }

  onClickMenu ()
  {
    if (this.props.focuscb)
      this.props.focuscb ();
  }
  fstatus ()
  {
    if (this.props.status === 0)
      return (<p><FormattedMessage id="layout.print_not_progress" defaultMessage="Aucune impression en cours"/></p>);
    else
      return (
        <h2><FormattedMessage id="layout.print_in_progress" defaultMessage="Impression en cours"/></h2>
      )  ;
  }
  render ()
  {
      
      let direction = "ltr";
      if (this.context.localeinfo.dir)
        direction = this.context.localeinfo.dir;

      return (
        <div className='main_div' dir={direction}>

          <header>
            <div className='pure-g'>
              <div className="pure-u-1-5 headerside"></div>
              <div className='pure-u-3-5  headermain'>
                <div className="pure-menu pure-menu-horizontal menu_font" role={'presentation'} >
                <a href="https://www.braillerap.org" target="_blank"><span className="pure-menu-heading">BrailleRAP</span></a>
                  <nav>
                    <ul className="pure-menu-list" >
                      <li className="pure-menu-item ">
                        <Link to="/" className="pure-menu-link" 
                          onClick={this.onClickMenu}
                          
                          >
                          <FormattedMessage id="layout.param_input" defaultMessage="Saisie"/>  
                          
                        </Link>

                      </li>

                      <li className="pure-menu-item">
                        <Link to="/impression" className="pure-menu-link" onClick={this.onClickMenu}>
                          
                          <FormattedMessage id="layout.param_print" defaultMessage="Impression"/>
                        </Link>
                      </li>
                      <li className="pure-menu-item">  
                        <Link to="/parametre" className="pure-menu-link" onClick={this.onClickMenu}>
                          
                          <FormattedMessage id="layout.param_menu" defaultMessage="Paramètres"/>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="pure-u-1-5 headerside"></div>
            </div>
          </header>

          <main>
            <div className="pure-g main_layout">
              <div className="pure-u-1-5 bodyside"></div>

              <div className="pure-u-3-5 bodymain">
                <p>&nbsp;</p>
                <div aria-live={"polite"} aria-atomic={false} role={"log"} aria-relevant={"all"}>
                <Outlet />
                </div>
              </div>
              <div className="pure-u-1-5 bodyside"></div>
              
            </div>

          </main>
         
        
        </div >
      )
  }
}

export default injectIntl(Layout);