
class BraillePaginator 
{
    constructor()
    {
        this.cols = 28;
        this.rows = 21;
        this.computedrows = 21;
        this.spacing = 0;
        
        
        this.braille = [];      // braille translation
        this.txt_black = [];    // original text
        this.back_translate = []; // Braille back translated

        this.pages = [];        // paginated braille
        this.pages_black = [];
        this.pagenbr = 0;       // page count

        this.current_page = []; // current page
        this.current_page_black = []; // current page original text

        
        this.page_numbering = false;
        
        this.BrailleInBlackTextStrategy = null;
        this.BrailleBlackAlignmentStrategy = null;
    }

    setcols (cols)
    {
        this.cols = cols;
        this.Update ()
    }

    getcols ()
    {
        return (this.cols);
    }

    setrows (rows)
    {
        this.rows = rows;
        this.Update ();
    }

    setspacing (spacing)
    {
        this.spacing = spacing;
        this.Update ();
    }
    setBrailleLines (lines)
    {
        this.braille = lines;
    }
    setTxtBlackLines (lines)
    {
        this.txt_black = lines;
    }
    setPageNumbering (numbering)
    {
        this.page_numbering = numbering;
    }

    getPageNumbering ()
    {
        return this.page_numbering;
    }
    
    setBrailleInBlackTextStrategy (strategy)
    {
        this.BrailleInBlackTextStrategy = strategy;
    }

    setBrailleBlackAlignmentStrategy (strategy)
    {
        this.BrailleBlackAlignmentStrategy = strategy;
    }

    #addline (line, line_black)
    {
        
        this.current_page.push (line);
        this.current_page_black.push (line_black);
        if (this.current_page.length >= this.computedrows)
        {
            this.#addpage (this.current_page, this.current_page_black);
            
            this.current_page = [];
            this.current_page_black = [];
        }
    }
    #flushline ()
    {
        if (this.current_page && this.current_page.length > 0)
            this.#addpage (this.current_page, this.current_page_black);
        this.current_page = [];
        this.current_page_black = [];
    }
    #addpage (page, page_black)
    {
        if (this.page_numbering)
        {
            // add page number according to option
        }
        // add the page to pages collection
        this.pages.push (page);
        this.pages_black.push (page_black);
    }
    #computerows ()
    {
        this.computedrows = Math.floor (this.rows / ((this.spacing * 0.5) + 1));
        
        // if page numbering is enabled, reserve a row for page number
        if (this.page_numbering) 
        {
            this.computedrows = this.computedrows - 1;
        }
    }
    Update ()
    {
        if (! this.braille || ! this.txt_black)
            return;

        console.log (this.braille);
        console.log (this.txt_black);

        // init some vars
        this.pages = [];
        this.pages_black = [];
        this.current_page = [];
        this.current_page_black = [];
        
        this.#computerows();
        
        // process each Braille line in the document
        for (let lsrc = 0; lsrc < this.braille.length; lsrc++)
        {
            // split Braille line in words
            let words = this.braille[lsrc].split (String.fromCharCode(0x2800));    
            
            // split text in black in words
            //let words_black = this.txt_black[lsrc].split (/\s/);    
            let words_black = this.BrailleInBlackTextStrategy.getWords (words, this.txt_black[lsrc]);

            let current_line ='';
            let current_line_black ='';
            
            console.log ("compare words braille=", words.length, " black=", words_black.length);
            console.log ("compare words braille=", words);
            console.log ("compare words braille=", words_black);

            while (words_black.length < words.length)
                words_black.push ('🚫')

            for (let w = 0; w < words.length; w++)
            {
                if (words[w] === '\f')
                {
                    
                    this.#addline(current_line, current_line_black); 
                    current_line = '';
                    this.#flushline();
                    continue;

                }
                if (words[w].length + current_line.length >= this.cols)
                {
                    if (current_line.length > 0)   // create a line
                    {
                        //console.log ("add :"+ current_line);
                        this.#addline (current_line, current_line_black);
                        
                        if (words[w].length < this.cols)
                        {
                            current_line = words[w];    
                            current_line += String.fromCharCode(0x2800); 
                            console.log ("words_black[w]=", words_black[w], words[w]);
                            if (words[w].length > words_black[w].length)
                            {
                                
                                words_black[w] = words_black[w].padStart(words[w].length, ' ');
                                
                            }
                            current_line_black = words_black[w];
                            current_line_black += ' ';

                            //console.log (">" + current_line)  ;               
                        }
                        else // we need to cut a long word
                        {
                            current_line = '';
                            let start = current_line.length;
                            let cut = 1;
                            for (let l = 0; l < words[w].length; l += cut)
                            {
                                cut = Math.min (start + this.cols, words[w].length - l)
                                
                                current_line = words[w].substring (l, l + cut);
                                current_line_black = words_black[w].substring (l, l + cut);
                                this.#addline (current_line, current_line_black);
                                start = 0;
                            }
                            current_line = "";
                            current_line_black = "";
                        }
                    }        
                    else // we need to cut a long word
                    {
                        //console.log (">" + words[w]);
                        let start = current_line.length;
                        let cut = 1;
                        for (let l = 0; l < words[w].length; l += cut)
                        {
                            cut = Math.min (start + this.cols, words[w].length - l)
                            //console.log ("-" +  l.toString() + "-" + cut.toString());
                            current_line = words[w].substring (l, l + cut);
                            current_line_black = words_black[w].substring (l, l + cut);

                            //console.log ("+" +  l.toString() + "+" + current_line);
                            this.#addline (current_line, current_line_black);
                            start = 0;
                        }
                        current_line = "";
                        current_line_black = "";
                    }
                    
                }
                else
                {
                    current_line += words[w];
                    current_line += String.fromCharCode(0x2800);
                    if (words[w].length > words_black[w].length)
                    {
                        console.log ("av padding ", words_black[w].length, words_black[w], words[w]);
                        words_black[w] = words_black[w].padStart(words[w].length, ' ');
                        console.log ("after padding ", words_black[w].length, words_black[w]);
                    }
                    current_line_black += words_black[w];
                    current_line_black += " ";

                }
            }   
            if (current_line !== '')
            {
                //console.log ("add final:"+ current_line);
                this.#addline(current_line, current_line_black); 
                current_line = '';
                current_line_black = '';
            
            }
        }

        this.#flushline();
    }

    getPageNumber ()
    {
        if (this.pages)
            return this.pages.length;
        else
            return (0);    
    }

    getPage (n)
    {
        if (n < this.pages.length)
            return (this.pages[n])
        else
            return [];    
    }
    getPageBlack (n)
    {
        if (n < this.pages_black.length)
            return (this.pages_black[n])
        else
            return [];    
    }
    getPages ()
    {
        return (this.pages);
    }
}

export default BraillePaginator;