import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import { GiftedChat } from "react-native-gifted-chat";
import { useState } from "react";
import axios from "axios";

import { rafflesStatue } from "../prompts/rafflesStatue";

const ConverseScreen = () => {
  const [messages, setMessages] = useState([]);

  const handleSend = async (newMessages = []) => {
    console.log(process);
    try {
      const userMessage = newMessages[0];

      setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, userMessage)
      );
      const messageText = userMessage.text.toLowerCase();
      const banned = ["GPT"]; // Banned words
      if (banned.some((ban) => messageText.includes(ban))) {
        const botMessage = {
          _id: Math.floor(Math.random() * 10000),
          text: "That's not very nice... Let's start over.",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "Statue",
          },
        };
        setMessages((prevMessages) =>
          GiftedChat.append(prevMessages, botMessage)
        );
        return;
      }
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          model: "text-davinci-003",
          prompt: `${rafflesStatue} Now, answer this question: ${messageText} Speak in the first person`,
          max_tokens: 500,
          temperature: 0.2,
          n: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );
      console.log(response.data);

      const answer = response.data.choices[0].text.trim();
      const botMessage = {
        _id: Math.floor(Math.random() * 10000),
        text: answer,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Statue",
        },
      };

      setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, botMessage)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => handleSend(newMessages)}
      user={{
        _id: 1,
      }}
    />
  );
};

export default ConverseScreen;
