import React, {useRef, useState} from 'react';
import NutrientView, {
  DocumentJSON,
  Toolbar,
  type AnnotationType,
} from '@nutrient-sdk/react-native';
import {
  Button,
  NativeModules,
  Platform,
  ToastAndroid,
  View,
} from 'react-native';

const Nutrient = NativeModules.Nutrient;
Nutrient?.setLicenseKey(null); // Or your valid license keys using `setLicenseKeys`.

export const pspdfMenuItemGrouping = [
  'pen',
  'eraser',
  'freetext',
  'note',
  'highlight',
];

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

function App(): React.JSX.Element {
  const pdfRef = useRef<NutrientView>(null);
  const [annotations, setAnnotations] = useState<AnnotationType[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleShowCustomIcon = () => {
    pdfRef.current?.setToolbar({
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleShowExistentIcon = () => {
    pdfRef.current?.setToolbar({
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
    const document = pdfRef.current?.getDocument();
    const list = ((await document?.getAnnotations('all')) ??
      []) as AnnotationType[];

    setAnnotations(list);

    if (list.length) {
      await document?.removeAnnotations(list);
    }
  };

  const loadAnnotations = async () => {
    const annotationsJSON = new DocumentJSON();
    annotationsJSON.annotations = annotations;
    annotationsJSON.format = 'https://pspdfkit.com/instant-json/v1';

    console.log(JSON.stringify(annotations));

    setAnnotations([]);
    await pdfRef.current?.getDocument().applyInstantJSON(annotationsJSON);
  };

  return (
    <View style={{display: 'flex', flex: 1, width: '100%'}}>
      <View style={{flex: 1}}>
        <NutrientView
          document={DOCUMENT}
          ref={pdfRef}
          configuration={{
            androidEnableStylusOnDetection: true,
            showThumbnailBar: 'scrollable',
            pageTransition: 'scrollContinuous',
            scrollDirection: 'vertical',
          }}
          toolbar={pspdfMainToolbar}
          menuItemGrouping={pspdfMenuItemGrouping}
          fragmentTag="PDF1"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{flex: 1}}
          onCustomToolbarButtonTapped={onCustomToolbarButtonTapped}
          onAnnotationsChanged={(payload: {change?: string}) => {
            if (Platform.OS !== 'android') {
              return;
            }
            if (payload.change === 'added') {
              ToastAndroid.show('Some Annotation was added', 5 * 1000);
            }
          }}
        />
      </View>

      <View style={{flexDirection: 'row', gap: 16}}>
        <Button title="Save annotations" onPress={saveAnnotations} />
        <Button title="Load annotations" onPress={loadAnnotations} />
      </View>
    </View>
  );
}

export default App;
