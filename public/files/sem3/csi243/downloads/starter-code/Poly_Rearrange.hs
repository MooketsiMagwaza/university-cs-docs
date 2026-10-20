-- Title: Swap the components of a polymorphic pair
{-
QUESTION
Write swap :: (a,b) -> (b,a) without adding class constraints. [3]
The component types may differ.
-}

swap :: (a,b) -> (b,a)
swap = undefined  -- Your answer here

main :: IO ()
main = do
  print (swap (1,True))  -- expected: (True,1)
  print (swap ('a',7))  -- expected: (7,'a')
  print (swap ("",False))  -- expected: (False,"")
  print (swap ([1,2],"ab"))  -- expected: ("ab",[1,2])
  print (swap ([],[]) :: ([Int],[Bool]))  -- expected: ([],[])
