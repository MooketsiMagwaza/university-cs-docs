-- Title: Rearrange tuple components with a pattern
{-
QUESTION
Write swap to return a pair containing the swapped input pair followed
by the original input pair.
-}

swap :: (a, b) -> ((b, a), (a, b))
swap = undefined -- Your answer here

main :: IO ()
main = do
  print (swap (0, True))  -- expected: ((True,0),(0,True))
  print (swap ("", 1))  -- expected: ((1,""),("",1))
  print (swap (2, 3))  -- expected: ((3,2),(2,3))
  print (swap (False, "x"))  -- expected: (("x",False),(False,"x"))
  print (swap (1, 1))  -- expected: ((1,1),(1,1))
