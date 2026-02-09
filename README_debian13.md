# Building on Linux

## Prerequisites

sudo apt install git-extras lintian
sudo apt install python3-venv
sudo apt install python3-pyqt6 python3-tk
sudo apt install libqt6webchannel6 libqt6webview6
sudo apt install nodejs npm

## create python virtual env
python3 -m venv venv

## activate python virtual env
source ./venv/bin/activate

## Install Python dependencies
pip install -r requirement_debian13.txt

## Install nodejs dependencies
npm i

## build from source
npm run builddebian

## Run for test/debug 
npm run startview
