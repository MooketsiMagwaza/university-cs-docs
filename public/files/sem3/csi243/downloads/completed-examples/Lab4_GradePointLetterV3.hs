-- Title: Convert exact grade points to recommendations.
{-
QUESTION
Write lgg3 using pattern matching to translate these exact values:
0 -> Fail, 1 -> Supplement, 1.5 -> Supplement, 2 -> Pass, 2.5 -> Pass, 3 ->
Lower Second Class, 3.5 -> Lower Second Class, 4 -> Upper Second Class, 4.5 ->
Upper Second Class, 5 -> First Class.
Reject any other value with an error.
-}

-- Read the question: Write the specified grade conversion with explicit input and output types.
-- Plan: Use ordered guards for bands and literal patterns for exact values.
lgg3 :: Double -> String
-- Literal patterns cover valid values; the final pattern rejects others.
lgg3 0 = "Fail"
lgg3 1 = "Supplement"
lgg3 1.5 = "Supplement"
lgg3 2 = "Pass"
lgg3 2.5 = "Pass"
lgg3 3 = "Lower Second Class"
lgg3 3.5 = "Lower Second Class"
lgg3 4 = "Upper Second Class"
lgg3 4.5 = "Upper Second Class"
lgg3 5 = "First Class"
lgg3 _ = error "Invalid grade point"

main :: IO ()
main = do
  print (lgg3 0)  -- expected: "Fail"
  print (lgg3 1)  -- expected: "Supplement"
  print (lgg3 1.5)  -- expected: "Supplement"
  print (lgg3 2)  -- expected: "Pass"
  print (lgg3 2.5)  -- expected: "Pass"
  print (lgg3 3)  -- expected: "Lower Second Class"
  print (lgg3 3.5)  -- expected: "Lower Second Class"
  print (lgg3 4)  -- expected: "Upper Second Class"
  print (lgg3 4.5)  -- expected: "Upper Second Class"
  print (lgg3 5)  -- expected: "First Class"
