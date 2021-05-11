'use strict';

const Homey = require('homey');
const http = require('http');

class MyApp extends Homey.App
{
    /**
     * onInit is called when the app is initialized.
     */
    async onInit()
    {
        this.log('MyApp has been initialized');
        this.pushServerPort = 8000;
        this.runListener();
        this.detectedGateways = [];
    }

    async runListener() {
        const requestListener = (request, response) => {
            let body = '';
            request.on('data', (chunk) => {
                body += chunk.toString(); // convert Buffer to string
                if (body.length > 10000) {
                    this.updateLog("Push data error: Payload too large", 0);
                    response.writeHead(413);
                    response.end('Payload Too Large');
                    body = '';
                    return;
                }
            });
            request.on('end', () => {
                let bodyMsg = body;
                body = '';
                response.writeHead(200);
                response.end('ok');
                const data = JSON.parse(bodyMsg);
                console.log(data);
            });
        }
        const server = http.createServer(requestListener);
        server.listen(8000);
    }

    async getSomething()
    {
        return "";
    }

    async addSomething(body)
    {
        this.log(body);
    }

    async updateSomething(id, body)
    {
        this.log(id, body);
    }

    async deleteSomething(id)
    {
        this.log(id);
    }
}

module.exports = MyApp;