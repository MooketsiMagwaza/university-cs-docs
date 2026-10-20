-- Title: Delete the first matching element recursively
{-
QUESTION
Write deleteFirst :: Eq a => a -> [a] -> [a] recursively. [4]
Remove only the first occurrence; leave the list unchanged if absent.
-}

deleteFirst :: Eq a => a -> [a] -> [a]
deleteFirst = undefined  -- Your answer here

main :: IO ()
main = do
  print (deleteFirst (1 :: Int) [])  -- expected: []
  print (deleteFirst 7 [7])  -- expected: []
  print (deleteFirst 3 [3,1,3,3])  -- expected: [1,3,3]
  print (deleteFirst 4 [1,2,3])  -- expected: [1,2,3]
  print (deleteFirst 'a' "banana")  -- expected: "bnana"
