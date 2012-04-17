var express = require('express')
  , util = require('util')
  , argv = require('optimist')
      .usage('Usage: $0 -c [config]')
      .demand(['c'])
      .alias('c', 'config')
      .describe('c', 'Path to a Javascript configuration file, e.g. ./local.config.js')
      .argv
;

var config = require(argv.config);

var TwilioClient = require('twilio').Client,
  Twiml = require('twilio').Twiml,
  creds = config.Twilio,
  client = new TwilioClient(creds.sid, creds.authToken, creds.hostname);

var phone = client.getPhoneNumber(creds.outgoing);
console.log('TextBot listening for SMS code requests on %s', creds.incoming);  
phone.setup(function() {
  phone.on('incomingSms', function(req, res) {
    // req contains the Twilio request parameters.
    // res is a Twiml.Response object.
    console.log('Received incoming SMS with text: ' + req.Body);
    console.log('From: ' + req.From);
    handleCodeRequest(req.Body, function(output) {
      console.log('TextBot ran code "%s" from %s. Texting back result "%s"', 
        req.Body, req.From, output.result);   
      sendSMS(output.result, req.From);   
    });
  });  
});

var Sandbox = require('sandbox');
sandbox = new Sandbox();

var handleCodeRequest = function (code, callback) {
  sandbox.run(code, callback);
}

var sendSMS = function(message, toNumber) {
  phone.sendSms(toNumber, message, null, function(sms) {
    console.log('TextBot sent SMS: "%s" from %s to %s', sms.body, sms.from, sms.to);
  });
}