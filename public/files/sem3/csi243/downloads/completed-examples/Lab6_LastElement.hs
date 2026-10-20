-- Title: Return the last element of a nonempty list.
{-
QUESTION
Define a polymorphic function lastElement that returns the last element
of a list. Use the type [a] -> a and recursion. The input must be
nonempty; give a descriptive error for an empty list.
-}

-- Read the question: Write a function [a] -> a that works without comparing elements.
-- Plan: Stop at a singleton; recurse on the tail of a longer list.
lastElement :: [a] -> a
-- A singleton ends the search; otherwise discard the head.
lastElement [] = error "lastElement: empty list"
lastElement [x] = x
lastElement (_:xs) = lastElement xs

main :: IO ()
main = do
  print (lastElement ([1,2,3,4] :: [Int]))  -- expected: 4
  print (lastElement ([0] :: [Int]))  -- expected: 0
  print (lastElement "abc")  -- expected: 'c'
  print (lastElement [False,True])  -- expected: True
  print (lastElement ["first","last"])  -- expected: "last"
