-- Title: Use foldr to total fourth powers
{-
QUESTION
Write sumsq :: Int -> Int to total the fourth powers of 1 through n.
Use foldr directly, without map or sum. Return 0 when n <= 0. (5 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- sumsq :: Int -> Int
-- Plan: Use seed 0 and add each transformed element to the tail result.
sumsq :: Int -> Int
-- An empty range contributes zero; add the transformed head.
sumsq n = foldr (\x acc -> x^4 + acc) 0 [1..n]

main :: IO ()
main = do
  print (sumsq (0))  -- expected: 0
  print (sumsq (1))  -- expected: 1
  print (sumsq (3))  -- expected: 98
  print (sumsq (4))  -- expected: 354
  print (sumsq (-2))  -- expected: 0
