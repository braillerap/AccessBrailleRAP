

import BrailleBlackAlignmentRight from "../modules/BrailleBlackAlignmentRight"

const tests_basic = [
    {input:'⠁', black:"a", translated:"⠁"},
    {input:'⠨⠃', black:"b", translated:"⠃"},
    {input:'⠃⠗⠁⠊⠇⠇⠑⠗⠁⠏', black:"braillerap", translated:"⠃⠗⠁⠊⠇⠇⠑⠗⠁⠏"},
    {input:'⠨⠃⠗⠁⠊⠇⠇⠑⠨⠨⠗⠁⠏', black:"braillerap", translated:"⠃⠗⠁⠊⠇⠇⠑⠗⠁⠏"}
]




it ("BrailleBlackAlignmentRight basic test", ()=> {
    
    let align = new BrailleBlackAlignmentRight (null);
    expect(align).not.toEqual (null);

    for (let i = 0; i < tests_basic.length; i++)
    {
        let braille = tests_basic[i].input;
        let black = tests_basic[i].black;

        let testedword = align.getAligned (braille, black);
        expect(testedword.length).toEqual (braille.length);
    }
});

const tests_contracted = [
    
    {input:'⠰⠠⠃', black:"Les", translated:"⠠⠃"},
    {input:'⠻⠙⠎', black:"grandes", translated:"⠻⠙⠎"},
    {input:'⠏⠝⠎', black:"personnes", translated:"⠏⠝⠎"}
]

class MockBrailleContractedTranslator
{
    translate_single_string (word)
    {
        for (let i = 0; i < tests_contracted.length; i++)
        {
            if (tests_contracted[i].black === word)
            {
                return (tests_contracted[i].translated);
            }
        }
        return '???';
    }
}
it ("BrailleBlackAlignmentRight contracted test", ()=> {
    
    let align = new BrailleBlackAlignmentRight (null);
    expect(align).not.toEqual (null);

    for (let i = 0; i < tests_contracted.length; i++)
    {
        let braille = tests_contracted[i].input;
        let black = tests_contracted[i].black;

        let testedword = align.getAligned (braille, black);
        expect(testedword.length).toEqual (braille.length);
    }
});


