const http = require('http');
const path = require('path');
const fs = require ('fs');

const cosmeticsPath = path.join(__dirname, 'db', 'cosmetics.json');



const HOSTNAME = 'localhost';
const PORT = '8000';


const cosmetics = [];

function requestHandler(req, res) {
    if(req.url === '/cosmetics' && req.method === 'POST'){
        createItem(req, res)
    }
    else if (req.url === '/cosmetics' && req.method === 'GET'){
        getAllItems(req, res)
    }
    // else if (req.url === '/cosmetics' && req.method === 'GET'){
    //     getItem(req, res)
    // }
    else if (req.url === '/cosmetics' && req.method === 'PUT'){
        updateItem(req, res)
    }
    else if (req.url === '/cosmetics' && req.method === 'DELETE'){
        deleteItem(req, res)
    }
}    


    // post/create new objects
    function createItem (req, res){
        const body = [];
        req.on('data', (chunk)=>{
            console.log({chunk})
            body.push(chunk)
        })
       
        req.on('end', ()=>{
        const bufferBody = Buffer.concat(body).toString()
        const bodyRequested = JSON.parse(bufferBody)
    
        // add created item to existing cosmetics.json file
        fs.readFile(cosmeticsPath, "utf8", (err, data) => {
         if (err) {
        console.log(err)
        res.writeHead(400)
        res.end("An error occured")
    }

    const oldCosmetics = JSON.parse(data)
    const allCosmetics = [...oldCosmetics, bodyRequested]


    fs.writeFile(cosmeticsPath, JSON.stringify(allCosmetics), (err) => {
        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end(JSON.stringify({
                message: 'Internal Server Error. Could not save book to database.'
            }));
        }

        res.end(JSON.stringify(allCosmetics));

            })
        })
    })
}

// get all items
function getAllItems(req, res){
    fs.readFile(cosmeticsPath, "utf8", (err, data) => {
        if (err) {
            console.log(err)
            res.writeHead(400)
            res.end("An error occured")
        }

        res.end(data)
    })
}


// function getItem(req, res){
//     fs.readFile(cosmeticsPath, "utf8", (err, cosmetics => {
//         if (err) {
//             console.log(err)
//             res.writeHead(400)
//             res.end("An error occured")
//         }
//         const itemsObj = JSON.parse(cosmetics)

//         const itemIndex = itemsObj.findIndex(cosmetics => cosmetics.id === itemsId)
    
//         if (itemIndex === -1) {
//             res.writeHead(404)
//             res.end("Item with the specified id not found!")
//             return
//         }
//     }))
// }
    


// update item
function updateItem(req, res) {const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedItems = Buffer.concat(body).toString()
        const detailsToUpdate = JSON.parse(parsedItems)
        const itemsId = detailsToUpdate.id

        fs.readFile(cosmeticsPath, "utf8", (err, cosmetics) => {
            if (err) {
                console.log(err)
                res.writeHead(400)
                res.end("An error occured")
            }

            const itemsObj = JSON.parse(cosmetics)

            const itemsIndex = itemsObj.findIndex(cosmetics => cosmetics.id === itemsId)

            if (itemsIndex === -1) {
                res.writeHead(404)
                res.end("item with the specified id not found!")
                return
            }

            const updatedItems = { ...itemsObj[itemsIndex], ...detailsToUpdate }
            itemsObj[itemsIndex] = updatedItems

            fs.writeFile(cosmeticsPath, JSON.stringify(itemsObj), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save book to database.'
                    }));
                }

                res.writeHead(200)
                res.end('file updated successfully');
            });

        })

    })
}

function deleteItem(req, res) {
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedItems = Buffer.concat(body).toString()
        const detailsToUpdate = JSON.parse(parsedItems)
        const itemsId = detailsToUpdate.id

        fs.readFile(cosmeticsPath, "utf8", (err, cosmetics) => {
            if (err) {
                console.log(err)
                res.writeHead(400)
                res.end("An error occured")
            }

            const itemsObj = JSON.parse(cosmetics)

            const itemIndex = itemsObj.findIndex(cosmetics => cosmetics.id === itemsId)

            if (itemIndex === -1) {
                res.writeHead(404)
                res.end("Item with the specified id not found!")
                return
            }

            // DELETE FUNCTION
            itemsObj.splice(itemIndex, 6)

            fs.writeFile(cosmeticsPath, JSON.stringify(itemsObj), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save book to database.'
                    }));
                }

                res.writeHead(200)
                res.end("Deletion successfull!");
            });

        })

    })
}












// create server

const server = http.createServer(requestHandler)

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server is listening on ${HOSTNAME}:${PORT}`)

})
