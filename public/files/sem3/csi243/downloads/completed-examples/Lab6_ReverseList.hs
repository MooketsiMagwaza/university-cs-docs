-- Title: Reverse a list polymorphically.
{-
QUESTION
Create a polymorphic function revList that reverses the elements of
a list. For example, revList [1,2,3,4] returns [4,3,2,1]. Use recursion
and make the empty-list case return an empty list.
-}

-- Read the question: Write [a] -> [a], preserving values while changing their order.
-- Plan: Use [] as the base; append the head after the reversed tail.
revList :: [a] -> [a]
-- Reverse the tail, then place the old head at the end.
revList [] = []
revList (x:xs) = revList xs ++ [x]

main :: IO ()
main = do
  print (revList ([] :: [Int]))  -- expected: []
  print (revList ([7] :: [Int]))  -- expected: [7]
  print (revList ([1,2,3,4] :: [Int]))  -- expected: [4,3,2,1]
  print (revList "abc")  -- expected: "cba"
  print (revList [True,False,False])  -- expected: [False,False,True]
