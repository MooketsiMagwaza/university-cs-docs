-- Title: Build a signed cube from repeated addition
{-
QUESTION
Write cube :: Integer -> Integer using a local signed multiplication
helper defined by repeated addition. Do not use (*) or (^).
-}

cube :: Integer -> Integer
cube = undefined -- Your answer here

main :: IO ()
main = do
  print (cube 0)  -- expected: 0
  print (cube 1)  -- expected: 1
  print (cube (-1))  -- expected: -1
  print (cube 3)  -- expected: 27
  print (cube (-2))  -- expected: -8
