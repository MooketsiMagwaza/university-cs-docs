-- Title: Convert percentage scores to letter grades.
{-
QUESTION
Write lgs to return the letter grade using guards.
Use the following percentage table.
Score bands: 0-39 F/0; 40-44 E/1; 45-49 E+/1.5; 50-54 D/2;
55-59 D+/2.5; 60-64 C/3; 65-69 C+/3.5; 70-74 B/4;
75-79 B+/4.5; 80-100 A/5.
Reject scores outside the stated range with an error.
Example: lgs 85 returns "A".
-}

-- Read the question: Write the specified grade conversion with explicit input and output types.
-- Plan: Use ordered guards for bands and literal patterns for exact values.
lgs :: Int -> String
-- Ascending guards include each lower boundary automatically.
lgs s
  | s < 0 || s > 100 = error "Score outside range"
  | s < 40 = "F"
  | s < 45 = "E"
  | s < 50 = "E+"
  | s < 55 = "D"
  | s < 60 = "D+"
  | s < 65 = "C"
  | s < 70 = "C+"
  | s < 75 = "B"
  | s < 80 = "B+"
  | otherwise = "A"

main :: IO ()
main = do
  print (lgs 0)  -- expected: "F"
  print (lgs 40)  -- expected: "E"
  print (lgs 45)  -- expected: "E+"
  print (lgs 50)  -- expected: "D"
  print (lgs 55)  -- expected: "D+"
  print (lgs 60)  -- expected: "C"
  print (lgs 65)  -- expected: "C+"
  print (lgs 70)  -- expected: "B"
  print (lgs 75)  -- expected: "B+"
  print (lgs 80)  -- expected: "A"
  print (lgs 100)  -- expected: "A"
