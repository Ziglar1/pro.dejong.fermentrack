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
        this.runsListener();
        this.detectedGateways = [];
    }

    async runsListener()
    {
        const requestListener = (request, response) =>
        {
            let body = '';
            request.on('data', chunk =>
            {
                body += chunk.toString(); // convert Buffer to string
                if (body.length > 10000)
                {
                    this.updateLog("Push data error: Payload too large", 0);
                    response.writeHead(413);
                    response.end('Payload Too Large');
                    body = '';
                    return;
                }
            });
            request.on('end', () =>
            {
                let bodyMsg = body;
                body = '';
                response.writeHead(200);
                response.end('ok');
                try
                {
                    const data = JSON.parse('{"' + bodyMsg.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function(key, value) { return key === "" ? value : decodeURIComponent(value); });

                    // Update discovery array used to add devices
                    if (this.detectedGateways.findIndex(x => x.PASSKEY === data.PASSKEY) === -1)
                    {
                        this.detectedGateways.push(data);
                    }

                    const drivers = this.homey.drivers.getDrivers();
                    for (const driver in drivers)
                    {
                        let devices = this.homey.drivers.getDriver(driver).getDevices();
    
                        for (let i = 0; i < devices.length; i++)
                        {
                            let device = devices[i];
                            if (device.updateCapabilities)
                            {
                                device.updateCapabilities(data);
                            }
                        }
                    }
    
                    this.log(data);
                }
                catch(err)
                {
                    this.log(err);
                }
            });
        };

        const server = http.createServer(requestListener);
        server.listen(this.pushServerPort);
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