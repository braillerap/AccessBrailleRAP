class GeomPoint
{
    constructor (x = 0,y = 0)
    {
        this.x = x;
        this.y = y;
    }

    add (x,y)
    {
        this.x += x;
        this.y += y; 
    }

    add_op_point (rpt)
    {
        let pt = new GeomPoint (this.x + rpt.x, this.y + rpt.y);
        return pt;
    }
    add_op_coord (x,y)
    {
        let pt = new GeomPoint (this.x + x, this.y + y);
        return pt;
    }
    
    mul_op_scalar (a)
    {
        let pt = new GeomPoint (this.x * a, this.y * a);
        return (pt);
    }

    mul (a)
    {
        this.x = this.x * a;
        this.y = this.y * a;
    }
    
    add_geom (pt)
    {
        this.x += pt.x;
        this.y += pt.y;
    }
    
    getx()
    {
        return this.x;
    }
    
    gety()
    {
        return this.y;
    }
    

}

export default GeomPoint;