-- Title: Implement a recursive zip over three lists
{-
QUESTION
Implement zipWithx :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]
recursively, stopping when any input is empty; do not call zipWith3.
Also write fp x y z = x-y-z with type Int -> Int -> Int -> Int.
Explain why an all-empty-only base case can crash after printing part of a
list, and why the combiner needs three arguments. (10 marks)
-}

zipWithx :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]
zipWithx = undefined -- Your answer here

fp :: Int -> Int -> Int -> Int
fp = undefined -- Your answer here

main :: IO ()
main = do
  print (zipWithx fp [20,30] [3,4] [5,6])  -- expected: [12,20]
  print (zipWithx fp [] [3] [5])  -- expected: []
  print (zipWithx fp [20] [] [5])  -- expected: []
  print (zipWithx fp [20] [3] [])  -- expected: []
  print (zipWithx fp [20,30] [3] [5,6])  -- expected: [12]
  print (zipWithx fp [] [] [])  -- expected: []
  print (zipWithx fp [] [] [1])  -- expected: []
  print (zipWithx fp [] [1] [])  -- expected: []
  print (zipWithx fp [1] [] [])  -- expected: []
  print (zipWithx fp [20] [3,4] [5,6])  -- expected: [12]
  print (zipWithx fp [20,30] [3,4] [5])  -- expected: [12]
