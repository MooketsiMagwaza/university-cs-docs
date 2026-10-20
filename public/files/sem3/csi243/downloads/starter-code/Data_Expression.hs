-- Title: Evaluate an expression tree with addition and multiplication
{-
QUESTION
Given the declaration below, write eval :: Expr -> Integer recursively. [6]
Lit holds a value; Add adds; Mul performs multiplication.
data Expr = Lit Integer | Add Expr Expr | Mul Expr Expr
-}

data Expr = Lit Integer | Add Expr Expr | Mul Expr Expr

eval :: Expr -> Integer
eval = undefined  -- Your answer here

main :: IO ()
main = do
  print (eval (Lit 0))  -- expected: 0
  print (eval (Lit 7))  -- expected: 7
  print (eval (Add (Lit 2) (Lit 3)))  -- expected: 5
  print (eval (Mul (Add (Lit 2) (Lit 3)) (Lit 4)))  -- expected: 20
  print (eval (Add (Lit 2) (Mul (Lit 3) (Lit 4))))  -- expected: 14
