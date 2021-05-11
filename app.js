'use strict';

const Homey = require('homey');

class MyApp extends Homey.App {
  async onInit() {
    const id = Homey.env.WEBHOOK_ID; // "56db7fb12dcf75604ea7977d"
    const secret = Homey.env.WEBHOOK_SECRET; // "2uhf83h83h4gg34..."
    const data = {
      // Provide unique properties for this Homey here
      deviceId: 'ispindel001',
    };

    const myWebhook = await this.homey.cloud.createWebhook(id, secret, data);

    myWebhook.on('message', args => {
      this.log('Got a webhook message!');
      this.log('headers:', args.headers);
      this.log('query:', args.query);
      this.log('body:', args.body);
    });
  }
}

module.exports = MyApp;