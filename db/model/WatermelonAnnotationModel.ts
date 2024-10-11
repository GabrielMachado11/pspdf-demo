import {Model} from '@nozbe/watermelondb';
import {field, date} from '@nozbe/watermelondb/decorators';

export default class WatermelonAnnotationModel extends Model {
  static table = 'annotation';

  @field('pspdf_name') pspdfName!: string;
  @field('content') content!: string;
  @date('is_deleted') isDeleted!: boolean;
}
