

class BrailleTranslator {
    
    constructor ()
    {
        this.src = "";
        this.lines = [];
        this.braille_lines = [];
        this.UnknownCharInBraille = null
    }

    setSrc (txt)
    {
        this.src = txt
    }
    
    setUnknownCharInBrailleCallback (func)
    {
        this.UnknownCharInBraille = func;
    }    


    getLines ()
    {
        return (this.lines);
    }

    getBrailleLines ()
    {
        return (this.braille_lines);
    }
    
    getLinePadding ()
    {
        return 10;
    }
 
    translate ()
    {
    }

    back_translate_single_string (brailletext)
    {
        let tr = this.louis.unicode_back_translate_string(brailletext, this.louis_tbl);
        return tr;
    }

    translate_single_string (blacktext)
    {
        let tr = this.louis.unicode_translate_string(blacktext, this.louis_tbl);
        return tr;
    }
}

export default BrailleTranslator;