import React, {useRef} from 'react';
import PSPDFKitView, {Toolbar} from 'react-native-pspdfkit';
import {Button, NativeModules, Platform} from 'react-native';
const PSPDFKit = NativeModules.PSPDFKit;
PSPDFKit.setLicenseKey(null); // Or your valid license keys using `setLicenseKeys`.

export const pspdfMainToolbar: Toolbar = {
  // Android only.
  toolbarMenuItems: {
    buttons: [
      'searchButtonItem',
      'annotationButtonItem',
      {
        image: 'check_icon',
        id: 'custom_check_action',
        title: 'Check',
      },
    ],
  },
  // iOS only.
  leftBarButtonItems: {
    buttons: ['searchButtonItem', 'annotationButtonItem'],
  },
};

const DOCUMENT =
  Platform.OS === 'ios' ? 'Document.pdf' : 'file:///android_asset/Document.pdf';

function App(): JSX.Element {
  const psdpdfRef = useRef<PSPDFKitView>(null);

  const handleShowIcon = () => {
    console.log('handleShowIcon');

    psdpdfRef.current?.setToolbar({
      toolbarMenuItems: {
        buttons: [
          ...pspdfMainToolbar.toolbarMenuItems!.buttons,
          {
            image: 'close_icon',
            id: 'custom_close_action',
            title: 'Close',
          },
        ],
      },
    });
  };

  const onCustomToolbarButtonTapped = (event: {id: string}) => {
    console.log(event.id);
  };

  return (
    <>
      <PSPDFKitView
        document={DOCUMENT}
        ref={psdpdfRef}
        configuration={{
          showThumbnailBar: 'scrollable',
          pageTransition: 'scrollContinuous',
          scrollDirection: 'vertical',
        }}
        toolbar={pspdfMainToolbar}
        fragmentTag="PDF1"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{flex: 1}}
        onCustomToolbarButtonTapped={onCustomToolbarButtonTapped}
      />

      <Button title="SHOW ICON" onPress={handleShowIcon} />
    </>
  );
}

export default App;
