-- Title: Convert scores out of twenty to university recommendations.
{-
QUESTION
Write recc2 using guards. Accept integer scores from 0 to 20.
Return "Fail" below 8, "Supplement" below 10, "Pass" below 12, "Lower Second
Class" below 14, "Upper Second Class" below 16,
and "First Class" otherwise. Reject scores outside the range.
-}

-- Read the question: Write the specified grade conversion with explicit input and output types.
-- Plan: Use ordered guards for bands and literal patterns for exact values.
recc2 :: Int -> String
-- Test cutoffs in increasing order.
recc2 s
  | s < 0 || s > 20 = error "Score outside range"
  | s < 8 = "Fail"
  | s < 10 = "Supplement"
  | s < 12 = "Pass"
  | s < 14 = "Lower Second Class"
  | s < 16 = "Upper Second Class"
  | otherwise = "First Class"

main :: IO ()
main = do
  print (recc2 0)  -- expected: "Fail"
  print (recc2 8)  -- expected: "Supplement"
  print (recc2 10)  -- expected: "Pass"
  print (recc2 12)  -- expected: "Lower Second Class"
  print (recc2 14)  -- expected: "Upper Second Class"
  print (recc2 16)  -- expected: "First Class"
  print (recc2 20)  -- expected: "First Class"
