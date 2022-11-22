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
              <ul className="pure-menu-list" role={'presentation'}>
                <li className="pure-menu-item ">
                  <Link to="/" className="pure-button">
                    Saisie
                  </Link>

                </li>

                <li className="pure-menu-item">
                  <Link to="/braille" className="pure-button">
                    Braille
                  </Link>
                  <Link to="/parametre" className="pure-button">
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