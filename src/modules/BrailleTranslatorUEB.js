import BrailleTranslator from "./BrailleTranslator";

const BrailleControl = {
    PREFIX_CAPITAL    : 1,
    PREFIX_MATH       : 2,
    SUFFIX_ENDCAPITAL : 4,
    SUFFIX_ENDMATH    : 8,
    PREFIX_DOUBLE_CAPITAL : 16,
    SUFFIX_END_DOUBLE_CAPITAL : 32,
};

const BRAILLE_special = {
    1 : '⠨',
    2 : '⠠',
    4 : '',
    8 : '',
    16: '⠨⠨',
    32: ''
};

const BRAILLE = {
    ' ': '⠀',   
    '_': '⠤',
    '-': '⠤',
    ',': '⠂',
    ';': '⠰',
    ':': '⠒',
    '!': '⠖',
    '?': '⠢',
    '.': '⠲',
    '(': '⠦',
    '[': '⠘⠦',
    ']': '⠴⠃',
    '#': '⠐⠼',
    ')': '⠴',
    
    '@': '⠜',
    
    '/': '⠌',
    '\'': '⠄',
    '"': '⠶',
    
    '\\': '⠳',
    
    'µ': '⠘⠍',
    '$': '⠘⠎',
    '&': '⠐⠿',
    '€': '⠘⠑',
    
    '%': '⠩',
    '^': '⠘',
    '+': '⠖',
    '<': '⠣',
    '>': '⠜',
    '*': '⠔',
    '÷': '⠒',
    '=': '⠶',

    '0': '⠼',
    '1': '⠡',
    '2': '⠣',
    '3': '⠩',
    '4': '⠹',
    '5': '⠱',
    '6': '⠫',
    '7': '⠹',
    '8': '⠳',
    '9': '⠪',

    'A': '⠁',
    'B': '⠃',
    'C': '⠉',
    'D': '⠙',
    'E': '⠑',
    'F': '⠋',
    'G': '⠛',
    'H': '⠓',
    'I': '⠊',
    'J': '⠚',
    'K': '⠅',
    'L': '⠇',
    'M': '⠍',
    'N': '⠝',
    'O': '⠕',
    'P': '⠏',
    'Q': '⠟',
    'R': '⠗',
    'S': '⠎',
    'T': '⠞',
    'U': '⠥',
    'V': '⠧',
    'W': '⠺',
    'X': '⠭',
    'Y': '⠽',
    'Z': '⠵',

    'a': '⠁',
    'b': '⠃',
    'c': '⠉',
    'd': '⠙',
    'e': '⠑',
    'f': '⠋',
    'g': '⠛',
    'h': '⠓',
    'i': '⠊',
    'j': '⠚',
    'k': '⠅',
    'l': '⠇',
    'm': '⠍',
    'n': '⠝',
    'o': '⠕',
    'p': '⠏',
    'q': '⠟',
    'r': '⠗',
    's': '⠎',
    't': '⠞',
    'u': '⠥',
    'v': '⠧',
    'w': '⠺',
    'x': '⠭',
    'y': '⠽',
    'z': '⠵',

    'ç':'⠯',
    'é':'⠿',
    'à':'⠷',
    'è':'⠮',
    'ù':'⠾',
    'â':'⠡',
    'ê':'⠣',
    'î':'⠩',
    'ô':'⠹',
    'û':'⠱',
    'ë':'⠫',
    'ï':'⠻',
    'ü':'⠳',
    'œ':'⠪'
    
    
    
    
};

class BrailleTranslatorUEB extends BrailleTranslator {
    
   

    convert_special (c)
    {
        //console.log ("special : ");
        //console.log(BRAILLE_special);
        if (c in BRAILLE_special)
        {
            
            //console.log (c + " " + BRAILLE_special[c]);
            return (BRAILLE_special[c]);
        }
        else
        {
            //console.log ("unknown special " + c);
            if (this.UnknownCharInBraille)
                this.UnknownCharInBraille (c);
            return '';    
        }    
    }
    convert (c)
    {
        if (BRAILLE.hasOwnProperty (c))
            return (BRAILLE[c]);
        else
        {
            if (this.UnknownCharInBraille)
                this.UnknownCharInBraille (c);
            return '';    
        }
    }

    transcript (word)
    {
        let output = "";
        let mathmarquer = -1;
        let capitalmarquer = -1;
        let math_reg = /[0-9]/;
        let capital_reg = /[A-Z]/;
        let prefix = new Array(word.length);
        let suffix = new Array(word.length);

        prefix.fill (0);
        suffix.fill (0);

        for (let i =0; i < word.length; i++)
        {
            if (math_reg.test(word[i]) && mathmarquer === -1)
            {
                mathmarquer = i;
            }
            else if (! math_reg.test(word[i]) && mathmarquer !== -1)
            {
                // do something with prefix and suffix
                prefix[mathmarquer] =  BrailleControl.PREFIX_MATH;
                suffix[i-1] = BrailleControl.SUFFIX_ENDMATH;
                mathmarquer = -1;       
            }
        }
        if (mathmarquer !== -1)
        {
            prefix[mathmarquer] =  BrailleControl.PREFIX_MATH;
            suffix[word.lenth - 1] = BrailleControl.SUFFIX_ENDMATH;
        }

        for (let i = 0; i < word.length; i++)
        {
            if (capital_reg.test (word[i])  && capitalmarquer === -1)
            {
                capitalmarquer = i;
            }
            else if (! capital_reg.test (word[i]) && capitalmarquer !== -1)
            {
                for (let p = capitalmarquer; p < i; p++)
                    prefix[p] = BrailleControl.PREFIX_CAPITAL;
                
                capitalmarquer = -1;
            }
          
        }
        if (capitalmarquer !== -1)
        {
            if (capitalmarquer !== 0)
            {
                for (let p = capitalmarquer; p < word.length; p++)
                    prefix[p] =  BrailleControl.PREFIX_CAPITAL;
                    suffix[word.lenth - 1] = BrailleControl.SUFFIX_ENDCAPITAL;
            }
            else
            {
                prefix[0] =                 BrailleControl.PREFIX_DOUBLE_CAPITAL;
                suffix[word.lenth - 1] =    BrailleControl.SUFFIX_END_DOUBLE_CAPITAL;
            }
        }

        //console.log (prefix);
        //console.log (suffix);
        for (let i = 0; i < word.length; i++)
        {
            if(prefix[i] !== 0)
                output += this.convert_special (prefix[i]);
            output += this.convert (word[i])
            if (suffix[i] !== 0)
                output += this.convert_special (suffix[i]);
        }

        return (output);
    }

    translate ()
    {
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
                    this.braille_lines[i] += ' ';
            }
            //console.log (this.braille_lines[i]);
        }

        //console.log (this.braille_lines);

    }
}

export default BrailleTranslatorUEB;