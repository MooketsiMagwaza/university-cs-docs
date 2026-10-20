-- Title: Swap the fields of every pair in a list.
{-
QUESTION
Write swapPairs :: [(a,b)] -> [(b,a)]. Swap each pair independently,
retain the order of the list, and return [] for an empty input.
-}

-- Read the question: Write [(a,b)] -> [(b,a)] with no comparison or numeric constraints.
-- Plan: Rebuild the list with each pair reversed.
swapPairs :: [(a, b)] -> [(b, a)]
-- The base case is empty; each recursive step swaps one pair.
swapPairs [] = []
swapPairs ((x,y):xs) = (y,x) : swapPairs xs

main :: IO ()
main = do
  print (swapPairs ([] :: [(Int,Bool)]))  -- expected: []
  print (swapPairs [(1 :: Int,True)])  -- expected: [(True,1)]
  print (swapPairs [(1 :: Int,'a'),(2,'b')])  -- expected: [('a',1),('b',2)]
  print (swapPairs [("",False),("hi",True)])  -- expected: [(False,""),(True,"hi")]
  print (swapPairs [((),())])  -- expected: [((),())]
