-- Title: Return the product and absolute difference of two integers.
{-
QUESTION
Write productDifference :: (Int,Int) -> (Int,Int), returning the product
and absolute difference of the two integers. Use tuple pattern matching.
-}

-- Read the question: Write an Int pair transformation.
-- Plan: Calculate the product and nonnegative difference.
productDifference :: (Int, Int) -> (Int, Int)
-- Both results use the two components of the pattern.
productDifference (x,y) = (x*y, abs (x-y))

main :: IO ()
main = do
  print (productDifference (5,7))  -- expected: (35,2)
  print (productDifference (0,4))  -- expected: (0,4)
  print (productDifference (-3,2))  -- expected: (-6,5)
  print (productDifference (4,4))  -- expected: (16,0)
  print (productDifference (1,1))  -- expected: (1,0)
