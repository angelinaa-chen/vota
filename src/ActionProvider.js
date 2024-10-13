class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
      this.createChatBotMessage = createChatBotMessage;
      this.setState = setStateFunc;
    }
  
    handleDefault = () => {
      const message = this.createChatBotMessage(
        "I'm not sure how to respond to that. Can you ask something else?"
      );
      this.addMessageToBotState(message);
    };

    handleElectionInfo = () => {
        const message = this.createChatBotMessage(
          "The upcoming 2024 U.S. presidential election is set for Tuesday, November 5, 2024. This election will be the 60th quadrennial presidential election and is significant for being the first under the new electoral vote distribution based on the 2020 census. To win, a candidate needs a simple majority of the 538 electoral votes—specifically, 270 votes."
        );
        this.addMessageToBotState(message);
    };

    handleMassachusetts = () => {
        const message = this.createChatBotMessage(
          "Massachusetts citizens can fill out the mail ballot application and mail or return it in person to your local election office. You can also submit a mail ballot application online using the Massachusetts Mail Ballot Application System!"
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
  