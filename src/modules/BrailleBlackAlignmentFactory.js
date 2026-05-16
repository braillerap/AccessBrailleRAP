import BrailleBlackAlignmentRight from "./BrailleBlackAlignmentRight"

class BrailleBlackAlignmentFactory
{
    constructor (BrailleTranslator)
    {
        this.BrailleTranslator = BrailleTranslator;
    }

    create (type)
    {
        let obj = null;
        switch (type)
        {
        case "right":
            return new BrailleBlackAlignmentRight (this.BrailleTranslator);
            break;
        case "guess":
            return new BrailleBlackAlig
        }
    }
}