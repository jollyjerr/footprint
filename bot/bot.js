// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {BotHelper} = require('./botHelper');
const { QnAMaker } = require("botbuilder-ai");
const { MessageFactory } = require("botbuilder");

const dotenv = require("dotenv");
dotenv.config();

class Footprint extends BotHelper {
    constructor(conversationState, userState, dialog) {
        super(conversationState, userState, dialog);
        let waterfall = false;
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
            let tasks = MessageFactory.suggestedActions(['Login'])
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    console.log('A new member has been added! ☺️')
                    await context.sendActivity(tasks)
                }
            }
            await next();
        });

        this.onMessage(async (context, next) => {
          if(context.activity.text === 'Login' || waterfall === true){
            waterfall = true
            await this.dialog.run(context, this.dialogState)
          } else {
            if (
              !process.env.QnAKnowledgebaseId ||
              !process.env.QnAAuthKey ||
              !process.env.QnAEndpointHostName
            ) {
              let unconfiguredQnaMessage = "Sorry, but footprint is feeling ill right now. Check back later!"
              await context.sendActivity(unconfiguredQnaMessage);
            } else {
              console.log("Calling QnA Maker 💸 ");
              const qnaResults = await this.qnaMaker.getAnswers(context);
              if (qnaResults[0]) {
                await context.sendActivity(qnaResults[0].answer);
              } else {
                await context.sendActivity("Hmmm... I'm puzzled. Let me get back to you on that.");
              }
            }
          }
          
          await next();
        });

    }
}

module.exports.Footprint = Footprint;
