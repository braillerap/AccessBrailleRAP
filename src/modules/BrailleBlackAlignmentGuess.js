/**
 * \file            BrailleBlackAlignmentGuess.js
 * \brief           Define a strategy to compute alignment for the same word in Braille and in black text, trying to guess best position by back translating Braille word
 */

import BrailleBlackAlignmentStrategy from "./BrailleBlackAlignmentStrategy";

/*
 * GNU GENERAL PUBLIC LICENSE
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS LICENSED UNDER
 *                  GNU GENERAL PUBLIC LICENSE
 *                   Version 3, 29 June 2007
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * This file is part of AccessBrailleRAP software.
 *
 * SPDX-FileCopyrightText: 2025-2026 Stephane GODIN <stephane@braillerap.org>
 * 
 * SPDX-License-Identifier: GPL-3.0 
 */
import BrailleBlackAlignmentStrategy from "./BrailleBlackAlignmentStrategy";

class BrailleBlackAlignmentGuess extends BrailleBlackAlignmentStrategy 
{
    constructor (BrailleTranslator)
    {
        super (BrailleTranslator);
    }

    getAligned(BrailleWord, TextWord)
    {
        let word = this.BrailleTranslator.back_translate_single_string (BrailleWord);
        
        if (word.length < BrailleWord.length)
        {
            word.padEnd (BrailleWord.length, ' ');
        }
        
        
        return word;
    }

}

export default BrailleBlackAlignmentStrategy;