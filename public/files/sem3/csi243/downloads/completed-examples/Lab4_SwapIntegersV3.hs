-- Title: Rotate three integers one position to the left.
{-
QUESTION
Write rotateTriple to change (x,y,z) into (y,z,x).
-}

-- Read the question: Write a tuple transformation with the stated component types.
-- Plan: Construct a tuple in the requested order.
rotateTriple :: (Int, Int, Int) -> (Int, Int, Int)
-- Name each component in the input pattern.
rotateTriple (x,y,z) = (y,z,x)

main :: IO ()
main = do
  print (rotateTriple (1,2,3))  -- expected: (2,3,1)
  print (rotateTriple (0,0,0))  -- expected: (0,0,0)
  print (rotateTriple (-1,0,1))  -- expected: (0,1,-1)
  print (rotateTriple (4,4,4))  -- expected: (4,4,4)
  print (rotateTriple (9,8,7))  -- expected: (8,7,9)
