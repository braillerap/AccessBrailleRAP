import BrailleTranslator from "./BrailleTranslator";






class BrailleTranslatorLouis extends BrailleTranslator{
    constructor ()
    {
        super();
        this.louis = null;
        this.louis_tbl=0;
    }
   
    setUnknownCharInBrailleCallback (func)
    {
        this.UnknownCharInBraille = func;
    }    
    setLouis (louis)
    {
        this.louis = louis;
    }
    setTable (louis_tbl)
    {
        this.louis_tbl = louis_tbl;
    }
    getvalue ()
    {
        return (this.value);
    }    
    setvalue (value)
    {
        this.value = value;
    }

    getLines ()
    {
        return (this.lines);
    }

    getLinePadding ()
    {
        if (this.louis != null)
            if (this.louis.get_table_flags (this.louis_tbl) & 0x001 != 0)
                return 12;
            else
                return 10;
        return 12;
    }

    getBrailleLines ()
    {
        return (this.braille_lines);
    }
    

    

    translate ()
    {
        //console.log ("Translate TBFR2007");
        // split lines
        this.lines = this.src.split (/\r?\n/)
        this.braille_lines = new Array(this.lines.length);
        console.log (this.lines.length);
        for (let i = 0; i < this.lines.length; i++)
        {
            let line = this.lines[i];
            this.braille_lines[i] = this.louis.unicode_translate_string(line, this.louis_tbl);
            //console.log (this.lines[i]);
            //console.log (this.braille_lines[i]);
            
        }

        //console.log (this.braille_lines);

    }
}

export default BrailleTranslatorLouis;