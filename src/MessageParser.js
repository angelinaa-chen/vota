class MessageParser {
    constructor(actionProvider) {
      this.actionProvider = actionProvider;
    }
  
    parse(message) {
      const lowerCaseMessage = message.toLowerCase();
      
      // Tell me more about the upcoing election.
      // Tell me about ____ person
      // Tell me about ___ from Indiana person.
      // Where are the polls?
      // When should i mail my ballot. 
      
      if (lowerCaseMessage.includes("location")) {
        this.actionProvider.handleLocation();
      } else {
        this.actionProvider.handleDefault();
      }
    }
  }
  
  export default MessageParser;
  