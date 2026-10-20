-- Title: Extract a bounded substring with zero-based positions
{-
QUESTION
Write sliceText :: Int -> Int -> String -> String. The first two
arguments are a zero-based start and a count. Clamp negative starts and
counts to zero. Oversized starts give empty text; counts stop at the end.
-}

-- Read the question: Write sliceText :: Int -> Int -> String -> String; use the stated input and result types.
-- Plan: Use drop for the start and take for the bounded length; clamp as specified.
sliceText :: Int -> Int -> String -> String
-- Key step: the library operation also handles empty input.
sliceText start count = take (max 0 count) . drop (max 0 start)

main :: IO ()
main = do
  print (sliceText 0 3 "abcdef")  -- expected: "abc"
  print (sliceText 2 2 "abcdef")  -- expected: "cd"
  print (sliceText 9 2 "abc")  -- expected: ""
  print (sliceText (-2) 2 "abc")  -- expected: "ab"
  print (sliceText 1 (-1) "abc")  -- expected: ""
  print (sliceText 0 2 "")  -- expected: ""
