-- Title: Write divideSafe using a Maybe-like type
{-
QUESTION
Given the declaration below, write divideSafe :: Integer -> Integer -> Optional Integer. [5]
Return Missing for divisor 0; otherwise Present the integer quotient.
data Optional a = Missing | Present a deriving (Show,Eq)
-}

data Optional a = Missing | Present a deriving (Show,Eq)

divideSafe :: Integer -> Integer -> Optional Integer
divideSafe = undefined  -- Your answer here

main :: IO ()
main = do
  print (divideSafe 0 0)  -- expected: Missing
  print (divideSafe 0 3)  -- expected: Present 0
  print (divideSafe 8 2)  -- expected: Present 4
  print (divideSafe 7 2)  -- expected: Present 3
  print (divideSafe (-7) 2)  -- expected: Present (-4)
