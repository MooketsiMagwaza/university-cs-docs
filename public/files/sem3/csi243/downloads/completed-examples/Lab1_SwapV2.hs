-- Title: Rearrange tuple components with a pattern
{-
QUESTION
Write swap to exchange the first and third components of a triple.
Keep the middle component unchanged.
-}

-- Read the question: Write swap :: (a, b, c) -> (c, b, a).
-- Plan: Name the input components and construct the requested output tuple.
-- Dry run: swap (1,2,3) = (3,2,1), by the triple pattern.
-- Key step: the type variables permit different component types.
swap :: (a, b, c) -> (c, b, a)
swap (x, y, z) = (z, y, x)

main :: IO ()
main = do
  print (swap (0, True, ""))  -- expected: ("",True,0)
  print (swap (1, 2, 3))  -- expected: (3,2,1)
  print (swap (False, "x", 7))  -- expected: (7,"x",False)
  print (swap ([], 0, [1]) :: ([Int], Int, [Int]))  -- expected: ([1],0,[])
  print (swap ("a", "b", "c"))  -- expected: ("c","b","a")
