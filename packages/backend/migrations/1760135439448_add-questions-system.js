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
  // Create the questions table for LeetCode 75 problems
  pgm.createTable('questions', {
    id: 'id',
    title: { type: 'varchar(255)', notNull: true },
    slug: { type: 'varchar(255)', notNull: true, unique: true },
    difficulty: { type: 'varchar(10)', notNull: true },
    problem_statement: { type: 'text', notNull: true },
    function_signature: { type: 'text', notNull: true },
    test_cases: { type: 'jsonb', notNull: true },
    constraints: { type: 'text' },
    examples: { type: 'jsonb' },
    hints: { type: 'jsonb' },
    tags: { type: 'jsonb' },
    leetcode_number: { type: 'integer', unique: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Create battle_question_pools table to track the 10 random questions for each battle
  pgm.createTable('battle_question_pools', {
    id: 'id',
    battle_id: { type: 'uuid', notNull: true, references: 'battles(id)', onDelete: 'CASCADE' },
    question_id: { type: 'integer', notNull: true, references: 'questions(id)', onDelete: 'CASCADE' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Add current_question_id to battles table to track the active question
  pgm.addColumn('battles', {
    current_question_id: { type: 'integer', references: 'questions(id)', onDelete: 'SET NULL' }
  });

  // Create indexes for performance
  pgm.createIndex('questions', 'difficulty');
  pgm.createIndex('questions', 'leetcode_number');
  pgm.createIndex('battle_question_pools', 'battle_id');
  pgm.createIndex('battle_question_pools', 'question_id');
  pgm.createIndex('battles', 'current_question_id');

  // Create unique constraint to prevent duplicate questions in the same battle pool
  pgm.createConstraint('battle_question_pools', 'unique_battle_question', 'UNIQUE(battle_id, question_id)');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // Remove the current_question_id column from battles
  pgm.dropColumn('battles', 'current_question_id');
  
  // Drop the battle_question_pools table
  pgm.dropTable('battle_question_pools');
  
  // Drop the questions table
  pgm.dropTable('questions');
};
