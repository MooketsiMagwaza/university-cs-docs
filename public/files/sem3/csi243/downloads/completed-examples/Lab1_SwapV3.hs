-- Title: Rearrange tuple components with a pattern
{-
QUESTION
Write swap to return a pair containing the swapped input pair followed
by the original input pair.
-}

-- Read the question: Write swap :: (a, b) -> ((b, a), (a, b)).
-- Plan: Name the input components and construct the requested output tuple.
-- Dry run: swap (0,True) = ((True,0),(0,True)), by the pair pattern.
-- Key step: the type variables permit different component types.
swap :: (a, b) -> ((b, a), (a, b))
swap (x, y) = ((y, x), (x, y))

main :: IO ()
main = do
  print (swap (0, True))  -- expected: ((True,0),(0,True))
  print (swap ("", 1))  -- expected: ((1,""),("",1))
  print (swap (2, 3))  -- expected: ((3,2),(2,3))
  print (swap (False, "x"))  -- expected: (("x",False),(False,"x"))
  print (swap (1, 1))  -- expected: ((1,1),(1,1))
