// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {BotHelper} = require('./botHelper')

class Footprint extends BotHelper {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            await context.sendActivity(`You said '${ context.activity.text }'`);
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Hello and welcome!');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.Footprint = Footprint;
