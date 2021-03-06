const { ComponentDialog, NumberPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs')
const { UserProfile } = require('../userProfile')

const LOGIN_DIALOG = 'LOGIN_DIALOG'

const WATERFALL_DIALOG = 'WATERFALL_DIALOG'
const TEXT_PROMPT = 'TEXT_PROMPT'

const AUTH_URL = "https://footprints-backend.azurewebsites.net/api/auth/login";

class LoginDialog extends ComponentDialog {
    constructor() {
        super(LOGIN_DIALOG)

        this.addDialog(new TextPrompt(TEXT_PROMPT))
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.nameStep.bind(this),
            this.passwordStep.bind(this),
            this.loginStep.bind(this)
        ]))

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async nameStep(stepContext) {
        stepContext.values.userInfo = new UserProfile();

        let promptOptions = {prompt: 'Alright, what\'s your username?'}

        return await stepContext.prompt(TEXT_PROMPT, promptOptions)
    }

    async passwordStep(stepContext) {
        stepContext.values.userInfo.name = stepContext.result
        await stepContext.context.sendActivity(`Hey there ${stepContext.values.userInfo.name}!`)

        let promptOptions = { prompt: 'What\'s your password?' }

        return await stepContext.prompt(TEXT_PROMPT, promptOptions)
    }

    async loginStep(stepContext) {
        stepContext.values.userInfo.password = stepContext.result

        const userProfile = stepContext.values.userInfo

        return fetch(AUTH_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: userProfile.name,
                password: userProfile.password
            })
        })
        .then(resp => resp.json())
        .catch(err => {
            console.error('Login Failed! 😮', err)
            throw `Sorry ${userProfile.name}! It looks like your username or password was incorrect!`
        })
        .then((result) => {
            userProfile.jwt = result.footprintsJWT
            userProfile.vehicles = result.user.vehicles
            userProfile.houses = result.user.houses
            console.log('A user just logged in! 🥳   ', userProfile.name)
            return stepContext.endDialog(userProfile);  
        })  
    }
}

module.exports.LoginDialog = LoginDialog;
module.exports.LOGIN_DIALOG = LOGIN_DIALOG;