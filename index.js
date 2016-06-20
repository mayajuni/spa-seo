/**
 * Created by mayajuni on 2016-06-19.
 */
const path = require('path');
const http = require('http');
const Url = require('url');
const fs = require("fs");
const childProcess = require('child_process');
const phantomjs = require('phantomjs-prebuilt');

class Spaseo {
    constructor(port, fileDirectory) {
        this.binPath = phantomjs.path;
        this.port = port | 9999;
        this.fileDirectory = fileDirectory ? fileDirectory : path.join(__dirname, 'files');
        this.protocol = 'http';
        this.mkdir();
    }

    mkdir() {
        if(!fs.existsSync(this.fileDirectory)) {
            fs.mkdirSync(this.fileDirectory);
        }
    }

    startServer() {
        http.createServer((req, res)=> {
            res.writeHead(200, {'Content-Type': 'text/html'});
            const params = Url.parse(req.url,true);
            if(req.headers['x-forwarded-proto']) {
                this.protocol = req.headers['x-forwarded-proto'];
            }
            let url = req.headers.host+req.url;
            if(params.query.url) {
                url = params.query.url.replace('http://', '').replace('https://', '');
            }
            const htmlFile = `${encodeURIComponent(url)}.html`;
            const htmlFilePath = path.join(this.fileDirectory, htmlFile);

            if(fs.existsSync(htmlFilePath)) {
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
                    `${this.protocol}://${url}`
                ];
                childProcess.execFile(`${this.binPath}`, childArgs, (err, stdout) => {
                    if(stdout){
                        if(!(stdout === 'bad_network' || stdout === 'need_url' || stdout === 'timeout')) {
                            fs.writeFileSync(htmlFilePath, stdout, 'utf8');
                        } else {
                            res.writeHead(400);
                        }
                        res.write(stdout);
                        res.end();
                    }
                });
            }
        }).listen(this.port, () => {
            console.log(`Start server ${this.port}`);
        });
    }
}

module.exports = Spaseo;