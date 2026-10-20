-- Title: Rotate three integers one position to the left.
{-
QUESTION
Write rotateTriple to change (x,y,z) into (y,z,x).
-}

rotateTriple :: (Int, Int, Int) -> (Int, Int, Int)
rotateTriple = undefined -- Your answer here

main :: IO ()
main = do
  print (rotateTriple (1,2,3))  -- expected: (2,3,1)
  print (rotateTriple (0,0,0))  -- expected: (0,0,0)
  print (rotateTriple (-1,0,1))  -- expected: (0,1,-1)
  print (rotateTriple (4,4,4))  -- expected: (4,4,4)
  print (rotateTriple (9,8,7))  -- expected: (8,7,9)
