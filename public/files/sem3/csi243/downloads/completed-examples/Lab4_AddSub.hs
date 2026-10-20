-- Title: Return the sum and absolute difference of two integers.
{-
QUESTION
Create addSub, taking a pair of integers and returning their sum and
absolute difference as a pair. For example, addSub (5,7) returns (12,2).
The absolute difference follows the sheet example; use pattern matching.
-}

-- Read the question: Write a function from an Int pair to an Int pair.
-- Plan: Unpack the tuple and calculate both fields.
addSub :: (Int, Int) -> (Int, Int)
-- Match the pair; subtract the smaller value from the larger.
addSub (x,y) = (x+y, abs (x-y))

main :: IO ()
main = do
  print (addSub (5,7))  -- expected: (12,2)
  print (addSub (7,5))  -- expected: (12,2)
  print (addSub (0,0))  -- expected: (0,0)
  print (addSub (-3,2))  -- expected: (-1,5)
  print (addSub (4,4))  -- expected: (8,0)
