import GeomPoint from "./GeomPoint";

const _dots = [
     {x:0, y:0},
     {x:0, y:1},
     {x:0, y:2},
     {x:1, y:0},
     {x:1, y:1},
     {x:1, y:2},
     {x:0, y:3},
     {x:1, y:3},
];

const PORTRAIT = 0;
const LANDSCAPE = 1;

class BrailleToGeometry
{
    constructor ()
    {
        this.dotx_padding = 2.2;
        this.doty_padding = 2.2;
        this.char_paddingx = 6;
        this.char_paddingy = 12;
        this.nb_cols = 0;
        this.nb_lines = 0;
        this.xmax = 100;

        this.orientation = LANDSCAPE;
        
    }

    BrailleCharToGeom (char, offsetx, offsety)
    {
        let val = char.charCodeAt (0);
        let pts = [];

        for (let i = 0; i < 8; i++)
        {
            if ((val & (1 << i)) !== 0)
            {
                let pt = new GeomPoint(_dots[i]['x'] * this.dotx_padding + offsetx, 
                    _dots[i]['y'] * this.doty_padding + offsety);
                
                
                pts.push (pt);
            }
        }
        
        return (pts);
    }
    
    setPaddingY (value)
    {
        this.char_paddingy = value;
    }

    setOrientation (o)
    {
        if (o === PORTRAIT || o === LANDSCAPE)
            this.orientation = o;
        console.log ("Orientation:", this.orientation);
    }
    
    setGeometry (nbcols, nblines, xmax)
    {
        console.log ("setGeometry", nbcols, nblines)
        this.nb_cols = nbcols;
        this.nb_lines = nblines;
        this.xmax = xmax;
    }
    SortGeom (geom)
    {
        geom.sort (function (a,b) {
			if (a.y === b.y) return (a.x - b.x);
			return (a.y - b.y);
		});
        return geom;
    }
    SortGeomZigZag (inputgeom)
    {
        let i;
		let s = 0;
		let e = 0;
		let dir = 1;
		let tmp = [];
		let sorted = [];
        let geom = [];
		

        const sort_predicate_y = (a,b) => {
            if (a.y === b.y) 
                return ((a.x - b.x) * dir);
			return (a.y - b.y);
        }
		
        if (inputgeom == null)
			return (sorted);

        for (let i=0; i < inputgeom.length; i++)
        {
            geom.push (inputgeom[i]);
        }
        
        geom.sort (sort_predicate_y);
        e = 0;
		while (e < geom.length)
		{
            //console.log ("e=" + e.toString() + " s=" + s.toString() + " geom.length=" + geom.length.toString());
            //console.log ("geom[s]=" + geom[s].y.toString() + " geom[e]=" + geom[e].y.toString());
            
            while (geom[s].y === geom[e].y)
			{
            	e++;
				if (e === (geom.length))
				{
						break;
				}
			}
            //console.log ("e=" + e.toString() + " s=" + s.toString());    
			{
				for (i = s; i < e; i++)
				{
                    tmp.push (geom[i]);
				}
				tmp.sort (sort_predicate_y);

				for(i = 0; i < tmp.length; i++)
					sorted.push (tmp[i]);
				tmp = [];
				dir = - dir;

				s = e;
			}
			
		}
		return (sorted);
    }

    BraillePageToGeom (lines, offsetx, offsety)
    {
        
        let starty = offsety;
        let geom = [];
        
        for (let l = 0; l < lines.length; l++)
        {
            let startx = offsetx;
            let line = lines[l];

            for (let c = 0; c < line.length; c++)
            {
                let pts = this.BrailleCharToGeom (line[c], startx, starty);
                geom = geom.concat (pts);
                startx += this.char_paddingx;
            }
            starty += this.char_paddingy;
        }
        
        if (this.orientation === LANDSCAPE)
        {
            let landcoord_x = new GeomPoint (0,1);
            let landcoord_y = new GeomPoint (-1,0);

            //let land_offset = new GeomPoint(this.nb_lines * this.char_paddingx, 0)
            let land_offset = new GeomPoint(this.xmax, 0)
            console.log ("land_offset", land_offset);

            for (let i = 0; i < geom.length; i++)
            {
                let pt = geom[i];
                //console.log ("type", typeof(pt));
                //console.log ("pt from geom", pt, pt.x, pt.y);
                let xv = landcoord_x.mul_op_scalar(pt.x);
                let yv = landcoord_y.mul_op_scalar(pt.y);
                //console.log ("xv,yv", xv,yv);
                let lpt = new GeomPoint (xv.x + yv.x, xv.y + yv.y);
                lpt.add_geom (land_offset);
                geom[i] = lpt;
                //console.log ("Geom Point=" + lpt.x.toString() + " " + lpt.y.toString());
            }
        }
        
        this.SortGeom(geom);
        //console.log (geom);
        let sorted = this.SortGeomZigZag(geom);
        //console.log (sorted);
        

        return sorted;
    }
   
}

export default BrailleToGeometry;