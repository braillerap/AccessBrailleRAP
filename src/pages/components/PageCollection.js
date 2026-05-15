class BraillePaginator 
{
    constructor()
    {
        this.pages = [];
    }

    setPages (pages)
    {
        this.pages = pages;
    }
    getPages ()
    {
        return (this.pages);
    }
    getPage (n)
    {
        if (n < this.pages.length)
            return this.pages[n];
        return [];
    }
}