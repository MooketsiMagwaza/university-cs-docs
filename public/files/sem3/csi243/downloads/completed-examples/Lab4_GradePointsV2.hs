-- Title: Convert scores out of twenty to grade points.
{-
QUESTION
Write gps2 to return the grade point using guards.
Use scores out of 20: 0-7 F/0, 8 E/1, 9 E+/1.5, 10 D/2,
11 D+/2.5, 12 C/3, 13 C+/3.5, 14 B/4, 15 B+/4.5, 16-20 A/5.
Reject scores outside the stated range with an error.
-}

-- Read the question: Write the specified grade conversion with explicit input and output types.
-- Plan: Use ordered guards for bands and literal patterns for exact values.
gps2 :: Int -> Double
-- Ascending guards include each lower boundary automatically.
gps2 s
  | s < 0 || s > 20 = error "Score outside range"
  | s < 8 = 0.0
  | s < 9 = 1.0
  | s < 10 = 1.5
  | s < 11 = 2.0
  | s < 12 = 2.5
  | s < 13 = 3.0
  | s < 14 = 3.5
  | s < 15 = 4.0
  | s < 16 = 4.5
  | otherwise = 5.0

main :: IO ()
main = do
  print (gps2 0)  -- expected: 0.0
  print (gps2 8)  -- expected: 1.0
  print (gps2 9)  -- expected: 1.5
  print (gps2 10)  -- expected: 2.0
  print (gps2 11)  -- expected: 2.5
  print (gps2 12)  -- expected: 3.0
  print (gps2 13)  -- expected: 3.5
  print (gps2 14)  -- expected: 4.0
  print (gps2 15)  -- expected: 4.5
  print (gps2 16)  -- expected: 5.0
  print (gps2 20)  -- expected: 5.0
