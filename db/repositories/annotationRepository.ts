import {Q, Collection} from '@nozbe/watermelondb';
import {database} from '..';
import WatermelonAnnotationModel from '../model/WatermelonAnnotationModel';

export interface IAnnotation {
  pspdfName: string;
  content: object;
  id: string;
}

const annotationCollection: Collection<WatermelonAnnotationModel> =
  database.get('annotation');

export const hasAnnotationByPsdpdfName = async (
  pspdfName: IAnnotation['pspdfName'],
) => {
  try {
    const existentItems = await annotationCollection.query(
      Q.where('pspdf_name', pspdfName),
    );
    const firstItem = existentItems?.length ? existentItems[0] : undefined;

    return !!firstItem;
  } catch (error) {
    return null;
  }
};

export const deleteAnnotationByPspdfName = async (
  pspdfName: IAnnotation['pspdfName'],
) => {
  try {
    const item = await database.write(async () => {
      const existentItems = await annotationCollection.query(
        Q.where('pspdf_name', pspdfName),
      );
      const firstItem = existentItems?.length ? existentItems[0] : undefined;

      if (!firstItem) {
        return null;
      }

      const updatedItem = await firstItem.update(entry => {
        entry.isDeleted = true;
      });

      return updatedItem;
    });

    return item;
  } catch (error) {
    return null;
  }
};

export const updateAnnotationContentByPspdfName = async (
  pspdfName: IAnnotation['pspdfName'],
  content: IAnnotation['content'],
) => {
  try {
    const item = await database.write(async () => {
      const existentItems = await annotationCollection.query(
        Q.where('pspdf_name', pspdfName),
      );
      const firstItem = existentItems?.length ? existentItems[0] : undefined;

      if (!firstItem) {
        return null;
      }

      const updatedItem = await firstItem.update(entry => {
        entry.content = JSON.stringify(content);
      });

      return updatedItem;
    });

    return item;
  } catch (error) {
    return null;
  }
};

export const insertAnnotation = async (params: Omit<IAnnotation, 'id'>) => {
  try {
    const item = await database.write(async () => {
      const createdAnnotation = await annotationCollection.create(entry => {
        entry.pspdfName = params.pspdfName;
        entry.content = JSON.stringify(params.content);
      });

      return createdAnnotation;
    });

    return item;
  } catch (error) {
    return null;
  }
};

export const listAnnotation = async () => {
  try {
    const items = await annotationCollection.query([
      Q.where('is_deleted', false),
    ]);

    return items;
  } catch (error) {
    return [];
  }
};
