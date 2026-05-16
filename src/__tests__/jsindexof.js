it ("JS indexOf()", ()=> {
    let main = "⠨⠑⠎⠎⠁⠊";
    let sub = "⠁⠊";

    expect (main.indexOf(sub, 0)).toEqual(4);
    console.log (main.indexOf(sub, 0));
    
});