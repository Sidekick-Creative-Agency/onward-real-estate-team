import * as migration_20250117_201720 from './20250117_201720';
import * as migration_20260624_000000 from './20260624_000000';

export const migrations = [
  {
    up: migration_20250117_201720.up,
    down: migration_20250117_201720.down,
    name: '20250117_201720'
  },
  {
    up: migration_20260624_000000.up,
    down: migration_20260624_000000.down,
    name: '20260624_000000'
  },
];
