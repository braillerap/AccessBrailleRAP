# AccessBrailleRAP
Braille transcription software for BrailleRAP. NVDA compatible.
The project use several open source licensed software:
- liblouisreact, a liblouis version slightly modified to run in react.js environnement.
- liblouis 
- pandoc

## Release
You wil find packaged installation in [release](https://github.com/braillerap/AccessBrailleRAP/releases).

## LibLouis
AccessBrailleRAP use lilouis to translate text into Braille. You can select the Braille language (English, French...), contracted or uncontacted Braille, and 6 dots or 8 Dots Braille standard.
The original version of liblouis is available here [https://github.com/liblouis/liblouis](https://github.com/liblouis/liblouis)
The modified version for react.js is available here [https://github.com/crocsg/liblouis](https://github.com/crocsg/liblouis)
The module for react.js is available here [https://github.com/crocsg/liblouisreact](https://github.com/crocsg/liblouisreact)

liblouis and liblouisreact are licensed under GNU LGPL V2.1

## Pandoc
AccesBrailleRAP use pandoc via pypandoc python module, to extract plain text from various file format as word or open office document. So you can open an .odt file, translate it into Braille and emboss.

the original version of pandoc is available here [www.pandoc.org](https://www.pandoc.org)

pandoc is licensed under GNU GPL V2.

## Screenshot

![](./screenshot.jpg)

![](./screenshot1.jpg)

![](./screenshot2.jpg)

## How to install
Download the latest installer from github [release](https://github.com/braillerap/AccessBrailleRAP/releases)

The installer will install AccesBrailleRAP, the needed drivers to control BrailleRAP and Chrome browser.

## Instruction for build (Windows)

Environnement Install
=====================

You'll need to have Chrome  installed.

You’ll need to have Python >= 3.6, Eel, pyinstaller, pySerial...


First make a python virtual env in a power shell.
```
$ python -m venv venv 
```

Activate the virtual env (power shell)
```
$ .\venv\Scripts\activate.ps1  
```

Install all python depencies with:
```
$ pip install -r requirement.txt 
```

Install all react/js dependencies
```
$ npm i
```

Develop on React GUI
====================

```
$ npm start
```

Build as GUI App
================

```
$ npm build
```

check `dist/AccessBrailleRAP.exe`


