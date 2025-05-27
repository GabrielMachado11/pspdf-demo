import React, {useRef} from 'react';
import PSPDFKitView, {
  AnnotationType,
  DocumentJSON,
  InkAnnotation,
} from 'react-native-pspdfkit';
import {Button, NativeModules, Platform, View} from 'react-native';

const PSPDFKit = NativeModules.PSPDFKit;
PSPDFKit.setLicenseKey(null); // Or your valid license keys using `setLicenseKeys`.

const basicInkAnnotation: InkAnnotation[] = [
  new InkAnnotation({
    type: 'pspdfkit/ink',
    bbox: [
      89.586334228515625, 98.5791015625, 143.12948608398438, 207.1583251953125,
    ],
    pageIndex: 0,
    isDrawnNaturally: false,
    lines: {
      intensities: [
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
      ],
      points: [
        [
          [92.086334228515625, 101.07916259765625],
          [92.086334228515625, 202.15826416015625],
          [138.12950134277344, 303.2374267578125],
        ],
        [
          [184.17266845703125, 101.07916259765625],
          [184.17266845703125, 202.15826416015625],
          [230.2158203125, 303.2374267578125],
        ],
      ],
    },
  }),
];

const inkAnnotation: DocumentJSON = {
  annotations: [
    {
      bbox: [
        89.586334228515625, 98.5791015625, 143.12948608398438,
        207.1583251953125,
      ],
      isDrawnNaturally: false,
      lineWidth: 5,
      lines: {
        intensities: [
          [0.5, 0.5, 0.5],
          [0.5, 0.5, 0.5],
        ],
        points: [
          [
            [92.086334228515625, 101.07916259765625],
            [92.086334228515625, 202.15826416015625],
            [138.12950134277344, 303.2374267578125],
          ],
          [
            [184.17266845703125, 101.07916259765625],
            [184.17266845703125, 202.15826416015625],
            [230.2158203125, 303.2374267578125],
          ],
        ],
      },
      opacity: 1,
      pageIndex: 0,
      name: 'A167811E-6D10-4546-A147-B7AD775FE8AC',
      strokeColor: '#AA47BE',
      type: 'pspdfkit/ink',
      v: 1,
    },
  ],
  format: 'https://pspdfkit.com/instant-json/v1',
};

const noteAnnotation: DocumentJSON = {
  annotations: [
    {
      v: 2,
      pageIndex: 0,
      bbox: [95, 115, 125, 127],
      opacity: 1,
      pdfObjectId: 200,
      creatorName: 'John Doe',
      createdAt: '2012-04-23T18:25:43.511Z',
      updatedAt: '2012-04-23T18:28:05.100Z',
      id: '01F46S31WM8Q46MP3T0BAJ0F87',
      name: '01F46S31WM8Q46MP3T0BAJ0F87',
      type: 'pspdfkit/note',
      text: {
        format: 'plain',
        value: 'Text for the note annotation',
      },
      icon: 'circle',
      color: '#80ff80',
    },
  ],
  format: 'https://pspdfkit.com/instant-json/v1',
};

const DOCUMENT =
  Platform.OS === 'ios' ? 'Document.pdf' : 'file:///android_asset/Document.pdf';

function App(): JSX.Element {
  const psdpdfRef = useRef<PSPDFKitView>(null);

  const loadAnnotations = async (
    annotations: any[] | AnnotationType[] | Record<string, any>,
  ) => {
    await psdpdfRef.current?.getDocument().addAnnotations(annotations);
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
          fragmentTag="PDF1"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{flex: 1}}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          gap: 16,
          marginBottom: 32,
          flexWrap: 'wrap',
        }}>
        <Button
          title="Load ink"
          onPress={() => loadAnnotations(inkAnnotation)}
        />
        <Button
          title="Load basic ink"
          onPress={() => loadAnnotations(basicInkAnnotation)}
        />
        <Button
          title="Load note"
          onPress={() => loadAnnotations(noteAnnotation)}
        />
      </View>
    </View>
  );
}

export default App;
