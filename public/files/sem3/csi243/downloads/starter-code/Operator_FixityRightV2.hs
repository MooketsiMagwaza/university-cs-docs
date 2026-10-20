-- Title: Trace right fixity for subtraction scaled by 2
{-
QUESTION
Define (<~>) :: Int -> Int -> Int by x <~> y = x - 2*y, with
infixr 6 <~>. Write evaluate :: Int -> Int -> Int -> (Int,Int).
Return the unparenthesised chain a <~> b <~> c and its left-grouped
alternative as a pair. Show the full grouping of both results. (6 marks)
Also diagnose these deliberately commented alternatives:
-- infixl 6 <+>
-- infixr 6 <*>
-- bad a b c = a <+> b <*> c
Assume both operators are defined as Int operations. Explain whether the
mixed chain can be parsed and repair it with parentheses. Distinguish this
failure from an undeclared operator and from supplying True to an Int
operator. Classify the three failures as parse, scope or type failures.
-}

(<~>) :: Int -> Int -> Int
(<~>) = undefined -- Your answer here

evaluate :: Int -> Int -> Int -> (Int,Int)
evaluate = undefined -- Your answer here

main :: IO ()
main = do
  print (evaluate 10 3 2)  -- expected: (12,0)
  print (evaluate 0 0 0)  -- expected: (0,0)
  print (evaluate 5 1 1)  -- expected: (7,1)
  print (evaluate 2 4 3)  -- expected: (6,-12)
  print (evaluate (-2) 1 2)  -- expected: (4,-8)
