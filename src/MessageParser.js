class MessageParser {
    constructor(actionProvider) {
      this.actionProvider = actionProvider;
    }
  
    parse(message) {
      const lowerCaseMessage = message.toLowerCase();

      if (lowerCaseMessage.includes("massachusetts")) {
        this.actionProvider.handleMassachusetts();
      } 
      else if (lowerCaseMessage.includes("election")) {
        this.actionProvider.handleElectionInfo();
      }
      else {
        this.actionProvider.handleDefault();
      }
    }
  }
  
  export default MessageParser;


  