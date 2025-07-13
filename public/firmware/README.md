# Firmware Directory

This directory contains pre-built firmware files for ESP32/ESP8266 devices and a manifest.json file that defines available firmware options.

## Files Structure
- `manifest.json` - Configuration file listing all available firmware
- `*.bin` - Binary firmware files
- `README.md` - This documentation file

## Manifest.json Format
```json
{
  "name": "Your Firmware Collection Name",
  "builds": [
    {
      "chipFamily": "ESP32",
      "description": "Firmware description with features",
      "path": "firmware-file.bin",
      "address": "10000"
    }
  ]
}
```

### Field Descriptions:
- `name`: Display name for the firmware collection
- `builds`: Array of available firmware builds
- `chipFamily`: Target chip family (ESP32, ESP8266, ESP32C3, ESP32S2, ESP32S3, etc.)
- `description`: Detailed description of firmware features and functionality
- `path`: Path to the binary file (relative to firmware directory)
- `address`: Flash address in hex string format (e.g., "10000" for 0x10000)

### Common Flash Addresses:
- **ESP32/ESP32C3**: "10000" (0x10000) - Application partition
- **ESP8266**: "0" (0x0) - Boot partition  
- **Bootloader**: "1000" (0x1000) - ESP32 bootloader
- **Partition table**: "8000" (0x8000) - ESP32 partition table

## Usage
1. The web app automatically loads manifest.json when connecting
2. Users can select from available firmware options
3. Selected firmware is loaded and flashed to the device

## Adding New Firmware
1. Place your compiled `.bin` file in this directory
2. Update `manifest.json` with firmware information
3. Commit the files to the repository

## Firmware Details
- **Default Flash Address**: 0x10000 (can be customized per firmware)
- **Supported Chips**: ESP32, ESP8266
- **File Format**: Binary (.bin) files only
