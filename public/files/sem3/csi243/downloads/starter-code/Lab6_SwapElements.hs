-- Title: Swap the two elements of a polymorphic pair.
{-
QUESTION
Given a tuple, create a polymorphic function swapElements that swaps
the order of the elements in the tuple. For example,
swapElements (4,9) returns (9,4). Allow the two elements to have
different types: (a,b) -> (b,a).
-}

swapElements :: (a, b) -> (b, a)
swapElements = undefined -- Your answer here

main :: IO ()
main = do
  print (swapElements (4 :: Int,9 :: Int))  -- expected: (9,4)
  print (swapElements (0 :: Int,False))  -- expected: (False,0)
  print (swapElements ("",True))  -- expected: (True,"")
  print (swapElements ('a',"cat"))  -- expected: ("cat",'a')
  print (swapElements ((),[1 :: Int]))  -- expected: ([1],())
