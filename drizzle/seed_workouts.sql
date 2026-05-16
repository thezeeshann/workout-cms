-- Optional: run after migrations to populate example templates.
-- psql "$DATABASE_URL" -f drizzle/seed_workouts.sql

INSERT INTO workouts (id, name, description, split_type, is_template)
VALUES
  (
    'a0000001-0000-4000-8000-000000000001',
    'Push day',
    'Chest, shoulders, triceps emphasis.',
    'push_pull_legs',
    true
  ),
  (
    'a0000002-0000-4000-8000-000000000002',
    'Pull day',
    'Back and biceps.',
    'push_pull_legs',
    true
  ),
  (
    'a0000003-0000-4000-8000-000000000003',
    'Leg day',
    'Quads, hamstrings, calves.',
    'push_pull_legs',
    true
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO workout_exercises (workout_id, exercise_name, sets, reps, sort_order, notes)
VALUES
  ('a0000001-0000-4000-8000-000000000001', 'Barbell bench press', 4, '6-10', 0, NULL),
  ('a0000001-0000-4000-8000-000000000001', 'Overhead press', 3, '8-12', 1, NULL),
  ('a0000001-0000-4000-8000-000000000001', 'Tricep pushdown', 3, '12-15', 2, NULL),
  ('a0000002-0000-4000-8000-000000000002', 'Deadlift', 3, '5-8', 0, NULL),
  ('a0000002-0000-4000-8000-000000000002', 'Lat pulldown', 3, '10-12', 1, NULL),
  ('a0000002-0000-4000-8000-000000000002', 'Barbell curl', 3, '10-12', 2, NULL),
  ('a0000003-0000-4000-8000-000000000003', 'Back squat', 4, '6-10', 0, NULL),
  ('a0000003-0000-4000-8000-000000000003', 'Romanian deadlift', 3, '8-12', 1, NULL),
  ('a0000003-0000-4000-8000-000000000003', 'Leg curl', 3, '12-15', 2, NULL);
