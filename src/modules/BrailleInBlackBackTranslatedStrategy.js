/**
 * \file            BrailleInBlackBackTranslatedStrategy.js
 * \brief           Implement a strategy to build translation of an array of Braille words in black text, using back translation from Braille
 */

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
import BrailleInBlackTextStrategy from "./BrailleInBlackTextStrategy";


class BrailleInBlackBackTranslatedStrategy extends BrailleInBlackTextStrategy
{
    constructor ()
    {
        super();
        this.BrailleTranslator = null;
    }

    setBrailleTranslator (BrailleTranslator)
    {
        this.BrailleTranslator = BrailleTranslator;
    }

    /*!
     *\brief Build an array of word in black associated with the array of Braille words
     *
     *\param braille_words_array An array of Braille word to translate in black word.
     *\param original_text_line  The text string source for braille_words_array.
     * 
     *\return The array of words black (ie standard text).
     */
    getWords (braille_words_array, original_text_line)
    {
        let words = [];
        
        braille_words_array.map ( (brailleword) => {
            let trans = this.BrailleTranslator.back_translate_single_string (brailleword);
            words.push (trans);
        });

        // fill some words if something go wrong
        while (words.length < braille_words_array.length)
                words.push ('!')

         return words;

    }
}

export default BrailleInBlackBackTranslatedStrategy;