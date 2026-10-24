it ("JS indexOf() with unicode Braille", ()=> {
    let main = "⠨⠑⠎⠎⠁⠊";
    let sub = "⠁⠊";

    expect (main.indexOf(sub, 0)).toEqual(4);
   
    
});