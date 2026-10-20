-- Title: Convert percentages using revised recommendation boundaries.
{-
QUESTION
Write recc3 using guards. Accept integer scores from 0 to 100.
Return "Fail" below 50, "Supplement" below 60, "Pass" below 70, "Lower Second
Class" below 80, "Upper Second Class" below 90,
and "First Class" otherwise. Reject scores outside the range.
-}

-- Read the question: Write the specified grade conversion with explicit input and output types.
-- Plan: Use ordered guards for bands and literal patterns for exact values.
recc3 :: Int -> String
-- Test cutoffs in increasing order.
recc3 s
  | s < 0 || s > 100 = error "Score outside range"
  | s < 50 = "Fail"
  | s < 60 = "Supplement"
  | s < 70 = "Pass"
  | s < 80 = "Lower Second Class"
  | s < 90 = "Upper Second Class"
  | otherwise = "First Class"

main :: IO ()
main = do
  print (recc3 0)  -- expected: "Fail"
  print (recc3 50)  -- expected: "Supplement"
  print (recc3 60)  -- expected: "Pass"
  print (recc3 70)  -- expected: "Lower Second Class"
  print (recc3 80)  -- expected: "Upper Second Class"
  print (recc3 90)  -- expected: "First Class"
  print (recc3 100)  -- expected: "First Class"
