
class BraillePaginator 
{
    constructor()
    {
        this.cols = 28;
        this.rows = 21;
        this.computedrows = 21;
        this.spacing = 0;
        this.pages = [];
        this.pagenbr = 0;
        this.src = [];
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
    setSrcLines (lines)
    {
        this.src = lines;
    }
    #addline (line)
    {
        this.current_page.push (line);
        if (this.current_page.length >= this.computedrows)
        {
            this.pages.push (this.current_page);
            this.current_page = [];
        }
    }
    #flushline ()
    {
        if (this.current_page && this.current_page.length > 0)
        this.pages.push (this.current_page);
        this.current_page = [];
    }
    #computerows ()
    {
        this.computedrows = Math.floor (this.rows / ((this.spacing * 0.5) + 1));
    }
    Update ()
    {
        if (! this.src)
            return;

        this.pages = [];
        this.current_page = [];
        this.#computerows();
        
        for (let lsrc = 0; lsrc < this.src.length; lsrc++)
        {
            let words = this.src[lsrc].split (String.fromCharCode(0x2800));    
            console.log (words);
            let current_line ='';
            for (let w = 0; w < words.length; w++)
            {
                if (words[w].length + current_line.length >= this.cols)
                {
                    if (current_line.length > 0)   // create a line
                    {
                        //console.log ("add :"+ current_line);
                        this.#addline (current_line);
                        
                        if (words[w].length < this.cols)
                        {
                            current_line = words[w];    
                            current_line += String.fromCharCode(0x2800);  
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
                                
                                this.#addline (current_line);
                                start = 0;
                            }
                            current_line = "";
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
                            //console.log ("+" +  l.toString() + "+" + current_line);
                            this.#addline (current_line);
                            start = 0;
                        }
                        current_line = "";
                    }
                    
                }
                else
                {
                    current_line += words[w];
                    current_line += String.fromCharCode(0x2800);
                    //console.log (current_line)  ;
                }
            }   
            if (current_line !== '')
            {
                //console.log ("add final:"+ current_line);
                this.#addline(current_line); 
                current_line = '';
            
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
    getPages ()
    {
        return (this.pages);
    }
}

export default BraillePaginator;