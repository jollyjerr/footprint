// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');

class BotHelper extends ActivityHandler {
    constructor(conversationState, userState, dialog) {
        super();
        if (!conversationState) throw new Error('[BotHelper]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[BotHelper]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[BotHelper]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');

        this.onDialog(async (context, next) => {
            // Save any state changes. The load happened during the execution of the Dialog.
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.BotHelper = BotHelper;