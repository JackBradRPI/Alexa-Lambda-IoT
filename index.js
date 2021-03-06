/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.ask.skill.f3f60fe4-7a0d-43d2-a2a9-7edbee4d4634";

/*****/
//Environment Configuration
var config = {};
config.IOT_BROKER_ENDPOINT      = "https://a1s2v90kik0rsl.iot.eu-west-1.amazonaws.com"
config.IOT_BROKER_REGION        = "eu-west-1";
config.IOT_THING_NAME           = "RaspberryPi";
//Loading AWS SDK libraries
var AWS = require('aws-sdk');
AWS.config.region = config.IOT_BROKER_REGION;
//Initializing client for IoT
var iotData = new AWS.IotData({endpoint: config.IOT_BROKER_ENDPOINT});

var AlexaSkill = require('AlexaSkill');///////

var HelloWorld = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HelloWorld.prototype = Object.create(AlexaSkill.prototype);
HelloWorld.prototype.constructor = HelloWorld;

HelloWorld.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HelloWorld onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

HelloWorld.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("HelloWorld onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Alexa Skills Kit, you can say hello";
    var repromptText = "You can say hello";
    response.ask(speechOutput, repromptText);
};

HelloWorld.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("HelloWorld onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

HelloWorld.prototype.intentHandlers = {
    // register custom intent handlers
    "SkyPower": function (intent, session, response) {
        //response.tellWithCard("Hello World!", "Hello World", "Hello World!");
        console.log("FB started");
        var repromptText = null;
        var sessionAttributes = {};
        var shouldEndSession = true;
        var speechOutput = "";
        var payloadObj=0; //On
        var paramsUpdate = {
            topic:"RaspberryPi",
            payload: JSON.stringify(payloadObj),
            qos:0
        };
        iotData.publish(paramsUpdate, function(err, data) {
          if (err){
            //Handle the error here
            console.log("MQTT Error" + data);
          }
          else {
            speechOutput = "Powering now";
            console.log(data);
            response.tell(speechOutput);
            //callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
          }
        });
    },
     "SkyPause": function (intent, session, response) {
        console.log("FB started");
        var repromptText = null;
        var sessionAttributes = {};
        var shouldEndSession = true;
        var speechOutput = "";
        var payloadObj=1; //On
        //Prepare the parameters of the update call
        var paramsUpdate = {
            topic:"RaspberryPi",
            payload: JSON.stringify(payloadObj),
            qos:0
        };
        iotData.publish(paramsUpdate, function(err, data) {
          if (err){
            //Handle the error here
            console.log("MQTT Error" + data);
          }
          else {
            speechOutput = "Pausing Now";
            console.log(data);
            response.tell(speechOutput);
            //callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
          }
        });
        /****/
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask me to turn pump on or off", "You can ask me to turn pump on or off");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    var helloWorld = new HelloWorld();
    helloWorld.execute(event, context);
};
