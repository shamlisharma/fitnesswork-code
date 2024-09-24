import { NetInfo } from 'react-native';

export function addNetworkCheckListener(callback) {
    NetInfo.isConnected.addEventListener('connectionChange', callback);
}

export function removeNetworkCheckListener() {
    NetInfo.isConnected.removeEventListener('connectionChange');
}

export function isNetworkAvailable(callback) {
    NetInfo.isConnected.fetch().then(isConnected => {
        callback(isConnected);
    });
}