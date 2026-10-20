-- Title: Reverse a list by structural recursion
{-
QUESTION
Write reverseR :: [a] -> [a] using recursion and (++), not reverse. [4]
-}

reverseR :: [a] -> [a]
reverseR = undefined  -- Your answer here

main :: IO ()
main = do
  print (reverseR ([] :: [Int]))  -- expected: []
  print (reverseR [7])  -- expected: [7]
  print (reverseR [1,2,3])  -- expected: [3,2,1]
  print (reverseR "exam")  -- expected: "maxe"
  print (reverseR [True,False])  -- expected: [False,True]
