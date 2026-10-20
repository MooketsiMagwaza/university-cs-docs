-- Title: Convert exact grade points to letter grades.
{-
QUESTION
Write lgg using pattern matching to translate these exact values:
0 -> F, 1 -> E, 1.5 -> E+, 2 -> D, 2.5 -> D+, 3 -> C, 3.5 -> C+, 4 -> B, 4.5
-> B+, 5 -> A.
Reject any other value with an error.
The sheet example is lgg 3.5 = "C+".
-}

lgg :: Double -> String
lgg = undefined -- Your answer here

main :: IO ()
main = do
  print (lgg 0)  -- expected: "F"
  print (lgg 1)  -- expected: "E"
  print (lgg 1.5)  -- expected: "E+"
  print (lgg 2)  -- expected: "D"
  print (lgg 2.5)  -- expected: "D+"
  print (lgg 3)  -- expected: "C"
  print (lgg 3.5)  -- expected: "C+"
  print (lgg 4)  -- expected: "B"
  print (lgg 4.5)  -- expected: "B+"
  print (lgg 5)  -- expected: "A"
