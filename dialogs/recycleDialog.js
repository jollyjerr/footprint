const { ComponentDialog, NumberPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs')
const { UserProfile } = require('../userProfile')

const RECYCLE_DIALOG = 'RECYCLE_DIALOG'

const WATERFALL_DIALOG = 'WATERFALL_DIALOG'
const TEXT_PROMPT = 'TEXT_PROMPT'

class RecycleDialog extends ComponentDialog {
    constructor() {
        super(RECYCLE_DIALOG)

        this.addDialog(new TextPrompt(TEXT_PROMPT))
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.confirmItem.bind(this)
        ]))

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async confirmItem(stepContext) {
        let promptOptions = { prompt: 'recycling is good' }

        return await stepContext.prompt(TEXT_PROMPT, promptOptions)
    }

}

module.exports.RecycleDialog = RecycleDialog;
module.exports.RECYCLE_DIALOG = RECYCLE_DIALOG;