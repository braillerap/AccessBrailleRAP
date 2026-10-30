import GeomPoint from "../modules/GeomPoint";

it ("GeomPoint test constructor", ()=> {
    let pt1 = new GeomPoint();
    expect(pt1.x).toEqual (0);
    expect(pt1.y).toEqual (0);

    const x1 = 25;
    const y1 = 47;
    let pt2 = new GeomPoint(x1, y1);
    expect(pt2.x).toEqual (x1);
    expect(pt2.y).toEqual (y1);

});

it ("GeomPoint test add", ()=> {
    const x1 = 25;
    const y1 = 47;
    const deltax = 33;
    const deltay = 77;

    let pt2 = new GeomPoint(x1, y1);
    
    expect(pt2.x).toEqual (x1);
    expect(pt2.y).toEqual (y1);

    pt2.add(deltax, deltay);
    
    expect(pt2.x).toEqual (x1 + deltax);
    expect(pt2.y).toEqual (y1 + deltay);
});

it ("GeomPoint test add_op_point", ()=> {
    const x1 = 25;
    const y1 = 47;
    const deltax = 33;
    const deltay = 77;

    let pt1 = new GeomPoint(x1, y1);
    let pt2 = new GeomPoint(deltax, deltay);

    let pt3 = pt1.add_op_point(pt2);

    
    expect(pt3.x).toEqual (x1 + deltax);
    expect(pt3.y).toEqual (y1 + deltay);
});

it ("GeomPoint test add_op_coord", ()=> {
    const x1 = 25;
    const y1 = 47;
    const deltax = 33;
    const deltay = 77;

    let pt1 = new GeomPoint(x1, y1);
    

    let pt3 = pt1.add_op_coord(deltax, deltay);

    expect(pt1.x).toEqual (x1);
    expect(pt1.y).toEqual (y1);
    expect(pt3.x).toEqual (x1 + deltax);
    expect(pt3.y).toEqual (y1 + deltay);
});

it ("GeomPoint test mul_op_scalar", ()=> {
    const x1 = 25;
    const y1 = 47;
    const scalar = 33;
    
    let pt1 = new GeomPoint(x1, y1);

    let pt3 = pt1.mul_op_scalar(scalar);

    expect(pt1.x).toEqual (x1);
    expect(pt1.y).toEqual (y1);
    expect(pt3.x).toEqual (x1 * scalar);
    expect(pt3.y).toEqual (y1 * scalar);
});

it ("GeomPoint test mul", ()=> {
    const x1 = 25;
    const y1 = 47;
    const scalar = 33;
    
    let pt1 = new GeomPoint(x1, y1);

    pt1.mul(scalar);

    expect(pt1.x).toEqual (x1 * scalar);
    expect(pt1.y).toEqual (y1 * scalar);
});

it ("GeomPoint test add_geom", ()=> {
    const x1 = 25;
    const y1 = 47;
    const x2 = 33;
    const y2 = 77;

    let pt1 = new GeomPoint(x1,y1);
    let pt2 = new GeomPoint(x2,y2);

    pt1.add_geom(pt2);

    expect(pt1.x).toEqual (x1+x2);
    expect(pt1.y).toEqual (y1+y2);
    
});