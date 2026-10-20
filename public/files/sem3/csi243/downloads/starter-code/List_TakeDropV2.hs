-- Title: Implement dropR recursively
{-
QUESTION
Write dropR :: Int -> [a] -> [a] using recursion, without take, drop or splitAt. [5]
Remove up to n initial elements; non-positive n returns the input.
-}

dropR :: Int -> [a] -> [a]
dropR = undefined  -- Your answer here

main :: IO ()
main = do
  print (dropR 0 [1,2])  -- expected: [1,2]
  print (dropR 3 ([] :: [Int]))  -- expected: []
  print (dropR 1 [7])  -- expected: []
  print (dropR 2 [1,2,3])  -- expected: [3]
  print (dropR 5 "ab")  -- expected: ""
