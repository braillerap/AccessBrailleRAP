import BrailleInBlackGeniuneTextStrategy from "../modules/BrailleInBlackgeniuneTextStrategy";

it ("BrailleInBlackGeniuneTextStrategy basic test", ()=> {
    const Braille =[
        "⠨⠇⠑⠎",
        "⠛⠗⠁⠝⠙⠑⠎",
        "⠏⠑⠗⠎⠕⠝⠝⠑⠎",
        "⠁⠊⠍⠑⠝⠞",
        "⠇⠑⠎",
        "⠉⠓⠊⠋⠋⠗⠑⠎⠲"];
    const Text ="Les grandes personnes aiment les chiffres";

    let strategy = new BrailleInBlackGeniuneTextStrategy();
    let res = strategy.getWords (Braille, Text);
    expect(res.length).toEqual(Braille.length);
});