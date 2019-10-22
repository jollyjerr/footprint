// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {BotHelper} = require('./botHelper');
const { QnAMaker } = require("botbuilder-ai");

const dotenv = require("dotenv");
dotenv.config();

class Footprint extends BotHelper {
    constructor(conversationState, userState, dialog) {
        super(conversationState, userState, dialog);
        try {
          this.qnaMaker = new QnAMaker({
            knowledgeBaseId: process.env.QnAKnowledgebaseId,
            endpointKey: process.env.QnAAuthKey,
            host: process.env.QnAEndpointHostName
          });
        } catch (err) {
          console.warn(
            `QnAMaker Exception: ${err} Check your QnAMaker configuration in .env`
          );
        }

        this.onMembersAdded(async (context, next) => {
            console.log('A new member has been added! ☺️')

            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    console.log('A new member has been added! ☺️')
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMessage(async (context, next) => {
          if (
            !process.env.QnAKnowledgebaseId ||
            !process.env.QnAAuthKey ||
            !process.env.QnAEndpointHostName
          ) {
            let unconfiguredQnaMessage =
              "NOTE: \r\n" +
              "QnA Maker is not configured. To enable all capabilities, add `QnAKnowledgebaseId`, `QnAEndpointKey` and `QnAEndpointHostName` to the .env file. \r\n" +
              "You may visit www.qnamaker.ai to create a QnA Maker knowledge base.";

            await context.sendActivity(unconfiguredQnaMessage);
          } else {
            console.log("Calling QnA Maker");

            const qnaResults = await this.qnaMaker.getAnswers(context);

            // If an answer was received from QnA Maker, send the answer back to the user.
            if (qnaResults[0]) {
              await context.sendActivity(qnaResults[0].answer);

              // If no answers were returned from QnA Maker, reply with help.
            } else {
              await context.sendActivity("No QnA Maker answers were found.");
            }
          }

          // By calling next() you ensure that the next BotHandler is run.
          await next();
        });
    }
}

module.exports.Footprint = Footprint;
