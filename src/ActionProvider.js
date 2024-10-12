class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
      this.createChatBotMessage = createChatBotMessage;
      this.setState = setStateFunc;
    }
  
    handleLocation = () => {
      const message = this.createChatBotMessage(
        "I can help you find a location. Please enter your city and state."
      );
      this.addMessageToBotState(message);
    };
  
    handleDefault = () => {
      const message = this.createChatBotMessage(
        "I'm not sure how to respond to that. Can you ask something else?"
      );
      this.addMessageToBotState(message);
    };
  
    addMessageToBotState = (message) => {
      this.setState((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, message],
      }));
    };
  }
  
  export default ActionProvider;
  