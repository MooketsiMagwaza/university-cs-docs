-- Title: Order a pair with an Ord constraint
{-
QUESTION
Write orderedPair :: Ord a => a -> a -> (a,a). [4]
Return the smaller value first, retaining equal arguments.
-}

-- Read the question: Write orderedPair :: Ord a => a -> a -> (a,a).
-- Plan: Compare once and arrange the pair.
orderedPair :: Ord a => a -> a -> (a,a)
orderedPair x y
  | x <= y = (x,y)  -- Ord supplies the comparison.
  | otherwise = (y,x)

main :: IO ()
main = do
  print (orderedPair (0 :: Int) 0)  -- expected: (0,0)
  print (orderedPair 7 2)  -- expected: (2,7)
  print (orderedPair (-2) 3)  -- expected: (-2,3)
  print (orderedPair 'z' 'a')  -- expected: ('a','z')
  print (orderedPair "cat" "ant")  -- expected: ("ant","cat")
