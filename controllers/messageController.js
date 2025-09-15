import Message from "../models/messageModel.js";
import { isAdmin } from "./userContrller.js";

export async function createMessage (req, res) {
    if(req.user == null){
        res.status(404).json(
            { message : "Please login first"}
        )
        return;
    }

    const message = new Message(req.body)

    try{
        const response = await message.save()

        res.json(
            {
                message : "message sent successfully",
                chat : response
            }
        )

    }catch(error){
        console.log(error)
        res.status(500).json(
            {
                message : "Failed to send your message "
            }
        )
    }
}


export const getMessagesGrouped = async (req, res) => {
    if(!isAdmin(req)){
        console.log("Access denied Admin only")
        res.status(404).json(
            { message : "Access denied Admin only"}
        )
        return;
    }

  try {
    const messages = await Message.find().sort({ createdAt: 1 });

    // Group by email
    const grouped = {};
    messages.forEach(msg => {
      if (!grouped[msg.email]) {
        grouped[msg.email] = {
          email: msg.email,
          name: msg.name,
          messages: []
        };
      }
      grouped[msg.email].messages.push({
        text: msg.message,
        date: msg.createdAt
      });
    });

    res.json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
