# TextBot
A node.js server that listens for text (SMS) messages containing Javascript and texts you back the results.

## Seriously? Why?

I was explaining the basics of programming via text message today with someone. It started initially as a joke in response to a non-programming message. Eventually I was saying "open Chrome's Developer JavaScript Console and type the following: var x = 10;..." It occurred to me it would be fun to have a node.js bot that can receive these SMS-sized chunks of Javascript, evaluate and execute them, and send back the results. 

It also seemed like a fun challenge to move it beyond a trivial example of request/eval/respond using an existing SMS service such as Twilio. For example: 

+ What if you could maintain a session with variables and functions that could be invoked by later texts?
+ What if you could chain texts together and not eval/respond until a request indicating the end?
+ What if you could surface interesting APIs which could be queried by text message? 
+ What if people's bot requests could interact with each others' bot requests?

## I've Got a Bad Feeling About This...

Therein lies the fun and adventure. Do note that TextBot evaluates and executes Javascript using the excellent 'sandbox' module to keep things in check.

## Usage

	Usage: node ./app.js -c [config]

	Options:
  	-c, --config  Path to a Javascript configuration file, e.g. ./local.config.js  [required]

## Configuration

Check out ./config.js. Basically just tell it your Twilio account information. I provided config.js as a template. Personally I put my own sensitive configuration into local.config.js files, and put local.config.js in my .gitignore.

## Built with These Great Node.js Modules

+ twilio
+ optimist
+ sandbox