const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs')

const { LoginDialog, LOGIN_DIALOG } = require('./loginDialog')
const { RecycleDialog, RECYCLE_DIALOG } = require('./recycleDialog')

const MAIN_DIALOG = 'MAIN_DIALOG'
const WATERFALL_DIALOG = 'WATERFALL_DIALOG'
const USER_PROFILE_PROPERTY = 'USER_PROFILE_PROPERTY'

const TEXT_PROMPT = 'TEXT_PROMPT'

let userInfo = {name: ''}

class MainDialog extends ComponentDialog {
    constructor(userState) {
        super(MAIN_DIALOG)
        this.userState = userState
        this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY)

        this.addDialog(new LoginDialog())
        this.addDialog(new RecycleDialog())
        this.addDialog(new TextPrompt(TEXT_PROMPT))

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.clarifyLogin.bind(this),
            this.secondStep.bind(this),
            this.clarifyProblem.bind(this),
            this.finalStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === undefined || results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async clarifyLogin(stepContext) {
        return await stepContext.beginDialog(LOGIN_DIALOG);
    }

    async secondStep(stepContext) {
        userInfo = stepContext.result //store logged in user in global scope for future use
        console.log('logged In User', userInfo)
        let promptOptions = { prompt: 'Awesome! What do you want to talk about?' }
        return await stepContext.prompt(TEXT_PROMPT, promptOptions)
    }

    async clarifyProblem(stepContext) {
        switch(stepContext.result){
            case 'recycling':
                return await stepContext.beginDialog(RECYCLE_DIALOG)
            default:
                return await stepContext.next()
        }
    }

    async finalStep(stepContext) {
        await stepContext.context.sendActivity(`See ya! This has been a great talk, ${userInfo.name}!`);
        await this.userProfileAccessor.set(stepContext.context, userInfo);
        return await stepContext.endDialog();
    }
}

module.exports.MainDialog = MainDialog;
module.exports.MAIN_DIALOG = MAIN_DIALOG;