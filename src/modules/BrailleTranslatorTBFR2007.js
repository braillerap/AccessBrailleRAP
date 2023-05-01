import BrailleTranslator from "./BrailleTranslator";
import tbfr2007 from "./tbfr2007";





class BrailleTranslatorTBFR2007 extends BrailleTranslator{
    
   
    setUnknownCharInBrailleCallback (func)
    {
        this.UnknownCharInBraille = func;
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

    getBrailleLines ()
    {
        return (this.braille_lines);
    }

    getLinePadding ()
    {
        return 12;
    }
    

    transcript (word)
    {
        let output = '';

        for (let i =0; i < word.length; i++)
        {
            let ascii = word.charCodeAt (i);
            if (ascii < 0 || ascii > 255)
            {
                if (this.UnknownCharInBraille)
                    this.UnknownCharInBraille (word[i]);
            }
            else
            {
                output += tbfr2007[ascii].char;
            }
        }    
        return (output);
    }

    translate ()
    {
        //console.log ("Translate TBFR2007");
        // split lines
        this.lines = this.src.split (/\r?\n/)
        this.braille_lines = new Array(this.lines.length);

        for (let i = 0; i < this.lines.length; i++)
        {
            let line = this.lines[i];
            this.braille_lines[i] = '';
            let words = line.split (' ');

            for (let w = 0; w < words.length; w++)
            {
                let tmp = this.transcript (words[w]);
                //console.log (words[w] + ":" + tmp);
                this.braille_lines[i] += tmp;
                if (w < words.length - 1)
                    this.braille_lines[i] += this.transcript (' ');
            }
            //console.log (this.braille_lines[i]);
        }

        //console.log (this.braille_lines);

    }
}

export default BrailleTranslatorTBFR2007;