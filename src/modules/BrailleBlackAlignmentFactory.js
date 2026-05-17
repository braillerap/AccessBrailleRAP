import BrailleBlackAlignmentRight from "./BrailleBlackAlignmentRight"
import BrailleBlackAlignmentGuess from "./BrailleBlackAlignmentGuess"
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
            return new BrailleBlackAlignmentGuess (this.BrailleTranslator);
            break;
        default:
            return null;
        }
    }
}
export default BrailleBlackAlignmentFactory;