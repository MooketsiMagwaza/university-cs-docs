-- Title: Search a list using recursive equality tests
{-
QUESTION
Write memberR :: Eq a => a -> [a] -> Bool recursively, without elem. [4]
-}

-- Read the question: Write memberR :: Eq a => a -> [a] -> Bool.
-- Plan: Compare the head, otherwise search the tail.
memberR :: Eq a => a -> [a] -> Bool
memberR _ [] = False
memberR v (x:xs) = v == x || memberR v xs  -- Stop at a match.

main :: IO ()
main = do
  print (memberR (1 :: Int) [])  -- expected: False
  print (memberR 7 [7])  -- expected: True
  print (memberR 3 [1,2,3])  -- expected: True
  print (memberR 4 [1,2,3])  -- expected: False
  print (memberR 'a' "cat")  -- expected: True
