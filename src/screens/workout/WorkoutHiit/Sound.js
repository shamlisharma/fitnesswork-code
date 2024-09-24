import Sound from 'react-native-sound';


const playSound = (soundName) => {
    var whoosh = new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // loaded successfully
        console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
      
        // Play the sound with an onEnd callback
        whoosh.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      });
      
      // Reduce the volume by half
      whoosh.setVolume(1);
}

export { playSound  };