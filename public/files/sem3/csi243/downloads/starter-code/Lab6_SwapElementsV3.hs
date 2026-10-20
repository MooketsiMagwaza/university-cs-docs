-- Title: Swap the fields of every pair in a list.
{-
QUESTION
Write swapPairs :: [(a,b)] -> [(b,a)]. Swap each pair independently,
retain the order of the list, and return [] for an empty input.
-}

swapPairs :: [(a, b)] -> [(b, a)]
swapPairs = undefined -- Your answer here

main :: IO ()
main = do
  print (swapPairs ([] :: [(Int,Bool)]))  -- expected: []
  print (swapPairs [(1 :: Int,True)])  -- expected: [(True,1)]
  print (swapPairs [(1 :: Int,'a'),(2,'b')])  -- expected: [('a',1),('b',2)]
  print (swapPairs [("",False),("hi",True)])  -- expected: [(False,""),(True,"hi")]
  print (swapPairs [((),())])  -- expected: [((),())]
