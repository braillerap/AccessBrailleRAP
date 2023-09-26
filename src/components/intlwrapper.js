import React, {useState} from 'react';
import {IntlProvider} from 'react-intl';
import French from '../translations/fr.json';
import English from '../translations/en.json';
import Arabic from '../translations/ar.json';
import { locales } from '../components/locale.js';

export const IntlContext = React.createContext();

const local = "fr"; //navigator.language;
let lang = French;
let localinfo = locales[1];


const IntlWrapper = (props) => {
   const [locale, setLocale] = useState(local);
   const [messages, setMessages] = useState(lang);
   const [localeinfo, setLocaleInfo] = useState(localinfo);
   
   
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

       <IntlContext.Provider value = {{locale, localeinfo, selectLanguage, setLanguage}}>
           <IntlProvider messages={messages} locale={locale} localeinfo={localeinfo}>
               {props.children}
           </IntlProvider>
       </IntlContext.Provider>
   );
}
export default IntlWrapper;