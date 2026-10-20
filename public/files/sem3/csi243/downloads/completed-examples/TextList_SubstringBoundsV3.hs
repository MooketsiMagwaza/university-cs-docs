-- Title: Extract text between two exclusive boundary positions
{-
QUESTION
Write sliceBetween :: Int -> Int -> String -> String. Clamp start
to zero and treat end as an exclusive zero-based boundary. If end is
not greater than the clamped start, return empty text. Stop at the end.
-}

-- Read the question: Write sliceBetween :: Int -> Int -> String -> String; use the stated input and result types.
-- Plan: Use drop for the start and take for the bounded length; clamp as specified.
sliceBetween :: Int -> Int -> String -> String
-- Key step: the library operation also handles empty input.
sliceBetween start end s = take (max 0 (end - begin)) (drop begin s)
  where begin = max 0 start

main :: IO ()
main = do
  print (sliceBetween 1 4 "abcdef")  -- expected: "bcd"
  print (sliceBetween 0 0 "abc")  -- expected: ""
  print (sliceBetween (-2) 2 "abc")  -- expected: "ab"
  print (sliceBetween 3 1 "abc")  -- expected: ""
  print (sliceBetween 1 9 "abc")  -- expected: "bc"
  print (sliceBetween 0 2 "")  -- expected: ""
