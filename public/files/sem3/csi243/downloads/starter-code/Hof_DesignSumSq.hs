-- Title: Use foldr to total squares
{-
QUESTION
Write sumsq :: Int -> Int to total the squares of 1 through n.
Use foldr directly, without map or sum. Return 0 when n <= 0. (5 marks)
-}

sumsq :: Int -> Int
sumsq = undefined -- Your answer here

main :: IO ()
main = do
  print (sumsq (0))  -- expected: 0
  print (sumsq (1))  -- expected: 1
  print (sumsq (3))  -- expected: 14
  print (sumsq (4))  -- expected: 30
  print (sumsq (-2))  -- expected: 0
