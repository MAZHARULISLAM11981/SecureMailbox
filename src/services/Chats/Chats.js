import Chat from "../../models/Chats";
import sendData from "../../utils/response/sendData";

class Chats {
  async find(data) {
    const { from, to } = data.query;
    if (!from) return sendMessage("fail", "Provide sending email");
    if (!to) return sendMessage("fail", "Provide receiving email");

    const chatInfo = await Chat.find({
      $or: [
        { from, to },
        { to: from, from: to },
      ],
    });

    for (let i = 0; i < chatInfo.length; i++) {
      if (chatInfo[i].from === from) {
        chatInfo[i]._doc.type = "Send";
      } else {
        chatInfo[i]._doc.type = "Received";
      }
    }

    return sendData("ok", chatInfo);
  }

  async create(body) {
    const { message, from, to } = body;

    const createChatInfo = await Chat.create({
      message,
      from,
      to,
      createAt: Date.now(),
    });

    return sendData("ok", createChatInfo);
  }
}

export default Chats;
