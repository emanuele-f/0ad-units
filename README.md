# 0ad-units

[0 A.D](https://play0ad.com/) is a multiplayer real time stragic game.
This project implements a webserver using nodejs framework which pulls (from [github repo](https://github.com/0ad/0ad/)) and analizes game unit xml data files to generate a single json file. Then serves it in ajax web requests.

The web client part visualizes unit data into a table, allowing for simple structured sortings and filterings.

Setup
-----
- `npm install`
- `npm run pulldata` to pull xml data from 0ad repos
- `node server` to launch the server

You need *subversion* in order to pull 0ad data.

Server starts on port 3000 by default.

On first client request, the units JSON file is generated, which may take some time.
