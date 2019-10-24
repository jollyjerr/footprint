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
    super(MAIN_DIALOG);
    this.userState = userState;
    this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);

    this.addDialog(new LoginDialog());
    this.addDialog(new RecycleDialog());
    this.addDialog(new TextPrompt(TEXT_PROMPT));

    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG, [
        this.clarifyLogin.bind(this),
        this.secondStep.bind(this),
        this.clarifyProblem.bind(this),
        this.finalStep.bind(this)
      ])
    );

    this.initialDialogId = WATERFALL_DIALOG;
  }

  async run(turnContext, accessor) {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(turnContext);
    const results = await dialogContext.continueDialog();
    if (
      results.status === undefined ||
      results.status === DialogTurnStatus.empty
    ) {
      await dialogContext.beginDialog(this.id);
    }
  }

  async clarifyLogin(stepContext) {
    return await stepContext.beginDialog(LOGIN_DIALOG);
  }

  async secondStep(stepContext) {
    userInfo = stepContext.result; //store logged in user in global scope for future use
    let promptOptions = { prompt: "Awesome! What do you want to talk about?" };
    return await stepContext.prompt(TEXT_PROMPT, promptOptions);
  }

  async clarifyProblem(stepContext) {
    switch (this.findInput(stepContext.result)) {
        case 'profile':
            return await stepContext.next() // WIP:
        case 'vehicle':
            return await stepContext.prompt(TEXT_PROMPT, { prompt: `Your vehicle(s) on record: ${this.mapVehicles()}! Take the ${this.findBestVehicle().make} for minimum impact!` })
        case 'house':
            return await stepContext.next() // WIP:
        default:
        return await stepContext.next();
    }
  }

  findBestVehicle() {
      let best = {mpg: 0}
      userInfo.vehicles.map(v => {
        v.mpg > best.mpg ? best = v : null
      })
      return best
  }

  mapVehicles() {
      let vehicles = ''
      userInfo.vehicles.map(v => {
        vehicles = vehicles + `${v.make} ${v.model} with ${v.mpg}mpg `
      })
      return vehicles
  }

  findInput(rawInput) {
    let profileBuzz = ["profile", "all", "own", "user", "file"];
    let vehicleBuzz = ["vehicle", "car", "vehicles", "cars", "trucks", "drive"];
    let houseBuzz = ["house", "houses", "buildings", "live", "visit"];
    if (this.hintsAt(profileBuzz, rawInput)) {
      return "profile";
    } else if (this.hintsAt(vehicleBuzz, rawInput)) {
      return "vehicle";
    } else if (this.hintsAt(houseBuzz, rawInput)) {
      return "house";
    } else {
      return "default";
    }
  }

  hintsAt(array, string) {
    if (
      array.some(word => {
        return string.includes(word);
      })
    ) {
      return true;
    }
    return false;
  }

  findInput(rawInput) {
    let profileBuzz = ["profile", "all", "own", "user", "file"];
    let vehicleBuzz = ["vehicle", "car", "vehicles", "cars", "trucks", "drive"];
    let houseBuzz = ["house", "houses", "buildings", "live", "visit"];
    if (this.hintsAt(profileBuzz, rawInput)) {
      return "profile";
    } else if (this.hintsAt(vehicleBuzz, rawInput)) {
      return "vehicle";
    } else if (this.hintsAt(houseBuzz, rawInput)) {
      return "house";
    } else {
      return "default";
    }
  }

  async finalStep(stepContext) {
    await this.userProfileAccessor.set(stepContext.context, userInfo);
    throw `Always love talking to ya, ${userInfo.name}!`;
  }
}

module.exports.MainDialog = MainDialog;
module.exports.MAIN_DIALOG = MAIN_DIALOG;