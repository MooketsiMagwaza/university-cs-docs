-- Title: Extract a bounded slice of a string list
{-
QUESTION
Write sliceWords :: Int -> Int -> [String] -> [String]. Clamp a
negative start or count to zero. Return at most count elements beginning
at the zero-based start; never index with (!!).
-}

sliceWords :: Int -> Int -> [String] -> [String]
sliceWords = undefined -- Your answer here

main :: IO ()
main = do
  print (sliceWords 0 2 [])  -- expected: []
  print (sliceWords 0 1 ["a"])  -- expected: ["a"]
  print (sliceWords 1 2 ["a","b","c"])  -- expected: ["b","c"]
  print (sliceWords (-1) 2 ["a","b"])  -- expected: ["a","b"]
  print (sliceWords 2 9 ["a","b"])  -- expected: []
  print (sliceWords 0 (-3) ["a"])  -- expected: []
