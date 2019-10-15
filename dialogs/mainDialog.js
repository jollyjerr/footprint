const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');

const { LoginDialog, LOGIN_DIALOG } = require('./loginDialog');

const MAIN_DIALOG = 'MAIN_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const USER_PROFILE_PROPERTY = 'USER_PROFILE_PROPERTY';

const TEXT_PROMPT = 'TEXT_PROMPT'

class MainDialog extends ComponentDialog {
    constructor(userState) {
        super(MAIN_DIALOG);
        this.userState = userState;
        this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);

        this.addDialog(new LoginDialog());
        this.addDialog(new TextPrompt(TEXT_PROMPT))
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.initialStep.bind(this),
            this.clarifyLogin.bind(this),
            this.finalStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async initialStep(stepContext) {
        let promptOptions = { prompt: 'Would you like to log in?' }
        return await stepContext.prompt(TEXT_PROMPT, promptOptions)
    }

    async clarifyLogin(stepContext) {
        const confirmations = ['yes', 'ya', 'login', 'do', 'ok', 'okay', 'yep', 'yesh']
        if (confirmations.some(resp => resp.includes(stepContext.result.toLowerCase()))) {
            return await stepContext.beginDialog(LOGIN_DIALOG);
        }
    }

    async finalStep(stepContext) {
        const userInfo = stepContext.result;

        await stepContext.context.sendActivity(`See ya! This has been a great talk! ${userInfo.name}`);
        await this.userProfileAccessor.set(stepContext.context, userInfo);
        return await stepContext.endDialog();
    }
}

module.exports.MainDialog = MainDialog;
module.exports.MAIN_DIALOG = MAIN_DIALOG;