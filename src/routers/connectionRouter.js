const express = require('express');
const { userAuth } = require('../middlewares/userAuth');
const connectionRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest')

connectionRouter.post('/:status/:receiverId',userAuth,(req, res)=>{
    try{

        const user = req.user;
        const receiverId = req.params.receiverId;
        const status = req.params.status;
    
        const statusAllowed = ['like','dislike']
        if(!statusAllowed.includes(status)){
            throw new Error('status not allowed');
        }
    
        const receiver = ConnectionRequest.findById(receiverId);
        if(!receiver){
            throw new Error('Receiver is not part of us');
        }

        const isPrevRequestExists = ConnectionRequest.findOne({
            $or: [
                {senderId: user._id, receiverId: receiverId} , {receiverId: user._id, senderId: receiverId}
            ]
        })

        if(isPrevRequestExists){
            return res.status(400).send('connection already exists');
        }
    
        const connection = new ConnectionRequest({
            receiverId: receiverId,
            senderId: user._id,
            status: status
        })
    
        connection.save();
        res.status(200).send('connection sent successfully');
    }
    catch(err){
        res.status(400).send('error sending connection request '+ err.message)
    }
})

module.exports = connectionRouter;