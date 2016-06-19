/**
 * Created by mayajuni on 2016-06-19.
 */
const path = require('path');
const http = require('http');
const fs = require("fs");
const childProcess = require('child_process');
const phantomjs = require('phantomjs-prebuilt');

const binPath = phantomjs.path;
const port = process.env.PORT ? process.env.PORT : 9999;
const fileDirectory = process.env.FILE_DIRECTORY ? process.env.FILE_DIRECTORY : path.join(__dirname, 'files');
const protocol = process.env.PROTOCOL ? process.env.PROTOCOL : 'http';
if(!process.env.FILE_DIRECTORY) {
    if(!fs.existsSync(fileDirectory)) {
        fs.mkdirSync(fileDirectory);
    }
}
http.createServer((req, res)=> {
    res.writeHead(200, {'Content-Type': 'text/html'});
    const htmlFile = `${encodeURIComponent(req.headers.host+req.url)}.html`;
    const htmlFilePath = path.join(fileDirectory, htmlFile);
    if(fs.existsSync(htmlFilePath)) {
        console.log(0);
        fs.readFile(htmlFilePath, (err, data) => {
            if(err){
                res.writeHead(404);
                res.write("Not Found!");
            }
            res.write(data);
            res.end();
        })
    }else{
        const childArgs = [
            path.join(__dirname, 'src', 'crawling.js'),
            `${protocol}://${(req.headers.host+req.url)}`
        ];
        childProcess.execFile(`${binPath}`, childArgs, (err, stdout, stderr) => {
            if(!(stdout === 'bad_network' || stdout === 'need_url')) {
                fs.writeFileSync(htmlFilePath, stdout, 'utf8');
            }
            res.write(stdout);
            res.end();
        });
    }
}).listen(port, () => {
    console.log(`Start server ${port}`);
});

