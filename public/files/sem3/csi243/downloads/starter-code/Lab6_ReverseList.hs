-- Title: Reverse a list polymorphically.
{-
QUESTION
Create a polymorphic function revList that reverses the elements of
a list. For example, revList [1,2,3,4] returns [4,3,2,1]. Use recursion
and make the empty-list case return an empty list.
-}

revList :: [a] -> [a]
revList = undefined -- Your answer here

main :: IO ()
main = do
  print (revList ([] :: [Int]))  -- expected: []
  print (revList ([7] :: [Int]))  -- expected: [7]
  print (revList ([1,2,3,4] :: [Int]))  -- expected: [4,3,2,1]
  print (revList "abc")  -- expected: "cba"
  print (revList [True,False,False])  -- expected: [False,False,True]
