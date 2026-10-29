

import BrailleBlackAlignmentGuess from "../modules/BrailleBlackAlignmentGuess"

const tests_basic = [
    {input:'⠁', black:"a", translated:"⠁"},
    {input:'⠨⠃', black:"b", translated:"⠃"},
    {input:'⠃⠗⠁⠊⠇⠇⠑⠗⠁⠏', black:"braillerap", translated:"⠃⠗⠁⠊⠇⠇⠑⠗⠁⠏"},
    {input:'⠨⠃⠗⠁⠊⠇⠇⠑⠨⠨⠗⠁⠏', black:"braillerap", translated:"⠃⠗⠁⠊⠇⠇⠑⠗⠁⠏"}
]


class MockBrailleTranslator
{
    translate_single_string (word)
    {
        for (let i = 0; i < tests_basic.length; i++)
        {
            if (tests_basic[i].black === word)
            {
                return (tests_basic[i].translated);
            }
        }
        return '???';
    }
}


it ("BrailleBlackAlignmentGuess basic test", ()=> {
    
    let align = new BrailleBlackAlignmentGuess (new MockBrailleTranslator ());
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
it ("BrailleBlackAlignmentGuess contracted test", ()=> {
    
    let align = new BrailleBlackAlignmentGuess (new MockBrailleContractedTranslator ());
    expect(align).not.toEqual (null);

    for (let i = 0; i < tests_contracted.length; i++)
    {
        let braille = tests_contracted[i].input;
        let black = tests_contracted[i].black;

        let testedword = align.getAligned (braille, black);
        expect(testedword.length).toEqual (braille.length);
    }
});


