import React, {useRef} from 'react';
import PSPDFKitView, {Toolbar} from 'react-native-pspdfkit';
import {Button, NativeModules, Platform, View} from 'react-native';
const PSPDFKit = NativeModules.PSPDFKit;
PSPDFKit.setLicenseKey(null); // Or your valid license keys using `setLicenseKeys`.

export const pspdfMainToolbar: Toolbar = {
  // Android only.
  toolbarMenuItems: {
    buttons: ['searchButtonItem', 'annotationButtonItem'],
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

  const handleShowCustomIcon = () => {
    psdpdfRef.current?.setToolbar({
      ...pspdfMainToolbar,
      toolbarMenuItems: {
        ...pspdfMainToolbar.toolbarMenuItems,
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

  const handleShowExistentIcon = () => {
    psdpdfRef.current?.setToolbar({
      ...pspdfMainToolbar,
      toolbarMenuItems: {
        ...pspdfMainToolbar.toolbarMenuItems,
        buttons: [
          ...pspdfMainToolbar.toolbarMenuItems!.buttons,
          'printButtonItem',
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
    <View style={{display: 'flex', flex: 1, width: '100%'}}>
      <View style={{flex: 1}}>
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
      </View>

      <View style={{display: 'flex', flexDirection: 'row', gap: 16}}>
        <Button title="SHOW CUSTOM ICON" onPress={handleShowCustomIcon} />
        <Button
          title="SHOW CUSTOM AND PRINT ICON"
          onPress={handleShowExistentIcon}
        />
      </View>
    </View>
  );
}

export default App;
