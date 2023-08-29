const http = require('http');
const path = require('path');
const fs = require ('fs');



const HOSTNAME = 'localhost';
const PORT = '5000';

const htmlPage = path.join(__dirname, 'index.html');
const errorPath = path.join(__dirname, 'error.html');


function requestHandler(req, res) {
    if (req.url === '/'){
        getPage(req, res);
    }

   if (req.url.endsWith(".html") && req.method === "GET") {
    try{
         getRequestedPage(req, res);
   } 
   catch (error){
    getErrorPage(req, res);
   }
}
}

const server = http.createServer(requestHandler);

server.listen(PORT, HOSTNAME, (err)=> {
    if(err){
        console.log(err)
        return
    }
    console.log(`server started succesfully at http://${HOSTNAME}:${PORT}`);
});

function getPage(req, res) {
    res.setHeader('content-type', 'text/html');
    res.writeHead(200);
    res.end(fs.readFileSync(htmlPage));
}


function getRequestedPage(req, res) {
    const file = req.url.split("/")[1];
    const actualPath = path.join(__dirname, file);
    const page = fs.readFileSync(file);
    res.setHeader('content-type', 'text/html');
    res.writeHead(200);
    res.end(page);
}
function getErrorPage(req, res){
    res.setHeader('content-type', 'text/html');
    res.writeHead(404);
    res.end(fs.readFileSync(errorPath));
}
