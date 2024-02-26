const express = require("express")

const app = express()

const http = require("http")

const cors = require("cors")

const fs = require("fs")

const csv = require("csv-parser")

const {Server} = require("socket.io")
const { log } = require("console")

const server = http.createServer(app)

var roomNo = "", index = 0

var current_team = "", current_amount = 0
let base, flag = 1

var teams = {}
var aucList = {}
var players = {}

let socket_id, teamSize

app.use(cors())
const io = new Server(server, {
    cors:{
        origin:"http://localhost:3000",
        methods:["GET", "POST"]
    }
})

fs.readFile('teams.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }

    try {
        teams = JSON.parse(data);
    } catch (error) {
        console.error('Error parsing JSON data:', error);
    }
});
fs.readFile('auctionList.json','utf8',(err,data)=>{
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }
    try {
        aucList = JSON.parse(data);
    } catch (error) {
        console.error('Error parsing JSON data:', error);
    }
})

io.on("connection", (socket)=>{

    socket.on("create_room",(data)=>{
        roomNo = data
        socket.emit("room_created_successfully",{data})
        socket.join(roomNo)
    })

    socket.on("join_room",(data)=>{
        if(roomNo === data){
            socket.emit("room_joined", data)
            socket.join(data)
        }
        else{
            socket.emit("invalid_room")
        } 
    })
    
    // socket.on("send_message", (data)=>{
    //     // socket.broadcast.emit("receive_message", data.message)
    //     socket.to(data.room).emit("receive_message", data)
    //     // socket.to(admin_id).emit("message_from_user", data)
    // })

    socket.on("create_team",(data)=>{
        var status = teams[data]
        var Message = ""
        var nav_message = ""
        if(status.status === "Not Taken"){
            nav_message = "success"
            teams[data].status = "Taken"
            Message = "Team Created Successfully"
        }
        else{
            nav_message = "unsuccess"
            Message = "Team Alredy Taken"
        }
        teamSize = teams[data].players.length
        socket.emit("create_team_reply",{Message, nav_message, teamName:data, slots:teams[data].slots, purse:teams[data].rem_purse, teamSize})
        
    })

    socket.on("req_player",()=>{
        //Requesting Player
        flag = 1
        socket.emit("requested_player", {player :aucList[index]})
    })  

    socket.on("handle_bid", (data) => {
        current_team = data.team
        socket_id = data.id
        if(flag == 1){
            flag = 0
            base = data.basePrice
            current_amount =base
        }
        else if(current_amount<100){
            current_amount = Number(data.amount)+5
        }
        else if(current_amount>=100 && current_amount<200){
            current_amount = Number(data.amount)+10
        }
        else if(current_amount>=200 && current_amount<500){
            current_amount = Number(data.amount)+20
        }
        else if(current_amount>=500){
            current_amount = Number(data.amount)+25
        }
        data.amount = current_amount
        // Emit event to user
        
        io.emit("reply_handle_bid", data);
    })

    socket.on("update_bid", () => {
        io.emit("handle_update_emit", { team: current_team, amount: current_amount });
    })

    socket.on("handle_sold",(data)=>{
        let purse
        index+=1
        var teamName = data.cur_team
        if (teams.hasOwnProperty(teamName)) {
            teams[teamName].players.push(data.player);
        } else {
            console.log("Team doesn't exist.");
        }
        flag = 1
        purse = teams[data.cur_team].rem_purse - data.cur_amount
        teams[data.cur_team].rem_purse = purse
        let specialism = data.player["Specialism"]
        specialism = specialism.substring(0,1)+specialism.substring(1, specialism.length).toLowerCase()
        let nationality = data.player["Country"]
        if(nationality === "India"){
            teams[data.cur_team].slots[specialism].in = teams[data.cur_team].slots[specialism].in + 1 
        }
        else{
            teams[data.cur_team].slots[specialism].Over = teams[data.cur_team].slots[specialism].Over + 1 
        }
        teamSize = teams[data.cur_team].players.length
        io.emit("sold_success",{data})
        io.emit("requested_player", {player :aucList[index]})
        socket.to(socket_id).emit("update_team_data", {slots: teams[data.cur_team].slots, purse , teamSize});

    })

    socket.on("handle_unsold", ()=>{
        index+=1
        io.emit("requested_player",{player :aucList[index]})
    })

    socket.on("timer_update",(data)=>{
        io.emit("updated_time",data)
    })

  
    socket.on("user",()=>{
        socket.emit("user")
    })

    socket.on("admin",()=>{
        socket.emit("admin")
    })

})

app.get("/",(req, res)=>{
    res.json({"hey":"hello"})
})

server.listen(3001, ()=>{
    console.log("Server is running");
})

