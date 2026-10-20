-- Title: Implement a recursive zip over three lists
{-
QUESTION
Implement zipWithx :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]
recursively, stopping when any input is empty; do not call zipWith3.
Also write fp name mark passed = (name,mark,passed) with type String -> Int -> Bool -> (String, Int, Bool).
Explain why an all-empty-only base case can crash after printing part of a
list, and why the combiner needs three arguments. (10 marks)
-}

zipWithx :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]
zipWithx = undefined -- Your answer here

fp :: String -> Int -> Bool -> (String, Int, Bool)
fp = undefined -- Your answer here

main :: IO ()
main = do
  print (zipWithx fp ["Ada","Bo"] [60,40] [True,False])  -- expected: [("Ada",60,True),("Bo",40,False)]
  print (zipWithx fp [] [60] [True])  -- expected: []
  print (zipWithx fp ["Ada"] [] [True])  -- expected: []
  print (zipWithx fp ["Ada"] [60] [])  -- expected: []
  print (zipWithx fp ["Ada"] [60,40] [True,False])  -- expected: [("Ada",60,True)]
  print (zipWithx fp [] [] [])  -- expected: []
  print (zipWithx fp [] [] [True])  -- expected: []
  print (zipWithx fp [] [1] [])  -- expected: []
  print (zipWithx fp ["a"] [] [])  -- expected: []
  print (zipWithx fp ["a","b"] [60] [True,False])  -- expected: [("a",60,True)]
  print (zipWithx fp ["a","b"] [60,70] [True])  -- expected: [("a",60,True)]
