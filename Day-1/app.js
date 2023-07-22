const http = require('http');

const port = 8000;

const server = http.createServer((req, res) => {
    console.log(req.url);

    //  Creating the API
    if(req.url == '/'){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write('<h3> Home Page </h3>');
        res.end();
    }else if(req.url == '/about'){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write('<h3> About Page </h3>');
        res.end();
    }else{
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.write('<h3> 404 Page Not Found </h3>');
        res.end();
    }
});

// Start The Server
server.listen(port, () => {
    console.log(`server start at ${port}`)
})
