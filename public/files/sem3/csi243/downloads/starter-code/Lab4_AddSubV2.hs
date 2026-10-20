-- Title: Return the product and absolute difference of two integers.
{-
QUESTION
Write productDifference :: (Int,Int) -> (Int,Int), returning the product
and absolute difference of the two integers. Use tuple pattern matching.
-}

productDifference :: (Int, Int) -> (Int, Int)
productDifference = undefined -- Your answer here

main :: IO ()
main = do
  print (productDifference (5,7))  -- expected: (35,2)
  print (productDifference (0,4))  -- expected: (0,4)
  print (productDifference (-3,2))  -- expected: (-6,5)
  print (productDifference (4,4))  -- expected: (16,0)
  print (productDifference (1,1))  -- expected: (1,0)
