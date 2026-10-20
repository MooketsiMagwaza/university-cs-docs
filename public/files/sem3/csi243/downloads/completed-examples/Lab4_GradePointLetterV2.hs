-- Title: Convert integer grade points to letter grades.
{-
QUESTION
Write lgg2 using pattern matching to translate these exact values:
0 -> F, 1 -> F, 2 -> E, 3 -> E+, 4 -> D, 5 -> D+, 6 -> C, 7 -> C+, 8 -> B, 9
-> B+, 10 -> A.
Reject any other value with an error.
-}

-- Read the question: Write the specified grade conversion with explicit input and output types.
-- Plan: Use ordered guards for bands and literal patterns for exact values.
lgg2 :: Int -> String
-- Literal patterns cover valid values; the final pattern rejects others.
lgg2 0 = "F"
lgg2 1 = "F"
lgg2 2 = "E"
lgg2 3 = "E+"
lgg2 4 = "D"
lgg2 5 = "D+"
lgg2 6 = "C"
lgg2 7 = "C+"
lgg2 8 = "B"
lgg2 9 = "B+"
lgg2 10 = "A"
lgg2 _ = error "Invalid grade point"

main :: IO ()
main = do
  print (lgg2 0)  -- expected: "F"
  print (lgg2 1)  -- expected: "F"
  print (lgg2 2)  -- expected: "E"
  print (lgg2 3)  -- expected: "E+"
  print (lgg2 4)  -- expected: "D"
  print (lgg2 5)  -- expected: "D+"
  print (lgg2 6)  -- expected: "C"
  print (lgg2 7)  -- expected: "C+"
  print (lgg2 8)  -- expected: "B"
  print (lgg2 9)  -- expected: "B+"
  print (lgg2 10)  -- expected: "A"
