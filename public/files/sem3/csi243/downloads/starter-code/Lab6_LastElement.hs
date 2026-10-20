-- Title: Return the last element of a nonempty list.
{-
QUESTION
Define a polymorphic function lastElement that returns the last element
of a list. Use the type [a] -> a and recursion. The input must be
nonempty; give a descriptive error for an empty list.
-}

lastElement :: [a] -> a
lastElement = undefined -- Your answer here

main :: IO ()
main = do
  print (lastElement ([1,2,3,4] :: [Int]))  -- expected: 4
  print (lastElement ([0] :: [Int]))  -- expected: 0
  print (lastElement "abc")  -- expected: 'c'
  print (lastElement [False,True])  -- expected: True
  print (lastElement ["first","last"])  -- expected: "last"
