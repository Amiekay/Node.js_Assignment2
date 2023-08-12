const http = require('http');
const path = require('path');

const htmlPage = path.join(__dirname, 'index.html');


const HOSTNAME = 'localhost';
const PORT = '7000';

function requestHandler(req, res) {
   res.end(htmlPage) 
}

const server = http.createServer(requestHandler)
server.listen(PORT, HOSTNAME, (err)=> {
    if(err){
        console.log(err)
        return
    }
    console.log(`server started succesfully at http://${HOSTNAME}:${PORT}`)
})