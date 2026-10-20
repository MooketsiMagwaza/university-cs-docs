-- Title: Extract text between two exclusive boundary positions
{-
QUESTION
Write sliceBetween :: Int -> Int -> String -> String. Clamp start
to zero and treat end as an exclusive zero-based boundary. If end is
not greater than the clamped start, return empty text. Stop at the end.
-}

sliceBetween :: Int -> Int -> String -> String
sliceBetween = undefined -- Your answer here

main :: IO ()
main = do
  print (sliceBetween 1 4 "abcdef")  -- expected: "bcd"
  print (sliceBetween 0 0 "abc")  -- expected: ""
  print (sliceBetween (-2) 2 "abc")  -- expected: "ab"
  print (sliceBetween 3 1 "abc")  -- expected: ""
  print (sliceBetween 1 9 "abc")  -- expected: "bc"
  print (sliceBetween 0 2 "")  -- expected: ""
