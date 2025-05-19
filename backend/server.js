import express from "express"
const app=express();
const port = 3000


let base = 0;
let nextSeqNum = 1;
let receiverBuffer = [];

app.get('/api/status/:max', (req, res) => {
  try{
    const max=parseInt(req.params.max);
    res.status(200).json({
        max,
        receiverBuffer,
        nextSeqNum,
        oldestAck:base
    })
  }catch(err){
    console.log("Error in getting status : ",err.message)
  }

})

app.post('/api/send/:max', (req, res) => {
  try{
    const max=parseInt(req.params.max);
    if(nextSeqNum<max+base+1){
       receiverBuffer.push(nextSeqNum)  
      nextSeqNum++;
    }else{
      res.status(400).json({
        message:"not possible to send above the window size"
      })
    }
    res.status(200).json({
        max,
        receiverBuffer,
        nextSeqNum,
        oldestAck:base
    })
  }catch(err){
    console.log("Error in sending packet : ",err.message)
  }

})

app.post('/api/ack/:max', (req, res) => {
  try{
    const max=parseInt(req.params.max);
    if(receiverBuffer.length != 0){
        receiverBuffer.shift();
        base++;
    }else{
      res.status(400).json({
        message:"not possible to delete an empty receiver buffer"
      })
    }
    res.status(200).json({
        max,
        receiverBuffer,
        nextSeqNum,
        oldestAck:base
    })
  }catch(err){
    console.log("Error in ack packets : ",err.message)
  }

})

app.post('/api/free-buffer/:max', (req, res) => {
  try{
    const max=parseInt(req.params.max);
    if(receiverBuffer.length != 0){
      while(receiverBuffer.length != 0){
        receiverBuffer.shift();
        base++;
      }
    }else{
      res.status(400).json({
        message:"not possible to delete an empty receiver buffer (free)"
      })
    }
    res.status(200).json({
        max,
        receiverBuffer,
        nextSeqNum,
        oldestAck:base
    })
  }catch(err){
    console.log("Error in ack pacts(free): ",err.message)
  }
})


app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})