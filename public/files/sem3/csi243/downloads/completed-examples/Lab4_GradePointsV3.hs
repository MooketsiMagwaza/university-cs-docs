-- Title: Convert percentages using revised grade-point boundaries.
{-
QUESTION
Write gps3 to return the grade point using guards.
Use revised percentage bands: 0-49 F/0, 50-54 E/1, 55-59 E+/1.5,
60-64 D/2, 65-69 D+/2.5, 70-74 C/3, 75-79 C+/3.5,
80-84 B/4, 85-89 B+/4.5, 90-100 A/5.
Reject scores outside the stated range with an error.
-}

-- Read the question: Write the specified grade conversion with explicit input and output types.
-- Plan: Use ordered guards for bands and literal patterns for exact values.
gps3 :: Int -> Double
-- Ascending guards include each lower boundary automatically.
gps3 s
  | s < 0 || s > 100 = error "Score outside range"
  | s < 50 = 0.0
  | s < 55 = 1.0
  | s < 60 = 1.5
  | s < 65 = 2.0
  | s < 70 = 2.5
  | s < 75 = 3.0
  | s < 80 = 3.5
  | s < 85 = 4.0
  | s < 90 = 4.5
  | otherwise = 5.0

main :: IO ()
main = do
  print (gps3 0)  -- expected: 0.0
  print (gps3 50)  -- expected: 1.0
  print (gps3 55)  -- expected: 1.5
  print (gps3 60)  -- expected: 2.0
  print (gps3 65)  -- expected: 2.5
  print (gps3 70)  -- expected: 3.0
  print (gps3 75)  -- expected: 3.5
  print (gps3 80)  -- expected: 4.0
  print (gps3 85)  -- expected: 4.5
  print (gps3 90)  -- expected: 5.0
  print (gps3 100)  -- expected: 5.0
