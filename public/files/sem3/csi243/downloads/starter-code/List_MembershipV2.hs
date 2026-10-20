-- Title: Count occurrences recursively
{-
QUESTION
Write occurrences :: Eq a => a -> [a] -> Int recursively. [4]
Count every occurrence, including repeated adjacent matches.
-}

occurrences :: Eq a => a -> [a] -> Int
occurrences = undefined  -- Your answer here

main :: IO ()
main = do
  print (occurrences (1 :: Int) [])  -- expected: 0
  print (occurrences 7 [7])  -- expected: 1
  print (occurrences 3 [3,1,3,3])  -- expected: 3
  print (occurrences 4 [1,2,3])  -- expected: 0
  print (occurrences 'a' "banana")  -- expected: 3
