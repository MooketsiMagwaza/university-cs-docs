-- Title: Convert percentages using revised recommendation boundaries.
{-
QUESTION
Write recc3 using guards. Accept integer scores from 0 to 100.
Return "Fail" below 50, "Supplement" below 60, "Pass" below 70, "Lower Second
Class" below 80, "Upper Second Class" below 90,
and "First Class" otherwise. Reject scores outside the range.
-}

recc3 :: Int -> String
recc3 = undefined -- Your answer here

main :: IO ()
main = do
  print (recc3 0)  -- expected: "Fail"
  print (recc3 50)  -- expected: "Supplement"
  print (recc3 60)  -- expected: "Pass"
  print (recc3 70)  -- expected: "Lower Second Class"
  print (recc3 80)  -- expected: "Upper Second Class"
  print (recc3 90)  -- expected: "First Class"
  print (recc3 100)  -- expected: "First Class"
