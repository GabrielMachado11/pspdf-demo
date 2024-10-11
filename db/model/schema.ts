import {appSchema, tableSchema} from '@nozbe/watermelondb';

const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'annotation',
      columns: [
        {name: 'pspdf_name', type: 'string'},
        {name: 'content', type: 'string', isIndexed: false},
        {
          name: 'is_deleted',
          type: 'boolean',
          isIndexed: true,
        },
      ],
    }),
  ],
});

export default schema;
