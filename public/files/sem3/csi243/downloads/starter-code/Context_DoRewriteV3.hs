-- Title: Compare do notation with its bind rewrite
{-
QUESTION
Write withDo and withBind, each taking two inputs of type [Int]
and returning their sum in the same context. withDo must use do notation;
withBind must use >>= and pure. Write compareForms returning both
results and their equality. Both use the same input order. Monad has
Applicative as a superclass; do notation here is ordinary bind syntax,
not imperative mutation. For lists, each bind introduces branching.
-}

withDo :: ([Int]) -> ([Int]) -> ([Int])
withDo = undefined -- Your answer here

withBind :: ([Int]) -> ([Int]) -> ([Int])
withBind = undefined -- Your answer here

compareForms :: ([Int]) -> ([Int]) -> (([Int]), ([Int]), Bool)
compareForms = undefined -- Your answer here

main :: IO ()
main = do
  print (compareForms ([]) ([1]))  -- expected: ([],[],True)
  print (compareForms ([0]) ([0]))  -- expected: ([0],[0],True)
  print (compareForms ([1,2]) ([3,4]))  -- expected: ([4,5,5,6],[4,5,5,6],True)
  print (compareForms ([2]) ([]))  -- expected: ([],[],True)
  print (compareForms ([-1]) ([0,2]))  -- expected: ([-1,1],[-1,1],True)
