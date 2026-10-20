-- Title: Classify floating domain results
{-
QUESTION
Write classify :: Double -> String. Return "NaN", "Infinity",
"-Infinity" or "finite" in that order of tests, inspecting the sign
only after recognising infinity.
-}

classify :: Double -> String
classify = undefined -- Your answer here

main :: IO ()
main = do
  print (classify (sqrt (-1)))  -- expected: "NaN"
  print (classify (log 0))  -- expected: "-Infinity"
  print (classify (recip 0))  -- expected: "Infinity"
  print (classify (0/0))  -- expected: "NaN"
  print (classify (exp 0))  -- expected: "finite"
