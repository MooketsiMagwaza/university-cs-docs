-- Title: Convert integer grade points to letter grades.
{-
QUESTION
Write lgg2 using pattern matching to translate these exact values:
0 -> F, 1 -> F, 2 -> E, 3 -> E+, 4 -> D, 5 -> D+, 6 -> C, 7 -> C+, 8 -> B, 9
-> B+, 10 -> A.
Reject any other value with an error.
-}

lgg2 :: Int -> String
lgg2 = undefined -- Your answer here

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
