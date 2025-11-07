import localforage from "localforage"

const connectESP = async t => {
    const esploaderMod = await window.esptoolPackage;
    const device = await navigator.serial.requestPort();
    
    t.log("Connecting...");
    
    // Create Transport instance (esptool-js API)
    const transport = new esploaderMod.Transport(device, true);
    
    // Create ESPLoader with new API structure
    const loader = new esploaderMod.ESPLoader({
        transport: transport,
        baudrate: t.baudRate,
        terminal: {
            clean: () => {},
            writeLine: (data) => t.log(data),
            write: (data) => t.log(data)
        }
    });
    
    t.log("Connected successfully.");
    
    return loader;
};

const formatMacAddr = (macAddr) => {
    return macAddr.map((value) => value.toString(16).toUpperCase().padStart(2, '0')).join(':')
}

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const defaultFiles = (chipName) => {
    if (chipName.includes('ESP32')) {
        return [
            { offset: '1000' },
            { offset: '8000' },
            { offset: 'E000' },
            { offset: '10000' }
        ]
    } else {
        return [
            { offset: 0 }
        ]
    }
}

const saveFiles = (newFiles) => {
    localforage.setItem('uploads', newFiles)
}

const loadFiles = async (chipName) => {
    const value = await localforage.getItem('uploads')

    if (value) {
        return value
    }

    return defaultFiles(chipName)
}

const supported = () => {
    return ('serial' in navigator)
}

export { connectESP, formatMacAddr, sleep, defaultFiles, saveFiles, loadFiles, supported }