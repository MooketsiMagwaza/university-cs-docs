-- Title: Rearrange tuple components with a pattern
{-
QUESTION
Implement swap :: (a,b) -> (b,a), which exchanges the components of a pair.
-}

-- Read the question: Write swap :: (a, b) -> (b, a).
-- Plan: Name the input components and construct the requested output tuple.
-- Dry run: swap (0,True) = (True,0), by substituting x=0 and y=True.
-- Key step: the type variables permit different component types.
swap :: (a, b) -> (b, a)
swap (x, y) = (y, x)

main :: IO ()
main = do
  print (swap (0, True))  -- expected: (True,0)
  print (swap ("", 1))  -- expected: (1,"")
  print (swap (2, 3))  -- expected: (3,2)
  print (swap (False, "x"))  -- expected: ("x",False)
  print (swap ([1], [2,3]))  -- expected: ([2,3],[1])
