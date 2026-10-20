-- Title: Trace left fixity for subtraction scaled by 4
{-
QUESTION
Define (<~>) :: Int -> Int -> Int by x <~> y = x - 4*y, with
infixl 6 <~>. Write evaluate :: Int -> Int -> Int -> (Int,Int).
Return the unparenthesised chain a <~> b <~> c and its right-grouped
alternative as a pair. Show the full grouping of both results. (6 marks)
Also write mixed :: Int -> Int -> Int -> (Int,Int), returning
(a <~> b * c) and ((a <~> b) * c). Multiplication has precedence 7,
so the first expression means (a <~> (b * c)).
Also diagnose these deliberately commented alternatives:
-- infixl 6 <+>
-- infixr 6 <*>
-- bad a b c = a <+> b <*> c
Assume both operators are defined as Int operations. Explain whether the
mixed chain can be parsed and repair it with parentheses. Distinguish this
failure from an undeclared operator and from supplying True to an Int
operator. Classify the three failures as parse, scope or type failures.
-}

-- Read the question: Define an Int operator and evaluate two association choices.
-- Plan: Apply the declared fixity, then substitute the operator definition.
-- Equal precedence with opposing associativities is a parse conflict.
-- Repair: (a <+> b) <*> c or a <+> (b <*> c), choosing the intended order.
-- Undeclared operators cause scope errors; Bool in an Int slot is a type error.
infixl 6 <~>
(<~>) :: Int -> Int -> Int
-- The chain groups as ((a <~> b) <~> c); compare (a <~> (b <~> c)).
x <~> y = x - 4 * y

-- On 10,3,2: left = ((10 - 4*3) - 4*2) = -10.
-- Right = (10 - 4*(3 - 4*2)) = 30.
evaluate :: Int -> Int -> Int -> (Int,Int)
evaluate a b c = (a <~> b <~> c, (a <~> (b <~> c)))

mixed :: Int -> Int -> Int -> (Int,Int)
-- The higher-precedence multiplication groups before <~>.
mixed a b c = (a <~> b * c, (a <~> b) * c)

main :: IO ()
main = do
  print (evaluate 10 3 2)  -- expected: (-10,30)
  print (evaluate 0 0 0)  -- expected: (0,0)
  print (evaluate 5 1 1)  -- expected: (-3,17)
  print (evaluate 2 4 3)  -- expected: (-26,34)
  print (evaluate (-2) 1 2)  -- expected: (-14,26)
  print (mixed 10 3 2)  -- expected: (-14,-4)
  print (mixed 0 0 0)  -- expected: (0,0)
  print (mixed 5 1 1)  -- expected: (1,1)
  print (mixed 2 4 3)  -- expected: (-46,-42)
  print (mixed (-2) 1 2)  -- expected: (-10,-12)
