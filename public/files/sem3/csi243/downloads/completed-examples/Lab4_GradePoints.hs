-- Title: Convert percentage scores to grade points.
{-
QUESTION
Write gps to return the grade point using guards.
Use the following percentage table.
Score bands: 0-39 F/0; 40-44 E/1; 45-49 E+/1.5; 50-54 D/2;
55-59 D+/2.5; 60-64 C/3; 65-69 C+/3.5; 70-74 B/4;
75-79 B+/4.5; 80-100 A/5.
Reject scores outside the stated range with an error.
Example: gps 52 returns 2.0.
-}

-- Read the question: Write the specified grade conversion with explicit input and output types.
-- Plan: Use ordered guards for bands and literal patterns for exact values.
gps :: Int -> Double
-- Ascending guards include each lower boundary automatically.
gps s
  | s < 0 || s > 100 = error "Score outside range"
  | s < 40 = 0.0
  | s < 45 = 1.0
  | s < 50 = 1.5
  | s < 55 = 2.0
  | s < 60 = 2.5
  | s < 65 = 3.0
  | s < 70 = 3.5
  | s < 75 = 4.0
  | s < 80 = 4.5
  | otherwise = 5.0

main :: IO ()
main = do
  print (gps 0)  -- expected: 0.0
  print (gps 40)  -- expected: 1.0
  print (gps 45)  -- expected: 1.5
  print (gps 50)  -- expected: 2.0
  print (gps 55)  -- expected: 2.5
  print (gps 60)  -- expected: 3.0
  print (gps 65)  -- expected: 3.5
  print (gps 70)  -- expected: 4.0
  print (gps 75)  -- expected: 4.5
  print (gps 80)  -- expected: 5.0
  print (gps 100)  -- expected: 5.0
