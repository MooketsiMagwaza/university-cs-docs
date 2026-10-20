-- Title: Implement a recursive zip over three lists
{-
QUESTION
Implement zipWithx :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]
recursively, stopping when any input is empty; do not call zipWith3.
Also write fp x y z = x+y+z with type Int -> Int -> Int -> Int.
Explain why an all-empty-only base case can crash after printing part of a
list, and why the combiner needs three arguments. (10 marks)
-}

zipWithx :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]
zipWithx = undefined -- Your answer here

fp :: Int -> Int -> Int -> Int
fp = undefined -- Your answer here

main :: IO ()
main = do
  print (zipWithx fp [1,2] [10,20] [100,200])  -- expected: [111,222]
  print (zipWithx fp [] [10] [100])  -- expected: []
  print (zipWithx fp [1] [] [100])  -- expected: []
  print (zipWithx fp [1] [10] [])  -- expected: []
  print (zipWithx fp [1] [10,20] [100,200])  -- expected: [111]
  print (zipWithx fp [1,2] [10] [100,200])  -- expected: [111]
  print (zipWithx fp [1,2] [10,20] [100])  -- expected: [111]
  print (zipWithx fp [] [] [])  -- expected: []
  print (zipWithx fp [] [] [1])  -- expected: []
  print (zipWithx fp [] [1] [])  -- expected: []
  print (zipWithx fp [1] [] [])  -- expected: []
