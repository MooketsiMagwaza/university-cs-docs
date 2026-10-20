-- Title: Construct an expression from a price specification
{-
QUESTION
Write trace :: Integer -> Integer. Add one to the supplied amount,
then add five, then multiply the entire result by ten.
-}

-- Read the question: Write trace from the expression specification and stated types.
-- Plan: Parenthesise grouped arithmetic and reduce operators in precedence order.
trace :: Integer -> Integer
-- Key step: function application binds more tightly than infix arithmetic.
trace n = ((n+1)+5)*10

main :: IO ()
main = do
  print (trace 19)  -- expected: 250
  print (trace 0)  -- expected: 60
  print (trace (-6))  -- expected: 0
  print (trace 1)  -- expected: 70
  print (trace (-7))  -- expected: -10
