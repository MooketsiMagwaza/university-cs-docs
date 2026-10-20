-- Title: Interleave strings while retaining an unmatched suffix
{-
QUESTION
Write interleave xs ys for Strings. Alternate characters beginning
with xs; keep any remaining characters when the other string ends.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

interleave :: String -> String -> String
interleave = undefined -- Your answer here

main :: IO ()
main = do
  print (interleave "" "")  -- expected: ""
  print (interleave "a" "")  -- expected: "a"
  print (interleave "" "bc")  -- expected: "bc"
  print (interleave "ace" "b")  -- expected: "abce"
  print (interleave "a" "bdf")  -- expected: "abdf"
