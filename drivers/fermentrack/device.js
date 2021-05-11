'use strict';

const { Device } = require('homey');

class MyDevice extends Device {
  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('MyDevice has been initialized');
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('MyDevice has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log('MyDevice settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('MyDevice was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('MyDevice has been deleted');
  }

  async updateCapabilities(data)
  {
      const dd = this.getData();
      const sensor = data.gravity_sensors.find( ({name }) => name === dd.id);
      if (sensor)
      {
          this.setCapabilityValue('measure_gravity', Number(sensor.gravity));
          this.setCapabilityValue('measure_temperature', Number(sensor.temp));
          const batV = Number(data.battery);
            let batP = (batV - 3.2) / (4.3 - 3.2) * 100;
            if (batP > 100)
            {
                batP = 100;
            }
          this.setCapabilityValue('measure_battery', Number(batP));
      }
  }


}

module.exports = MyDevice;
