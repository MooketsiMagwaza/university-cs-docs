-- Title: Multiply the first n terms of a sequence
{-
QUESTION
Specify, dry run and implement productFirst :: Int -> [Int] -> Int.
Multiply the first n elements of a sequence.
Use all available terms when n exceeds the length.
For n <= 0 or an empty list return 1.
-}

productFirst :: Int -> [Int] -> Int
productFirst = undefined -- Your answer here

main :: IO ()
main = do
  print (productFirst 0 [1,2,3])  -- expected: 1
  print (productFirst 5 [1,2,3,4,5,6])  -- expected: 120
  print (productFirst 3 [])  -- expected: 1
  print (productFirst 1 [7,8])  -- expected: 7
  print (productFirst 5 [2,3])  -- expected: 6
  print (productFirst (-1) [2,3])  -- expected: 1
