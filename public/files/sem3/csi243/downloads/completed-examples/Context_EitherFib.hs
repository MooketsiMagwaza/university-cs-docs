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

-- Read the question: Write a definition; fibonacci has input/result type Integer -> Either String Integer.
-- Plan: Check the domain and bases before combining the two recursive Either results.
fibonacci :: Integer -> Either String Integer
fibonacci n
  | n < 0 = Left "negative index"
  | n == 0 = Right 0
  | n == 1 = Right 1
  | otherwise = (+) <$> fibonacci (n-1) <*> fibonacci (n-2)

firstFailure :: Either String Integer -> Either String Integer -> Either String Integer
firstFailure x y = (+) <$> x <*> y -- Left-to-right failure precedence.

main :: IO ()
main = do
  print (fibonacci (-1))  -- expected: Left "negative index"
  print (fibonacci 0)  -- expected: Right 0
  print (fibonacci 1)  -- expected: Right 1
  print (fibonacci 2)  -- expected: Right 1
  print (fibonacci 3)  -- expected: Right 2
  print (fibonacci 5)  -- expected: Right 5
  print (firstFailure (Left "first") (Left "second"))  -- expected: Left "first"
