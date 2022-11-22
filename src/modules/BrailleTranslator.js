

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
    
    
 
    translate ()
    {
    }
}

export default BrailleTranslator;