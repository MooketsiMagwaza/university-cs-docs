-- Title: Convert percentage scores to university recommendations.
{-
QUESTION
Write recc using guards. Accept integer scores from 0 to 100.
Return "Fail" below 40, "Supplement" below 50, "Pass" below 60, "Lower Second
Class" below 70, "Upper Second Class" below 80,
and "First Class" otherwise. Reject scores outside the range.
These are the university recommendation bands; recc 76 returns
"Upper Second Class". Zero is a failing score.
-}

recc :: Int -> String
recc = undefined -- Your answer here

main :: IO ()
main = do
  print (recc 0)  -- expected: "Fail"
  print (recc 40)  -- expected: "Supplement"
  print (recc 50)  -- expected: "Pass"
  print (recc 60)  -- expected: "Lower Second Class"
  print (recc 70)  -- expected: "Upper Second Class"
  print (recc 80)  -- expected: "First Class"
  print (recc 100)  -- expected: "First Class"
