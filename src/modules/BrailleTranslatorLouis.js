/**
 * \file            BrailleTranslatorLouis.js
 * \brief           Implement à Braille translator using liblouis
 */

/*
 * GNU GENERAL PUBLIC LICENSE
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS LICENSED UNDER
 *                  GNU GENERAL PUBLIC LICENSE
 *                   Version 3, 29 June 2007
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * This file is part of AccessBrailleRAP software.
 *
 * SPDX-FileCopyrightText: 2025-2026 Stephane GODIN <stephane@braillerap.org>
 * 
 * SPDX-License-Identifier: GPL-3.0 
 */


import BrailleTranslator from "./BrailleTranslator";

class BrailleTranslatorLouis extends BrailleTranslator{
    constructor ()
    {
        super();

        this.louis = null;
        this.louis_tbl=0;
        this.braille_lines = null;
        this.txt_lines = null;
        this.src = null;
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
        //console.log (this.braille_lines);
        return (this.braille_lines);
    }
    getTextLines ()
    {
        return (this.txt_lines);
    }

    translate (reverse)
    {
        // split lines
        let lines = this.src.split (/(\r?\n|\f)/)

        // remove cr / lf
        this.lines =[]
        for (let i = 0; i < lines.length; i++)
        {
            if (lines[i] !== "\n")
                this.lines.push (lines[i]);
        }
        
        this.braille_lines = new Array(this.lines.length);
        this.txt_lines = new Array(this.lines.length);
        
        for (let i = 0; i < this.lines.length; i++)
        {
            let formfeed = false;
            let line = this.lines[i];
            
            for (let i = 0; i < line.length; i++)
            {
                if (line[i] == "\f")
                {
                    formfeed = true;
                }
            }
            if (formfeed) { // the line contain ff only
                this.braille_lines[i] = '\f';
                this.txt_lines[i] = '\f';
            }
            else
            {
                this.braille_lines[i] = this.louis.unicode_translate_string(line, this.louis_tbl);
                this.txt_lines[i] = line;
            }
            
            if (reverse) // some language : ie ARABIC are ltr language but RTL in Braille
                this.braille_lines[i] = this.#reverse_string (this.braille_lines[i] );
        }
    }
    #reverse_string (str)
    {
        var rev = "";
        for (var i = str.length - 1; i >= 0; i--) {
            rev += str[i];
        }
        return rev;
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

export default BrailleTranslatorLouis;