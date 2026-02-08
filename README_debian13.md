# Building on Linux

## Prerequisites

sudo apt install git-extras
sudo apt install python3-venv
sudo apt install python3-pyqt6
sudo apt install libqt6webchannel6
sudo apt install libqt6webview6
sudo apt install python3-tk
sudo apt install nodejs
sudo apt install npm
sudo apt install lintian

## create python virtual env
python3 -m venv venv

## activate python virtual env
source ./venv/bin/activate

## Python dependencies
pip install -r requirement_debian13.txt

## nodejs dependencies
npm i

## build from source
npm run builddebian


