-- Title: Recognise palindromes using a recursive reverse
{-
QUESTION
Write reverseR recursively, then palindrome :: Eq a => [a] -> Bool. [5]
A palindrome equals its reversal; the empty list is a palindrome.
-}

-- Read the question: Write reverseR :: [a] -> [a]; palindrome :: Eq a => [a] -> Bool.
-- Plan: Reuse recursive reversal and compare the entire lists.
reverseR :: [a] -> [a]
reverseR [] = []
reverseR (x:xs) = reverseR xs ++ [x]

palindrome :: Eq a => [a] -> Bool
palindrome xs = xs == reverseR xs  -- Compare both orders.

main :: IO ()
main = do
  print (palindrome ([] :: [Int]))  -- expected: True
  print (palindrome [7])  -- expected: True
  print (palindrome [1,2,1])  -- expected: True
  print (palindrome "exam")  -- expected: False
  print (palindrome "level")  -- expected: True
