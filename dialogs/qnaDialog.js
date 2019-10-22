const {
  ComponentDialog,
  NumberPrompt,
  TextPrompt,
  WaterfallDialog
} = require("botbuilder-dialogs");
const { QnAMaker } = require("botbuilder-ai");

const { UserProfile } = require("../userProfile");


const QNA_DIALOG = "QNA_DIALOG";

const WATERFALL_DIALOG = "WATERFALL_DIALOG";
const TEXT_PROMPT = "TEXT_PROMPT";

class QnaDialog extends ComponentDialog {
  constructor() {
    super(QNA_DIALOG);

    try {
      this.qnaMaker = new QnAMaker({
        knowledgeBaseId: process.env.QnAKnowledgebaseId,
        endpointKey: process.env.QnAEndpointKey,
        host: process.env.QnAEndpointHostName
      });
    } catch (err) {
      console.warn(
        `QnAMaker Exception: ${err} Check your QnAMaker configuration in .env`
      );
    }
  }

  async confirmItem(stepContext) {
    let promptOptions = { prompt: "recycling is good" };

    return await stepContext.prompt(TEXT_PROMPT, promptOptions);
  }
}

module.exports.QnaDialog = QnaDialog;
module.exports.QNA_DIALOG = QNA_DIALOG;
