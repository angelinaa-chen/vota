import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  botName: "Francesca (our beautiful & wonderful chatbot)",
  initialMessages: [createChatBotMessage(`Hi, I'm Francesa! It's nice to meet you -- feel free to ask me anything related to voting or politics. I'm happy to help!`)],
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