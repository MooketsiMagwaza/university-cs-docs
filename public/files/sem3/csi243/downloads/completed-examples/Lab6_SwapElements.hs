-- Title: Swap the two elements of a polymorphic pair.
{-
QUESTION
Given a tuple, create a polymorphic function swapElements that swaps
the order of the elements in the tuple. For example,
swapElements (4,9) returns (9,4). Allow the two elements to have
different types: (a,b) -> (b,a).
-}

-- Read the question: Write (a,b) -> (b,a) without imposing type-class constraints.
-- Plan: Unpack both fields and construct a pair in reverse order.
swapElements :: (a, b) -> (b, a)
-- The output type follows the new positions of the two fields.
swapElements (x,y) = (y,x)

main :: IO ()
main = do
  print (swapElements (4 :: Int,9 :: Int))  -- expected: (9,4)
  print (swapElements (0 :: Int,False))  -- expected: (False,0)
  print (swapElements ("",True))  -- expected: (True,"")
  print (swapElements ('a',"cat"))  -- expected: ("cat",'a')
  print (swapElements ((),[1 :: Int]))  -- expected: ([1],())
