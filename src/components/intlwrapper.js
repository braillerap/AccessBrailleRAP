import React, {useState} from 'react';
import {IntlProvider} from 'react-intl';
import Arabic from '../translations/ar.json';
import Deutch from '../translations/de.json';
import English from '../translations/en.json';
import Spanish from '../translations/es.json';
import French from '../translations/fr.json';
import Dutch from '../translations/nl.json';
import Portuguese from '../translations/pt.json';
import Ukrainian from '../translations/uk.json';
import SimplifiedChineese from '../translations/zh_Hans.json';
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
        
        "menu":"menu-dark",
        "BrailleOutput":"BrailleOutput-dark",
        "ModalView":"ModalView-dark",
        "ModalBox":"ModalBox-dark"
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
        
        "menu":"menu",
        "BrailleOutput":"BrailleOutput",
        "ModalView":"ModalView",
        "ModalBox":"ModalBox"
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
       else if (newLocale === 'uk')
       {
            setMessages(Ukrainian);
       }
       else if(newLocale === 'zh-hans')
       {
            setMessages(SimplifiedChineese);
       }
       else if (newLocale === 'de')
       {
            setMessages(Deutch);
       }
       else if (newLocale === 'es')
       {
            setMessages(Spanish);
       }
       else if (newLocale === 'nl')
       {
            setMessages(Dutch);
       }
       else if (newLocale === 'pt')
       {
            setMessages(Portuguese);
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
        else if (lang === 'uk')
        {
            setMessages(Ukrainian);
        }
        else if(lang === 'zh-hans')
        {
                setMessages(SimplifiedChineese);
        }
        else if (lang === 'de')
        {
            setMessages(Deutch);
        }
        else if (lang === 'es')
        {
            setMessages(Spanish);
        }
        else if (lang === 'nl')
        {
            setMessages(Dutch);
        }
        else if (lang === 'pt') 
        {
            setMessages(Portuguese);
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