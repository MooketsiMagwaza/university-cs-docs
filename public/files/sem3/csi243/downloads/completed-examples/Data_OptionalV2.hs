-- Title: Write divideSafe using a Maybe-like type
{-
QUESTION
Given the declaration below, write divideSafe :: Integer -> Integer -> Optional Integer. [5]
Return Missing for divisor 0; otherwise Present the integer quotient.
data Optional a = Missing | Present a deriving (Show,Eq)
-}

-- Read the question: Write divideSafe :: Integer -> Integer -> Optional Integer.
-- Plan: Handle the missing and successful cases explicitly.
data Optional a = Missing | Present a deriving (Show,Eq)

divideSafe :: Integer -> Integer -> Optional Integer
divideSafe _ 0 = Missing  -- Check before division.
divideSafe x y = Present (div x y)

main :: IO ()
main = do
  print (divideSafe 0 0)  -- expected: Missing
  print (divideSafe 0 3)  -- expected: Present 0
  print (divideSafe 8 2)  -- expected: Present 4
  print (divideSafe 7 2)  -- expected: Present 3
  print (divideSafe (-7) 2)  -- expected: Present (-4)
