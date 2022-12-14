
class BraillePaginator 
{
    constructor()
    {
        this.cols = 28;
        this.rows = 21;
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

    setrow (rows)
    {
        this.rows = rows;
        this.Update ();
    }

    setSrcLines (lines)
    {
        this.src = lines;
    }
    #addline (line)
    {
        this.current_page.push (line);
        if (this.current_page.length >= this.rows)
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
    Update ()
    {
        if (! this.src)
            return;

        this.pages = [];
        this.current_page = [];

        for (let lsrc = 0; lsrc < this.src.length; lsrc++)
        {
            let words = this.src[lsrc].split (String.fromCharCode(0x2800));    
            let current_line ='';
            for (let w = 0; w < words.length; w++)
            {
                if (words[w].length + current_line.length >= this.cols)
                {
                    if (current_line.length > 0)   // create a line
                    {
                        //console.log ("add :"+ current_line);
                        this.#addline (current_line);
                        
                        current_line = words[w];                     
                    }        
                    else // we need to cut a long word
                    {
                        for (let l = 0; l < words[w].length; l+= this.cols)
                        {
                            current_line = words[w].substring (l, Math.min (l + this.cols, words[w].length - l));
                            this.#addline (current_line);
                        }
                    }
                    
                }
                else
                {
                    current_line += words[w];
                    current_line += String.fromCharCode(0x2800);
                      
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