-- Title: Evaluate a checked Fibonacci recurrence
{-
QUESTION
Write fibonacci :: Integer -> Either String Integer for the Fibonacci
recurrence with F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2).
Negative indices return Left "negative index". Use the expression
(+) <$> fibonacci (n-1) <*> fibonacci (n-2) in the recursive case.
Its type is Either String Integer: <$> wraps a partly applied (+),
then <*> applies it to the second result. Decreasing n proves termination
on non-negative inputs. Also write firstFailure combining two Either
values with (+) <$> x <*> y; demonstrate that the first Left wins.
-}

fibonacci :: Integer -> Either String Integer
fibonacci = undefined -- Your answer here

firstFailure :: Either String Integer -> Either String Integer -> Either String Integer
firstFailure = undefined -- Your answer here

main :: IO ()
main = do
  print (fibonacci (-1))  -- expected: Left "negative index"
  print (fibonacci 0)  -- expected: Right 0
  print (fibonacci 1)  -- expected: Right 1
  print (fibonacci 2)  -- expected: Right 1
  print (fibonacci 3)  -- expected: Right 2
  print (fibonacci 5)  -- expected: Right 5
  print (firstFailure (Left "first") (Left "second"))  -- expected: Left "first"
