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
    setSrc (txt)
    {
        //console.log (txt);
        this.src = txt
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
        console.log (this.braille_lines);
        return (this.braille_lines);
    }
    

    

    translate (reverse)
    {
        console.log (this.src);
        // split lines
        let lines = this.src.split (/(\r?\n|\f)/)
        //this.lines = this.src.split (/(\r?\n)/)
        console.log (lines);
        // remove cr / lf
        this.lines =[]
        for (let i = 0; i < lines.length; i++)
        {
            //this.lines[i] = this.lines[i].replace (/(\r?\n)/, "");
            if (lines[i] !== "\n")
                this.lines.push (lines[i]);
        }
        
        this.braille_lines = new Array(this.lines.length);
        
        
        for (let i = 0; i < this.lines.length; i++)
        {
            let formfeed = false;
            let formfeed_pos = [];
            let line = this.lines[i];
            
            for (let i = 0; i < line.length; i++)
            {
                
                if (line[i] == "\f")
                {
                    //console.log ("formfeed");
                    formfeed = true;
                    formfeed_pos = i;
                }
            }
            if (formfeed)
                this.braille_lines[i] = '\f'
            else
            {
                console.log ("t>" + line);
                this.braille_lines[i] = this.louis.unicode_translate_string(line, this.louis_tbl);
            }
            
            if (reverse) // some language : ie ARABIC are ltr language but RTL in Braille
                this.braille_lines[i] = this.#reverse_string (this.braille_lines[i] );
            
        }

        //console.log (this.braille_lines);

    }
    #reverse_string (str)
    {
        var rev = "";
        for (var i = str.length - 1; i >= 0; i--) {
            rev += str[i];
        }
        return rev;
    }
}

export default BrailleTranslatorLouis;