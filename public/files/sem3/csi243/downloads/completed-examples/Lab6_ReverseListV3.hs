-- Title: Reverse only a prefix of a polymorphic list.
{-
QUESTION
Write reversePrefix :: Int -> [a] -> [a]. Reverse the first n elements,
then retain the remaining elements in order. If n is nonpositive,
return the original list. If n exceeds its length, reverse the whole list.
-}

-- Read the question: Write Int -> [a] -> [a], with the count independent of element type.
-- Plan: Reverse the taken prefix and append the dropped suffix.
reversePrefix :: Int -> [a] -> [a]
-- take and drop split at the same position, including edge cases.
reversePrefix n xs = reverse (take n xs) ++ drop n xs

main :: IO ()
main = do
  print (reversePrefix 3 ([] :: [Int]))  -- expected: []
  print (reversePrefix 0 ([1,2,3] :: [Int]))  -- expected: [1,2,3]
  print (reversePrefix 2 ([1,2,3,4] :: [Int]))  -- expected: [2,1,3,4]
  print (reversePrefix 10 "abc")  -- expected: "cba"
  print (reversePrefix (-1) [True,False])  -- expected: [True,False]
