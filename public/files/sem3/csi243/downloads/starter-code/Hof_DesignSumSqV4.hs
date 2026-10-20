-- Title: Use foldr to total doubled values
{-
QUESTION
Write sumsq :: Int -> Int to total the doubled values of 1 through n.
Use foldr directly, without map or sum. Return 0 when n <= 0. (5 marks)
-}

sumsq :: Int -> Int
sumsq = undefined -- Your answer here

main :: IO ()
main = do
  print (sumsq (0))  -- expected: 0
  print (sumsq (1))  -- expected: 2
  print (sumsq (3))  -- expected: 12
  print (sumsq (4))  -- expected: 20
  print (sumsq (-2))  -- expected: 0
