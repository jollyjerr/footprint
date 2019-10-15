const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog } = require('botbuilder-dialogs');

const MAIN_DIALOG = 'MAIN_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const USER_PROFILE_PROPERTY = 'USER_PROFILE_PROPERTY';

class MainDialog extends ComponentDialog {
    constructor(userState) {
        super(MAIN_DIALOG);
        // this.userState = userState;
        // this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);

        // this.addDialog(new TopLevelDialog());
        // this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
        //     this.initialStep.bind(this),
        //     this.finalStep.bind(this)
        // ]));

        // this.initialDialogId = WATERFALL_DIALOG;
    }
}

module.exports.MainDialog = MainDialog;
module.exports.MAIN_DIALOG = MAIN_DIALOG;