import React, {useEffect, useRef, useState} from 'react';
import PSPDFKitView, {Toolbar} from 'react-native-pspdfkit';
import {Button, NativeModules, Platform, Text, View} from 'react-native';
import {listAnnotation} from './db/repositories/annotationRepository';
import {pspdpfOnAnnotationsChanged} from './utils/pspdpfOnAnnotationsChanged';
import {AnnotationsJSON, PSPDFOnAnnotationsChangedPayload} from './utils/types';
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
  const [loadingAnnotations, setLoadingAnnotations] = useState<boolean>(true);

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

  const loadRefAnnotations = async (annotationsJSON: AnnotationsJSON) => {
    try {
      await psdpdfRef.current?.addAnnotations(annotationsJSON);
    } catch (error) {
      console.log('loadAnnotations error');
    } finally {
      setLoadingAnnotations(false);
    }
  };

  const loadAnnotations = async () => {
    const result = await listAnnotation();

    const annotations = result.map(item => {
      return JSON.parse(item.content);
    });

    const annotationsJSON = {
      annotations,
      format: 'https://pspdfkit.com/instant-json/v1',
    };

    setTimeout(async () => {
      await loadRefAnnotations(annotationsJSON);
    }, 3000);
  };

  const onAnnotationsChangedCallback = (
    payload: PSPDFOnAnnotationsChangedPayload,
  ) => {
    if (loadingAnnotations) return;

    pspdpfOnAnnotationsChanged(payload);
  };

  useEffect(() => {
    loadAnnotations();
  }, []);

  return (
    <>
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
            onAnnotationsChanged={onAnnotationsChangedCallback}
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

      {loadingAnnotations && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            justifyContent: 'center',
          }}>
          <Text>Loading annotations...</Text>
        </View>
      )}
    </>
  );
}

export default App;
