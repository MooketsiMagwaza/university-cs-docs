-- Title: Swap the components of a polymorphic pair
{-
QUESTION
Write swap :: (a,b) -> (b,a) without adding class constraints. [3]
The component types may differ.
-}

-- Read the question: Write swap :: (a,b) -> (b,a).
-- Plan: Pattern match to exchange the two fields.
swap :: (a,b) -> (b,a)
swap (x,y) = (y,x)  -- Rearrangement needs no inspection of values.

main :: IO ()
main = do
  print (swap (1,True))  -- expected: (True,1)
  print (swap ('a',7))  -- expected: (7,'a')
  print (swap ("",False))  -- expected: (False,"")
  print (swap ([1,2],"ab"))  -- expected: ("ab",[1,2])
  print (swap ([],[]) :: ([Int],[Bool]))  -- expected: ([],[])
