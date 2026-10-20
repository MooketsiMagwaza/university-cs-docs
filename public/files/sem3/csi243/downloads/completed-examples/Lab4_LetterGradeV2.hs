-- Title: Convert scores out of twenty to letter grades.
{-
QUESTION
Write lgs2 to return the letter grade using guards.
Use scores out of 20: 0-7 F/0, 8 E/1, 9 E+/1.5, 10 D/2,
11 D+/2.5, 12 C/3, 13 C+/3.5, 14 B/4, 15 B+/4.5, 16-20 A/5.
Reject scores outside the stated range with an error.
-}

-- Read the question: Write the specified grade conversion with explicit input and output types.
-- Plan: Use ordered guards for bands and literal patterns for exact values.
lgs2 :: Int -> String
-- Ascending guards include each lower boundary automatically.
lgs2 s
  | s < 0 || s > 20 = error "Score outside range"
  | s < 8 = "F"
  | s < 9 = "E"
  | s < 10 = "E+"
  | s < 11 = "D"
  | s < 12 = "D+"
  | s < 13 = "C"
  | s < 14 = "C+"
  | s < 15 = "B"
  | s < 16 = "B+"
  | otherwise = "A"

main :: IO ()
main = do
  print (lgs2 0)  -- expected: "F"
  print (lgs2 8)  -- expected: "E"
  print (lgs2 9)  -- expected: "E+"
  print (lgs2 10)  -- expected: "D"
  print (lgs2 11)  -- expected: "D+"
  print (lgs2 12)  -- expected: "C"
  print (lgs2 13)  -- expected: "C+"
  print (lgs2 14)  -- expected: "B"
  print (lgs2 15)  -- expected: "B+"
  print (lgs2 16)  -- expected: "A"
  print (lgs2 20)  -- expected: "A"
