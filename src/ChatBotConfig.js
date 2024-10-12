import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  botName: "CivicConnect",
  initialMessages: [createChatBotMessage(`Heyo!`)],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#4C63FF",
    },
    chatButton: {
      backgroundColor: "#4C63FF",
    },
  },
};

export default config;