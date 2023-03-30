

import BrailleTranslatorUEB from "./BrailleTranslatorUEB";
import BrailleTranslatorTBFR2007 from "./BrailleTranslatorTBFR2007";
import BrailleTranslatorLouis from "./BrailleTranslatorLouis";
class BrailleTranslatorFactory 
{
    getTranslator (transref, louis, louis_tbl)
    {
        switch (transref)
        {
            case 'TBFR2007':
                return new BrailleTranslatorTBFR2007 ();
                
            case 'UEB':    
                return new BrailleTranslatorUEB ();
            case 'LOUIS':
                let t = new BrailleTranslatorLouis();
                t.setLouis (louis);
                t.setTable (louis_tbl);
                return t;
            default:
                return new BrailleTranslatorTBFR2007 ();
        }   
    }
};

export default BrailleTranslatorFactory;

