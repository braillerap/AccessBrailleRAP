import React, {useState} from 'react';
import {IntlProvider} from 'react-intl';
import French from '../translations/fr.json';
//import Arabic from '../lang/ar.json';
import English from '../translations/en.json';

export const IntlContext = React.createContext();

const local = "en"; //navigator.language;
let lang;
if (local === 'en') {
   lang = English;
}else {
   if (local === 'fr') {
       lang = French;
   } else {
       lang = Arabic;
   }
}
const IntlWrapper = (props) => {
   const [locale, setLocale] = useState(local);
   const [messages, setMessages] = useState(lang);
   
   
   function selectLanguage(e) {
       const newLocale = e.target.value;
       setLocale(newLocale);
       if (newLocale === 'en') {
           setMessages(English);
       } else {
           if (newLocale === 'fr'){
               setMessages(French);
           } else {
               setMessages(Arabic);
           }
       }
   }

   
   return (
       <IntlContext.Provider value = {{locale, selectLanguage}}>
           <IntlProvider messages={messages} locale={locale}>
               {props.children}
           </IntlProvider>
       </IntlContext.Provider>
   );
}
export default IntlWrapper;