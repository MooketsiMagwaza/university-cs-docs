-- Title: Convert scores out of twenty to university recommendations.
{-
QUESTION
Write recc2 using guards. Accept integer scores from 0 to 20.
Return "Fail" below 8, "Supplement" below 10, "Pass" below 12, "Lower Second
Class" below 14, "Upper Second Class" below 16,
and "First Class" otherwise. Reject scores outside the range.
-}

recc2 :: Int -> String
recc2 = undefined -- Your answer here

main :: IO ()
main = do
  print (recc2 0)  -- expected: "Fail"
  print (recc2 8)  -- expected: "Supplement"
  print (recc2 10)  -- expected: "Pass"
  print (recc2 12)  -- expected: "Lower Second Class"
  print (recc2 14)  -- expected: "Upper Second Class"
  print (recc2 16)  -- expected: "First Class"
  print (recc2 20)  -- expected: "First Class"
