import React, {useEffect, useRef, useState} from 'react';
import PSPDFKitView, {Toolbar} from 'react-native-pspdfkit';
import {
  Button,
  Modal,
  NativeModules,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {listAnnotation} from './db/repositories/annotationRepository';
import {pspdpfOnAnnotationsChanged} from './utils/pspdpfOnAnnotationsChanged';
import {
  AnnotationsJSON,
  PSPDFAnnotation,
  PSPDFOnAnnotationsChangedPayload,
} from './utils/types';
import WatermelonAnnotationModel from './db/model/WatermelonAnnotationModel';
const PSPDFKit = NativeModules.PSPDFKit;
PSPDFKit.setLicenseKey(null); // Or your valid license keys using `setLicenseKeys`.

export const pspdfMainToolbar: Toolbar = {
  // Android only.
  toolbarMenuItems: {
    buttons: [
      'searchButtonItem',
      {
        image: 'summary_icon',
        id: 'custom_summary_action',
        title: 'Summary',
      },
      'annotationButtonItem',
    ],
  },
  // iOS only.
  leftBarButtonItems: {
    buttons: ['searchButtonItem', 'annotationButtonItem'],
  },
  rightBarButtonItems: {
    buttons: [
      'searchButtonItem',
      {
        image: 'summaryIcon.png',
        id: 'custom_summary_action',
        title: 'Summary',
      },
      'annotationButtonItem',
    ],
  },
};

const DOCUMENT =
  Platform.OS === 'ios' ? 'Document.pdf' : 'file:///android_asset/Document.pdf';

function App(): JSX.Element {
  const psdpdfRef = useRef<PSPDFKitView>(null);
  const [loadingAnnotations, setLoadingAnnotations] = useState<boolean>(true);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);
  const [annotations, setAnnotations] = useState<PSPDFAnnotation[]>([]);

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
    if (event.id === 'custom_summary_action') {
      setIsSummaryModalOpen(true);
    }
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

  const onDeleteAnnotation = async (annotation: PSPDFAnnotation) => {
    await psdpdfRef.current?.removeAnnotation(annotation);
    setIsSummaryModalOpen(false);
  };

  const getAnnotationsList = async () => {
    const result = await listAnnotation();

    const parseAnnotations: PSPDFAnnotation[] = result.map(item => {
      return JSON.parse(item.content);
    });

    setAnnotations(parseAnnotations);
  };

  useEffect(() => {
    loadAnnotations();
  }, []);

  useEffect(() => {
    getAnnotationsList();
  }, [isSummaryModalOpen]);

  return (
    <>
      {isSummaryModalOpen && (
        <Modal
          visible={isSummaryModalOpen}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsSummaryModalOpen(false)}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 12,
              flex: 1,
              paddingTop: 100,
              flexDirection: 'column',
              gap: 12,
            }}>
            <View style={{marginBottom: 20}}>
              <TouchableOpacity onPress={() => setIsSummaryModalOpen(false)}>
                <Text>Close modal</Text>
              </TouchableOpacity>
            </View>
            {annotations.map(annotation => (
              <View
                style={{flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}
                key={annotation.name}>
                <Text>
                  {typeof annotation.text === 'string'
                    ? annotation.text
                    : annotation.text?.value}
                </Text>
                <TouchableOpacity
                  onPress={() => onDeleteAnnotation(annotation)}>
                  <Text>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </Modal>
      )}
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
