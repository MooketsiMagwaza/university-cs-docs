-- Title: Split once at a bounded position
{-
QUESTION
Write splitR n xs. Return the prefix of length n and the remaining suffix as a pair.
Treat negative counts as zero. If n exceeds the length, return (xs,[]).
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

splitR :: Int -> [Integer] -> ([Integer],[Integer])
splitR = undefined -- Your answer here

main :: IO ()
main = do
  print (splitR (-2) [1,2])  -- expected: ([],[1,2])
  print (splitR 0 [1])  -- expected: ([],[1])
  print (splitR 3 [])  -- expected: ([],[])
  print (splitR 1 [7])  -- expected: ([7],[])
  print (splitR 2 [1,2,3])  -- expected: ([1,2],[3])
  print (splitR 9 [1,2])  -- expected: ([1,2],[])
