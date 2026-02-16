import BrailleTranslatorLouis from "./BrailleTranslatorLouis";
class BrailleTranslatorFactory 
{
    getTranslator (transref, louis, louis_tbl)
    {
        switch (transref)
        {
            case 'LOUIS':
                let t = new BrailleTranslatorLouis();
                t.setLouis (louis);
                t.setTable (louis_tbl);
                return t;
            default:
                let b = new BrailleTranslatorLouis();
                b.setLouis (louis);
                b.setTable (louis_tbl);
                return b;
        }   
    }
};

export default BrailleTranslatorFactory;

