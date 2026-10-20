-- Title: Trace nonassoc fixity for subtraction scaled by 1
{-
QUESTION
Define (<~>) :: Int -> Int -> Int by x <~> y = x - 1*y, with
infix 6 <~>. Write evaluate :: Int -> Int -> Int -> (Int,Int).
Return ((a <~> b) <~> c) and (a <~> (b <~> c)) as a pair.
Explain why a <~> b <~> c is rejected without explicit parentheses. (6 marks)
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
infix 6 <~>
(<~>) :: Int -> Int -> Int
-- Both ((a <~> b) <~> c) and (a <~> (b <~> c)) must be grouped explicitly.
x <~> y = x - 1 * y

-- On 10,3,2: left = ((10 - 1*3) - 1*2) = 5.
-- Right = (10 - 1*(3 - 1*2)) = 9.
evaluate :: Int -> Int -> Int -> (Int,Int)
evaluate a b c = (((a <~> b) <~> c), (a <~> (b <~> c)))

main :: IO ()
main = do
  print (evaluate 10 3 2)  -- expected: (5,9)
  print (evaluate 0 0 0)  -- expected: (0,0)
  print (evaluate 5 1 1)  -- expected: (3,5)
  print (evaluate 2 4 3)  -- expected: (-5,1)
  print (evaluate (-2) 1 2)  -- expected: (-5,-1)
