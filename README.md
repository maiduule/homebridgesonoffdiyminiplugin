# Homebridge Sonoff DIY mini plugin

This is simple Homebridge accessory plugin for Sonoff DIY mini rest api. It will only trigger on/off switch action.

# Example configuration

```json
"accessories": [
        {
            "accessory": "SonoffDIYMini",
            "name": "SonoffDIYMini",
            "address": "192.168.8.196", //Sonoff DIY mini ip
            "port": "8081" // Sonoff DIY mini REST API port
        }
    ]
```