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

-- Read the question: Write a definition; withDo has input/result type ([Int]) -> ([Int]) -> ([Int]).
-- Plan: Translate each do binding to >>= while preserving the order of arguments.
withDo :: ([Int]) -> ([Int]) -> ([Int])
withDo x y = do
  a <- x
  b <- y
  pure (a + b)

withBind :: ([Int]) -> ([Int]) -> ([Int])
withBind x y = x >>= (\a -> y >>= (\b -> pure (a + b)))

compareForms :: ([Int]) -> ([Int]) -> (([Int]), ([Int]), Bool)
compareForms x y = (a, b, a == b)
  where
    a = withDo x y
    b = withBind x y

main :: IO ()
main = do
  print (compareForms ([]) ([1]))  -- expected: ([],[],True)
  print (compareForms ([0]) ([0]))  -- expected: ([0],[0],True)
  print (compareForms ([1,2]) ([3,4]))  -- expected: ([4,5,5,6],[4,5,5,6],True)
  print (compareForms ([2]) ([]))  -- expected: ([],[],True)
  print (compareForms ([-1]) ([0,2]))  -- expected: ([-1,1],[-1,1],True)
