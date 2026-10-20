-- Title: Generate successive integers lazily
{-
QUESTION
Write numsFrom :: Integer -> [Integer] recursively. [4]
Start with the argument and produce successive integers.
Use (:) so each output cell is available before its tail.
-}

numsFrom :: Integer -> [Integer]
numsFrom = undefined  -- Your answer here

main :: IO ()
main = do
  print (take 0 (numsFrom 5))  -- expected: []
  print (take 1 (numsFrom 5))  -- expected: [5]
  print (take 4 (numsFrom 5))  -- expected: [5,6,7,8]
  print (take 3 (numsFrom (-1)))  -- expected: [-1,0,1]
  print (takeWhile (<4) (numsFrom 1))  -- expected: [1,2,3]
