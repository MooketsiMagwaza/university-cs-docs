-- Title: Search a list using recursive equality tests
{-
QUESTION
Write memberR :: Eq a => a -> [a] -> Bool recursively, without elem. [4]
-}

memberR :: Eq a => a -> [a] -> Bool
memberR = undefined  -- Your answer here

main :: IO ()
main = do
  print (memberR (1 :: Int) [])  -- expected: False
  print (memberR 7 [7])  -- expected: True
  print (memberR 3 [1,2,3])  -- expected: True
  print (memberR 4 [1,2,3])  -- expected: False
  print (memberR 'a' "cat")  -- expected: True
