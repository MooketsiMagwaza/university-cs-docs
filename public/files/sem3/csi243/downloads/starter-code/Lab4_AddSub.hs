-- Title: Return the sum and absolute difference of two integers.
{-
QUESTION
Create addSub, taking a pair of integers and returning their sum and
absolute difference as a pair. For example, addSub (5,7) returns (12,2).
The absolute difference follows the sheet example; use pattern matching.
-}

addSub :: (Int, Int) -> (Int, Int)
addSub = undefined -- Your answer here

main :: IO ()
main = do
  print (addSub (5,7))  -- expected: (12,2)
  print (addSub (7,5))  -- expected: (12,2)
  print (addSub (0,0))  -- expected: (0,0)
  print (addSub (-3,2))  -- expected: (-1,5)
  print (addSub (4,4))  -- expected: (8,0)
