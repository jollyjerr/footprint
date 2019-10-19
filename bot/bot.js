// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {BotHelper} = require('./botHelper')

class Footprint extends BotHelper {
    constructor(conversationState, userState, dialog) {
        super(conversationState, userState, dialog);

        this.onMembersAdded(async (context, next) => {
            console.log('A new member has been added! ☺️')

            // const greeting = 'Hello there! My name is Footprint, and I am here to help you make sustainable decisions. Let\'s get you logged in, and then feel free to ask me questions about the environment and our relationship with it! Sound good ?'

            // const membersAdded = context.activity.membersAdded;
            // for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
            //     if (membersAdded[cnt].id !== context.activity.recipient.id) {
            //         await context.sendActivity(greeting);
            //     }
            // }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.Footprint = Footprint;
