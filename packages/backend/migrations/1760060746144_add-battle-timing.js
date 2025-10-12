/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // Add timing fields to battles table
  pgm.addColumns('battles', {
    scheduled_start_time: {
      type: 'timestamp with time zone',
      notNull: false,
      comment: 'When the battle is scheduled to start (optional)'
    },
    duration_minutes: {
      type: 'integer',
      notNull: false,
      default: 60,
      comment: 'Battle duration in minutes (default: 60 minutes)'
    },
    auto_end_time: {
      type: 'timestamp with time zone',
      notNull: false,
      comment: 'Calculated time when battle should automatically end'
    },
    ended_by: {
      type: 'varchar(50)',
      notNull: false,
      comment: 'How the battle ended: admin, timeout, or manual'
    }
  });

  // Add index for querying battles that need to auto-end
  pgm.createIndex('battles', ['auto_end_time'], {
    name: 'idx_battles_auto_end_time',
    where: 'auto_end_time IS NOT NULL AND status = \'active\''
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropIndex('battles', ['auto_end_time'], { name: 'idx_battles_auto_end_time' });
  pgm.dropColumns('battles', ['scheduled_start_time', 'duration_minutes', 'auto_end_time', 'ended_by']);
};
