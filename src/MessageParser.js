class MessageParser {
    constructor(actionProvider) {
      this.actionProvider = actionProvider;
    }
  
    parse(message) {
      const lowerCaseMessage = message.toLowerCase();
  
      if (lowerCaseMessage.includes("location")) {
        this.actionProvider.handleLocation();
      } else {
        this.actionProvider.handleDefault();
      }
    }
  }
  
  export default MessageParser;
  