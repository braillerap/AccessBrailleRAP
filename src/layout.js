import { Outlet, Link } from "react-router-dom";

import React from 'react'

import './App.css';



const Layout = () => {
  return (
    <div className='main_div'>

      <header>
        <div className='pure-g'>
          <div className="pure-u-1-5 divblack"></div>
          <div className='pure-u-3-5 '>
            <div className="pure-menu pure-menu-horizontal menu_font" role={'presentation'} >
            <a href="https://www.braillerap.org" target="_blank"><span class="pure-menu-heading">BrailleRAP</span></a>
              <ul className="pure-menu-list">
                <li className="pure-menu-item ">
                  <Link to="/" className="pure-menu-link">
                    Saisie
                  </Link>

                </li>

                <li className="pure-menu-item">
                  <Link to="/impression" className="pure-menu-link">
                    Impression
                  </Link>
                </li>
                <li className="pure-menu-item">  
                  <Link to="/parametre" className="pure-menu-link">
                    Paramètres
                  </Link>
                </li>
                

              </ul>
            </div>
          </div>
          <div className="pure-u-1-5 divblack"></div>
        </div>
      </header>

      <main>
        <div className="pure-g main_layout">
          <div className="pure-u-1-5 divblack"></div>

          <div className="pure-u-3-5 divwhite">
            <div aria-live="assertive">
            <Outlet />
            </div>
          </div>
          <div className="pure-u-1-5 divblack"></div>
          
        </div>

      </main>
    
    
    </div >
  )
}

export default Layout;