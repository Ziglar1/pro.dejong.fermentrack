if (process.env.DEBUG === '1')
{
    require('inspector').open(9222, '0.0.0.0', false);
}

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
                try {
                    const data = JSON.parse(bodyMsg);
                    const gravitySensor = data.gravity_sensors.find((sensor) => {
                        return sensor.name === 'iSpindel001';
                    });
                    const data = JSON.parse(bodyMsg);
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


                } catch(e) {
                    return console.error(e);
                }
            });};
        const server = http.createServer(requestListener);
        server.listen(8000);
    };

}

module.exports = MyApp;