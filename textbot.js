var argv = require('optimist')
      .usage('Usage: $0 -c [config]')
      .demand(['c'])
      .alias('c', 'config')
      .describe('c', 'Path to a Javascript configuration file, e.g. ./local.config.js')
      .argv
;

var config = require(argv.config),
  TwilioClient = require('twilio').Client,
  Twiml = require('twilio').Twiml,
  creds = config.Twilio,
  client = new TwilioClient(creds.sid, creds.authToken, creds.hostname),
  Sandbox = require('sandbox'),
  sandbox = new Sandbox()
;

console.log('TextBot listening for SMS code requests on %s', creds.incoming);  
var phone = client.getPhoneNumber(creds.outgoing);
phone.setup(function() {
  phone.on('incomingSms', function(reqParams, res) {
    // reqParams contains the Twilio request parameters.
    // res is a Twiml.Response object.
    handleCodeRequest(reqParams.Body, function(output) {
      console.log('TextBot ran code "%s" from %s. Texting back result "%s"', 
        reqParams.Body, reqParams.From, output.result);   
      sendSMS(output.result, reqParams.From);   
    });
  });  
});

var handleCodeRequest = function (code, callback) {
  sandbox.run(code, callback);
}

var sendSMS = function(message, toNumber) {
  phone.sendSms(toNumber, message, null, function(sms) {
    console.log('TextBot sent SMS: "%s" from %s to %s', sms.body, sms.from, sms.to);
  });
}
