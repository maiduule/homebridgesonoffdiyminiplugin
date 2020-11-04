'use strict'

const http = require('http')

let Service, Characteristic

module.exports = (homebridge) => {
  /* this is the starting point for the plugin where we register the accessory */
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic
  homebridge.registerAccessory('homebridge-sonoff-diy-mini', 'SonoffDIYMini', SwitchAccessory)
}

class SwitchAccessory {
  constructor (log, config) {
    /*
     * The constructor function is called when the plugin is registered.
     * log is a function that can be used to log output to the homebridge console
     * config is an object that contains the config for this plugin that was defined the homebridge config.json
     */

    /* assign both log and config to properties on 'this' class so we can use them in other methods */
    this.log = log
    this.config = config

    /*
     * A HomeKit accessory can have many "services". This will create our base service,
     * Service types are defined in this code: https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js
     * Search for "* Service" to tab through each available service type.
     * Take note of the available "Required" and "Optional" Characteristics for the service you are creating
     */
    this.service = new Service.Switch(this.config.name)
  }

  getServices () {
    /*
     * The getServices function is called by Homebridge and should return an array of Services this accessory is exposing.
     * It is also where we bootstrap the plugin to tell Homebridge which function to use for which action.
     */

     /* Create a new information service. This just tells HomeKit about our accessory. */
    const informationService = new Service.AccessoryInformation()
        .setCharacteristic(Characteristic.Manufacturer, 'Default-Manufacturer')
        .setCharacteristic(Characteristic.Model, 'Default-Model')
        .setCharacteristic(Characteristic.SerialNumber, 'Default-Serial')

    /*
     * For each of the service characteristics we need to register setters and getter functions
     * 'get' is called when HomeKit wants to retrieve the current state of the characteristic
     * 'set' is called when HomeKit wants to update the value of the characteristic
     */
    this.service.getCharacteristic(Characteristic.On)
      .on('get', this.getOnCharacteristicHandler.bind(this))
      .on('set', this.setOnCharacteristicHandler.bind(this))

    /* Return both the main service (this.service) and the informationService */
    return [informationService, this.service]
  }

  setOnCharacteristicHandler (value, callback) {
    /* this is called when HomeKit wants to update the value of the characteristic as defined in our getServices() function */

    /*
     * The desired value is available in the `value` argument.
     * This is just an example so we will just assign the value to a variable which we can retrieve in our get handler
     */
    this.isOn = value

    /* Log to the console the value whenever this function is called */

    if(value == true){
        const data = JSON.stringify({
            "deviceid": "",
            "data": {
                "switch": "on"} 
            })
          
          const options = {
            hostname: this.config.address,
            port: this.config.port,
            path: '/zeroconf/switch',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': data.length
            }
          }
          
          const req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
          
            res.on('data', d => {

            })
          })
          
          req.on('error', error => {

          })
          
          req.write(data)
          req.end()
    }else{
        const data = JSON.stringify({
            "deviceid": "",
            "data": {
                "switch": "off"} 
            })
          
          const options = {
            hostname: this.config.address,
            port: this.config.port,
            path: '/zeroconf/switch',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': data.length
            }
          }
          
          const req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
          
            res.on('data', d => {

            })
          })
          
          req.on('error', error => {

          })
          
          req.write(data)
          req.end()
    }

        
    
    /*
     * The callback function should be called to return the value
     * The first argument in the function should be null unless and error occured
     */
    callback(null)
  }

  getOnCharacteristicHandler (callback) {
    /*
     * this is called when HomeKit wants to retrieve the current state of the characteristic as defined in our getServices() function
     * it's called each time you open the Home app or when you open control center
     */

    /* Log to the console the value whenever this function is called */
    this.log(`calling getOnCharacteristicHandler`, this.isOn)

    /*
     * The callback function should be called to return the value
     * The first argument in the function should be null unless and error occured
     * The second argument in the function should be the current value of the characteristic
     * This is just an example so we will return the value from `this.isOn` which is where we stored the value in the set handler
     */
    callback(null, this.isOn)
  }

}