-- Title: Convert percentages using revised letter-grade boundaries.
{-
QUESTION
Write lgs3 to return the letter grade using guards.
Use revised percentage bands: 0-49 F/0, 50-54 E/1, 55-59 E+/1.5,
60-64 D/2, 65-69 D+/2.5, 70-74 C/3, 75-79 C+/3.5,
80-84 B/4, 85-89 B+/4.5, 90-100 A/5.
Reject scores outside the stated range with an error.
-}

-- Read the question: Write the specified grade conversion with explicit input and output types.
-- Plan: Use ordered guards for bands and literal patterns for exact values.
lgs3 :: Int -> String
-- Ascending guards include each lower boundary automatically.
lgs3 s
  | s < 0 || s > 100 = error "Score outside range"
  | s < 50 = "F"
  | s < 55 = "E"
  | s < 60 = "E+"
  | s < 65 = "D"
  | s < 70 = "D+"
  | s < 75 = "C"
  | s < 80 = "C+"
  | s < 85 = "B"
  | s < 90 = "B+"
  | otherwise = "A"

main :: IO ()
main = do
  print (lgs3 0)  -- expected: "F"
  print (lgs3 50)  -- expected: "E"
  print (lgs3 55)  -- expected: "E+"
  print (lgs3 60)  -- expected: "D"
  print (lgs3 65)  -- expected: "D+"
  print (lgs3 70)  -- expected: "C"
  print (lgs3 75)  -- expected: "C+"
  print (lgs3 80)  -- expected: "B"
  print (lgs3 85)  -- expected: "B+"
  print (lgs3 90)  -- expected: "A"
  print (lgs3 100)  -- expected: "A"
