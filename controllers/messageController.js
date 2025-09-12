import Message from "../models/messageModel.js";

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