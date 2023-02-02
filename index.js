/**
 * First Task using Node.js
 */
// const hello = "hello world";
// console.log(hello);

/* Synchronous (Blocking) Code */
/**
 * How to read File using Node.js
 *  => require fs "File System"
 *  => fs.readFileSync(Path, Encoding )
 */

const fs = require("fs");
// HTTP Server
const http = require("http");
// URL
const url = require("url");

//////////////////////////////////////////////////
// File System
// const textIn = fs.readFileSync('./txt/input.txt','utf-8')
// console.log(textIn)

/**
 * How to write File using Node.js
 *  => require fs "File System"
 *  => fs.writeFileSync(Path, Variable how want to Add )
 */

//  const textOut = `this is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`
//  fs.writeFileSync('./txt/output.txt', textOut)
//  console.log('File written')

/* asynchronous (Non-Blocking) Code */
// fs.readFile('./txt/start.txt','utf-8' ,( err,data1) => {
//     if(err) return console.log("Error reading file")
//     fs.readFile(`./txt/${data1}.txt`,'utf-8' ,( err,data2) => {
//         console.log(data2)
//         fs.readFile('./txt/append.txt','utf-8' ,( err,data3) => {
//             console.log(data3)

//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}` ,'utf-8', err => {
//                 console.log('Your file has been written successfully')
//             })
//         })
//     })
// })
// console.log("Will Read File!")

///////////////////////////////////////////
// Server

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
  output = output.replace(/{%IMAGE%}/g, product.image)
  output = output.replace(/{%PRICE%}/g, product.price)
  output = output.replace(/{%FROM%}/g, product.from)
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
  output = output.replace(/{%QUANTITY%}/g, product.quantity)
  output = output.replace(/{%DESCRIPTION%}/g, product.description)
  output = output.replace(/{%ID%}/g, product.id)

  if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')

  return output
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
 
const server = http.createServer((req, res) => {

  const {query,pathname} = url.parse(req.url,true)
  const pathName = req.url;


  // Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    const cardsHtml =dataObj.map(el =>  replaceTemplate(tempCard, el)).join('')
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
    res.end(output);

    // Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const product = dataObj[query.id]
    const output = replaceTemplate(tempProduct,product)
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);

    // Not Found
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found</h1>");
  }
});
server.listen(3000, "127.0.0.1", () => {
  console.log("Listening to requests on port 3000");
});
