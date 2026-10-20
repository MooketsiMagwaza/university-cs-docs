-- Title: Recognise palindromes using a recursive reverse
{-
QUESTION
Write reverseR recursively, then palindrome :: Eq a => [a] -> Bool. [5]
A palindrome equals its reversal; the empty list is a palindrome.
-}

reverseR :: [a] -> [a]
reverseR = undefined  -- Your answer here

palindrome :: Eq a => [a] -> Bool
palindrome = undefined  -- Your answer here

main :: IO ()
main = do
  print (palindrome ([] :: [Int]))  -- expected: True
  print (palindrome [7])  -- expected: True
  print (palindrome [1,2,1])  -- expected: True
  print (palindrome "exam")  -- expected: False
  print (palindrome "level")  -- expected: True
