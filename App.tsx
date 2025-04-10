import React, {useEffect, useRef, useState} from 'react';
import PSPDFKitView, {NotificationCenter, Toolbar} from 'react-native-pspdfkit';
import {Button, NativeModules, Platform, TextInput, View} from 'react-native';

const PSPDFKit = NativeModules.PSPDFKit;
PSPDFKit.setLicenseKey(null); // Or your valid license keys using `setLicenseKeys`.

export interface PSPDFAnnotation {
  uuid: string;
  name: string;
  type: string;
  pageIndex: string;
  text?:
    | {
        format: string;
        value: string;
      }
    | string;
}

export const pspdfMainToolbar: Toolbar = {
  // Android only.
  toolbarMenuItems: {
    buttons: ['searchButtonItem', 'annotationButtonItem'],
  },
  // iOS only.
  leftBarButtonItems: {
    buttons: ['searchButtonItem', 'annotationButtonItem'],
  },
  rightBarButtonItems: {
    buttons: ['searchButtonItem', 'annotationButtonItem'],
  },
};

const DOCUMENT =
  Platform.OS === 'ios' ? 'Document.pdf' : 'file:///android_asset/Document.pdf';

function App(): JSX.Element {
  const psdpdfRef = useRef<PSPDFKitView>(null);
  const [annotations, setAnnotations] = useState<PSPDFAnnotation[]>([]);
  const [pageIndexText, setPageIndexText] = useState<string>('0');
  const [pageIndex, setPageIndex] = useState(0);

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

  const saveAnnotations = async () => {
    const allAnnotations = await psdpdfRef.current?.getAllAnnotations('all');
    setAnnotations(allAnnotations.annotations);

    if (allAnnotations.annotations.length) {
      await psdpdfRef.current?.removeAnnotations(allAnnotations.annotations);
    }
  };

  const loadAnnotations = async () => {
    const annotationsJSON = {
      annotations,
      format: 'https://pspdfkit.com/instant-json/v1',
    };

    console.log(JSON.stringify(annotations));

    setAnnotations([]);
    await psdpdfRef.current?.addAnnotations(annotationsJSON);
  };

  useEffect(() => {
    psdpdfRef.current
      ?.getNotificationCenter()
      .subscribe(NotificationCenter.AnnotationsEvent.REMOVED, (event: any) => {
        console.log('REMOVED', JSON.stringify(event));
      });

    psdpdfRef.current
      ?.getNotificationCenter()
      .subscribe(NotificationCenter.AnnotationsEvent.CHANGED, (event: any) => {
        console.log('CHANGED', JSON.stringify(event));
      });

    psdpdfRef.current
      ?.getNotificationCenter()
      .subscribe(NotificationCenter.AnnotationsEvent.ADDED, (event: any) => {
        console.log('ADDED', JSON.stringify(event));
      });
  }, []);

  return (
    <View style={{display: 'flex', flex: 1, width: '100%'}}>
      <View style={{flex: 1}}>
        <PSPDFKitView
          document={DOCUMENT}
          ref={psdpdfRef}
          pageIndex={pageIndex}
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

      <View
        style={{
          flexDirection: 'row',
          gap: 16,
          position: 'absolute',
          bottom: -20,
          backgroundColor: 'white',
          margin: 30,
        }}>
        <TextInput
          onChangeText={props => setPageIndexText(props)}
          value={pageIndexText}
          keyboardType="numeric"
          style={{flex: 1, color: 'black'}}
        />
        <Button
          title="Search"
          onPress={() => setPageIndex(Number(pageIndexText))}
        />
      </View>
    </View>
  );
}

export default App;
