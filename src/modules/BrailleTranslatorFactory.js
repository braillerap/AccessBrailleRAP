

import BrailleTranslatorUEB from "./BrailleTranslatorUEB";
import BrailleTranslatorTBFR2007 from "./BrailleTranslatorTBFR2007";

class BrailleTranslatorFactory 
{
    getTranslator (transref)
    {
        switch (transref)
        {
            case 'TBFR2007':
                return new BrailleTranslatorTBFR2007 ();
                
            case 'UEB':    
                return new BrailleTranslatorUEB ();
            
            default:
                return new BrailleTranslatorTBFR2007 ();
        }   
    }
};

export default BrailleTranslatorFactory;

