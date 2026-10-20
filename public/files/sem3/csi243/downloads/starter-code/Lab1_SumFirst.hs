-- Title: Sum the first n terms of a sequence
{-
QUESTION
Specify, dry run and implement sumFirst :: Int -> [Int] -> Int.
Sum the first n elements of a sequence.
Use all available terms when n exceeds the length.
For n <= 0 or an empty list return 0.
-}

sumFirst :: Int -> [Int] -> Int
sumFirst = undefined -- Your answer here

main :: IO ()
main = do
  print (sumFirst 0 [1,2,3])  -- expected: 0
  print (sumFirst 5 [1,2,3,4,5,6])  -- expected: 15
  print (sumFirst 3 [])  -- expected: 0
  print (sumFirst 1 [7,8])  -- expected: 7
  print (sumFirst 5 [2,3])  -- expected: 5
  print (sumFirst (-1) [2,3])  -- expected: 0
