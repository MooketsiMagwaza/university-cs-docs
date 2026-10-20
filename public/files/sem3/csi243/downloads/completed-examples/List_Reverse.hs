-- Title: Reverse a list by structural recursion
{-
QUESTION
Write reverseR :: [a] -> [a] using recursion and (++), not reverse. [4]
-}

-- Read the question: Write reverseR :: [a] -> [a].
-- Plan: Reverse the tail and put the head last.
reverseR :: [a] -> [a]
reverseR [] = []
reverseR (x:xs) = reverseR xs ++ [x]  -- Head moves to the end.

main :: IO ()
main = do
  print (reverseR ([] :: [Int]))  -- expected: []
  print (reverseR [7])  -- expected: [7]
  print (reverseR [1,2,3])  -- expected: [3,2,1]
  print (reverseR "exam")  -- expected: "maxe"
  print (reverseR [True,False])  -- expected: [False,True]
