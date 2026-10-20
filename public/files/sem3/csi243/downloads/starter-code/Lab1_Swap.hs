-- Title: Rearrange tuple components with a pattern
{-
QUESTION
Implement swap :: (a,b) -> (b,a), which exchanges the components of a pair.
-}

swap :: (a, b) -> (b, a)
swap = undefined -- Your answer here

main :: IO ()
main = do
  print (swap (0, True))  -- expected: (True,0)
  print (swap ("", 1))  -- expected: (1,"")
  print (swap (2, 3))  -- expected: (3,2)
  print (swap (False, "x"))  -- expected: ("x",False)
  print (swap ([1], [2,3]))  -- expected: ([2,3],[1])
