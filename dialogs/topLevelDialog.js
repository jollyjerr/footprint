const { ComponentDialog, NumberPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs')
const { UserProfile } = require('../userProfile')

const TOP_LEVEL_DIALOG = 'TOP_LEVEL_DIALOG'

const WATERFALL_DIALOG = 'WATERFALL_DIALOG'
const TEXT_PROMPT = 'TEXT_PROMPT';

class TopLevelDialog extends ComponentDialog {
    constructor() {
        super(TOP_LEVEL_DIALOG)
        this.addDialog(new TextPrompt(TEXT_PROMPT))

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.nameStep.bind(this),
            this.acknowledgementStep.bind(this)
        ]))

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async nameStep(stepContext) {
        stepContext.values.userInfo = new UserProfile();

        const promptOptions = {prompt: 'Hey, I hope we make it here! Can you please enter your name??'}

        return await stepContext.prompt(TEXT_PROMPT, promptOptions)
    }

    async acknowledgementStep(stepContext) {
        stepContext.values.userInfo.name = stepContext.result

        await stepContext.context.sendActivity(`Hey there ${stepContext.values.userInfo.name}`)

        return await stepContext.endDialog();
    }

}

module.exports.TopLevelDialog = TopLevelDialog;
module.exports.TOP_LEVEL_DIALOG = TOP_LEVEL_DIALOG;