-- Title: Convert scores out of twenty to letter grades.
{-
QUESTION
Write lgs2 to return the letter grade using guards.
Use scores out of 20: 0-7 F/0, 8 E/1, 9 E+/1.5, 10 D/2,
11 D+/2.5, 12 C/3, 13 C+/3.5, 14 B/4, 15 B+/4.5, 16-20 A/5.
Reject scores outside the stated range with an error.
-}

lgs2 :: Int -> String
lgs2 = undefined -- Your answer here

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
