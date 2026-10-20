-- Title: Convert percentages using revised grade-point boundaries.
{-
QUESTION
Write gps3 to return the grade point using guards.
Use revised percentage bands: 0-49 F/0, 50-54 E/1, 55-59 E+/1.5,
60-64 D/2, 65-69 D+/2.5, 70-74 C/3, 75-79 C+/3.5,
80-84 B/4, 85-89 B+/4.5, 90-100 A/5.
Reject scores outside the stated range with an error.
-}

gps3 :: Int -> Double
gps3 = undefined -- Your answer here

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
