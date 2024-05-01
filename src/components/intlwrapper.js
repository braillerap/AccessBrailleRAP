import React, {useState} from 'react';
import {IntlProvider} from 'react-intl';
import French from '../translations/fr.json';
import English from '../translations/en.json';
import Arabic from '../translations/ar.json';
import { locales } from '../components/locale.js';

export const IntlContext = React.createContext();

const _local = "fr"; //navigator.language;
let _lang = French;
let _localinfo = locales[1];

let _theme = "dark";
const _themedb = {
    "dark":{
        "main_div":"main_div_dark",
        "headermain":"headermain-dark",
        "headerside":"headerside-dark",
        "bodyside":"bodyside-dark",
        "bodymain":"bodymain-dark",
        "BrailleInput":"BrailleInput-dark",
        "pad-button":"pad-button-dark",
        "h1":"h1-dark",
        "general":"general-dark",
        "input":"input-dark",
        "menu-item":"menu-item-dark",
        "menu-link":"menu-link-dark",

        "menu":"menu-dark"
    },
    "light": {
        "main_div":"main_div",
        "headermain":"headermain",
        "headerside":"headerside",
        "bodyside":"bodyside",
        "bodymain":"bodymain",
        "BrailleInput":"BrailleInput",
        "pad-button":"pad-button",
        "h1":"h1",
        "general":"general",
        "input":"input",
        "menu-item":"menu-item",
        "menu-link":"menu-link",
        "menu":"menu"
    }

}

const IntlWrapper = (props) => {
   const [locale, setLocale] = useState(_local);
   const [messages, setMessages] = useState(_lang);
   const [localeinfo, setLocaleInfo] = useState(_localinfo);
   const [theme, setTheme] = useState (_theme);
   
   function selectLanguage(e) {
       const newLocale = e.target.value;
       setLocale(newLocale);
       if (newLocale === 'en') {
           setMessages(English);
       } 
       else if (newLocale === 'fr')
       {
            setMessages(French);
       } 
       else if (newLocale === 'ar')
       {
            setMessages(Arabic);
       
       }
       else
       {
            setMessages(English);
       }
   }

   function getStyleClass (styleclass)
   {
        //if (_themedb[theme].has (styleclass))
        return (_themedb[theme][styleclass]);
        console.log ("Error: unknown styleclass " + styleclass);
        return styleclass;
   }
   function setLanguage (lang)
   {
        setLocale(lang);
        if (lang === 'en') {
            setMessages(English);

        } else if (lang === 'fr')
        {
            setMessages(French);
        }
        else if (lang === 'ar')
        {
            setMessages(Arabic);
        }
        else
        {
            setMessages(English);
            lang = 'en';
        }
        locales.map ((item, index)=> {
            console.log (item);
            if (lang === item.lang)
            {
              setLocaleInfo (item);
              console.log ("set locale info" + item);
            }
            
        })
   }

   
   return (

       <IntlContext.Provider value = {{locale, localeinfo, theme, setTheme, selectLanguage, setLanguage, getStyleClass}}>
           <IntlProvider messages={messages} locale={locale} localeinfo={localeinfo}>
               {props.children}
           </IntlProvider>
       </IntlContext.Provider>
   );
}
export default IntlWrapper;