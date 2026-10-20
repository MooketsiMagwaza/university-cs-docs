-- Title: Define the Lucas sequence recursively
{-
QUESTION
Write lucas :: Integer -> Integer for nonnegative indices.
Use lucas 0 = 2, lucas 1 = 1 and add the preceding two terms.
Reject negative indices with an informative error.
-}

lucas :: Integer -> Integer
lucas = undefined -- Your answer here

main :: IO ()
main = do
  print (lucas 0)  -- expected: 2
  print (lucas 1)  -- expected: 1
  print (lucas 2)  -- expected: 3
  print (lucas 5)  -- expected: 11
  print (lucas 6)  -- expected: 18
