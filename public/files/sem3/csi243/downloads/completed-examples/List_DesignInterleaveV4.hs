-- Title: Interleave strings while retaining an unmatched suffix
{-
QUESTION
Write interleave xs ys for Strings. Alternate characters beginning
with xs; keep any remaining characters when the other string ends.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write interleave with the stated list and result types.
-- Plan: Specify both empty-list cases before consuming the available heads.
interleave :: String -> String -> String
-- Base cases handle missing data; the recursive case consumes list structure.
interleave [] ys = ys
interleave xs [] = xs
interleave (x:xs) (y:ys) = x : y : interleave xs ys

main :: IO ()
main = do
  print (interleave "" "")  -- expected: ""
  print (interleave "a" "")  -- expected: "a"
  print (interleave "" "bc")  -- expected: "bc"
  print (interleave "ace" "b")  -- expected: "abce"
  print (interleave "a" "bdf")  -- expected: "abdf"
