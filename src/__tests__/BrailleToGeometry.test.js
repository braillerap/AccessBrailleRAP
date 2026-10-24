import BrailleToGeometry from '../modules/BrailleToGeometry';

it ("BrailleCharToGeometry control point number", ()=> {
    
    let builder = new BrailleToGeometry ();
    let tchar = "⠁⠃⠙⠭⢏";

    for (let i = 0; i < tchar.length; i++)
    {
        let ret = builder.BrailleCharToGeom (tchar.charAt(i),0,0);
        expect(ret.length).toBeGreaterThan(i);
    }
});

it ("BrailleCharToGeometry point geometry", ()=> {
    
    let builder = new BrailleToGeometry ();
    const tchar = "⠭";
    let ret = builder.BrailleCharToGeom (tchar.charAt(0),0,0);
    const expect_coord = [
        {x:0, y:0},
        {x:0, y:2*builder.doty_padding},
        {x:builder.dotx_padding, y:0},
        {x:builder.dotx_padding, y:2*builder.dotx_padding},
    ];
    
    expect(ret.length).toEqual(4);
    for (let i = 0; i < ret.length; i++)
    {
        expect(ret[i].x).toEqual (expect_coord[i].x);
        expect(ret[i].y).toEqual (expect_coord[i].y);
    }
    
    
});

it ("BrailleCharToGeometry offset", ()=> {
    
    let builder = new BrailleToGeometry ();
    const tchar = "⠭";
    const offset = [
        {dx:5,dy:0},
        {dx:0,dy:5},
        {dx:25,dy:5},
        {dx:5,dy:25},
    ]
    for (let o = 0; o < offset.length; o++)
    {
        let ret = builder.BrailleCharToGeom (tchar.charAt(0),offset[o].dx,offset[o].dy);
        let expect_coord = [
            {x:offset[o].dx, y:offset[o].dy},
            {x:offset[o].dx, y:offset[o].dy + 2*builder.doty_padding},
            {x:offset[o].dx + builder.dotx_padding, y:offset[o].dy},
            {x:offset[o].dx + builder.dotx_padding, y:offset[o].dy + 2*builder.dotx_padding},
        ];
    
        expect(ret.length).toEqual(4);
        for (let i = 0; i < ret.length; i++)
        {
            expect(ret[i].x).toEqual (expect_coord[i].x);
            expect(ret[i].y).toEqual (expect_coord[i].y);
        }
    }
    
});