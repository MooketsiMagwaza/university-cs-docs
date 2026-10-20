-- Title: Generate number-square pairs with a comprehension
{-
QUESTION
Write transform :: [Integer] -> [(Integer,Integer)] using a list comprehension. [3]
Return the number-square pairs of the input values, in their original order.
-}

transform :: [Integer] -> [(Integer,Integer)]
transform = undefined  -- Your answer here

main :: IO ()
main = do
  print (transform [])  -- expected: []
  print (transform [0])  -- expected: [(0,0)]
  print (transform [1,2,3])  -- expected: [(1,1),(2,4),(3,9)]
  print (transform [-2,-1,0])  -- expected: [(-2,4),(-1,1),(0,0)]
  print (transform [4])  -- expected: [(4,16)]
