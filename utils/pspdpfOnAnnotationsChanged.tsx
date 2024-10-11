import {
  IAnnotation,
  deleteAnnotationByPspdfName,
  hasAnnotationByPsdpdfName,
  insertAnnotation,
  updateAnnotationContentByPspdfName,
} from '../db/repositories/annotationRepository';
import {PSPDFOnAnnotationsChangedPayload, PSPDFAnnotation} from './types';

export const pspdpfOnAnnotationsChanged = async (
  payload: PSPDFOnAnnotationsChangedPayload,
) => {
  if (payload.change === 'added') {
    return Promise.all(
      payload.annotations.map(async (annotation: PSPDFAnnotation) => {
        const hasAnnotation = await hasAnnotationByPsdpdfName(annotation.name);

        if (hasAnnotation) return;

        return insertAnnotation({
          pspdfName: annotation.name,
          content: annotation,
        });
      }),
    );
  }

  if (payload.change === 'changed') {
    return Promise.all(
      payload.annotations.map((annotation: PSPDFAnnotation) =>
        updateAnnotationContentByPspdfName(annotation.name, annotation),
      ),
    );
  }

  if (payload.change === 'removed') {
    return Promise.all(
      payload.annotations.map((annotation: PSPDFAnnotation) =>
        deleteAnnotationByPspdfName(annotation.name),
      ),
    );
  }

  console.log('unmapped event change', payload.change);
};
