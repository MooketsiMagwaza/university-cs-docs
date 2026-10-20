-- Title: Rearrange tuple components with a pattern
{-
QUESTION
Write swap to exchange the first and third components of a triple.
Keep the middle component unchanged.
-}

swap :: (a, b, c) -> (c, b, a)
swap = undefined -- Your answer here

main :: IO ()
main = do
  print (swap (0, True, ""))  -- expected: ("",True,0)
  print (swap (1, 2, 3))  -- expected: (3,2,1)
  print (swap (False, "x", 7))  -- expected: (7,"x",False)
  print (swap ([], 0, [1]) :: ([Int], Int, [Int]))  -- expected: ([1],0,[])
  print (swap ("a", "b", "c"))  -- expected: ("c","b","a")
