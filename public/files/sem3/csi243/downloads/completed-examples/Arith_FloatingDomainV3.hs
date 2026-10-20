-- Title: Classify floating domain results
{-
QUESTION
Write classify :: Double -> String. Return "NaN", "Infinity",
"-Infinity" or "finite" in that order of tests, inspecting the sign
only after recognising infinity.
-}

-- Read the question: Write classify using the stated floating-point domain policy.
-- Plan: Reject or classify non-finite results before the ordinary test.
classify :: Double -> String
-- Key step: NaN cannot be recognised by equality to itself.
classify x
  | isNaN x = "NaN"
  | isInfinite x && x < 0 = "-Infinity"
  | isInfinite x = "Infinity"
  | otherwise = "finite"

main :: IO ()
main = do
  print (classify (sqrt (-1)))  -- expected: "NaN"
  print (classify (log 0))  -- expected: "-Infinity"
  print (classify (recip 0))  -- expected: "Infinity"
  print (classify (0/0))  -- expected: "NaN"
  print (classify (exp 0))  -- expected: "finite"
