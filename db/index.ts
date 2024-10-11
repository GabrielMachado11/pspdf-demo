import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {Database} from '@nozbe/watermelondb';
import {Platform} from 'react-native';
import migrations from './model/migrations';
import schema from './model/schema';
import WatermelonAnnotationModel from './model/WatermelonAnnotationModel';

const adapter = new SQLiteAdapter({
  schema,
  migrations: __DEV__ ? undefined : migrations,
  dbName: 'p4ed-mobile',
  jsi: Platform.OS === 'ios',
});

export const database = new Database({
  adapter: adapter,
  modelClasses: [WatermelonAnnotationModel],
});
