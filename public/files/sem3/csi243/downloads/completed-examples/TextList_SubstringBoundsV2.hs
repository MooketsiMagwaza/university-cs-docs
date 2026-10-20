-- Title: Extract a bounded slice of a string list
{-
QUESTION
Write sliceWords :: Int -> Int -> [String] -> [String]. Clamp a
negative start or count to zero. Return at most count elements beginning
at the zero-based start; never index with (!!).
-}

-- Read the question: Write sliceWords :: Int -> Int -> [String] -> [String]; use the stated input and result types.
-- Plan: Use drop for the start and take for the bounded length; clamp as specified.
sliceWords :: Int -> Int -> [String] -> [String]
-- Key step: the library operation also handles empty input.
sliceWords start count = take (max 0 count) . drop (max 0 start)

main :: IO ()
main = do
  print (sliceWords 0 2 [])  -- expected: []
  print (sliceWords 0 1 ["a"])  -- expected: ["a"]
  print (sliceWords 1 2 ["a","b","c"])  -- expected: ["b","c"]
  print (sliceWords (-1) 2 ["a","b"])  -- expected: ["a","b"]
  print (sliceWords 2 9 ["a","b"])  -- expected: []
  print (sliceWords 0 (-3) ["a"])  -- expected: []
