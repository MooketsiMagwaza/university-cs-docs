-- Title: Construct an expression from a price specification
{-
QUESTION
Write trace :: Integer -> Integer. Add one to the supplied amount,
then add five, then multiply the entire result by ten.
-}

trace :: Integer -> Integer
trace = undefined -- Your answer here

main :: IO ()
main = do
  print (trace 19)  -- expected: 250
  print (trace 0)  -- expected: 60
  print (trace (-6))  -- expected: 0
  print (trace 1)  -- expected: 70
  print (trace (-7))  -- expected: -10
