import React from 'react';
import PSPDFKitView from 'react-native-pspdfkit';
import {NativeModules, Platform} from 'react-native';
const PSPDFKit = NativeModules.PSPDFKit;
PSPDFKit.setLicenseKey(null); // Or your valid license keys using `setLicenseKeys`.

const DOCUMENT =
  Platform.OS === 'ios' ? 'Document.pdf' : 'file:///android_asset/Document.pdf';

function App(): JSX.Element {
  return (
    <PSPDFKitView
      document={DOCUMENT}
      configuration={{
        showThumbnailBar: 'scrollable',
        pageTransition: 'scrollContinuous',
        scrollDirection: 'vertical',
      }}
      fragmentTag="PDF1"
      // eslint-disable-next-line react-native/no-inline-styles
      style={{flex: 1}}
    />
  );
}

export default App;
