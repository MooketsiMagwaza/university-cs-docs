-- Title: Compare do notation with its bind rewrite
{-
QUESTION
Write withDo and withBind, each taking two inputs of type Either String Int
and returning their sum in the same context. withDo must use do notation;
withBind must use >>= and pure. Write compareForms returning both
results and their equality. Both use the same input order. Monad has
Applicative as a superclass; do notation here is ordinary bind syntax,
not imperative mutation. For lists, each bind introduces branching.
-}

-- Read the question: Write a definition; withDo has input/result type (Either String Int) -> (Either String Int) -> (Either String Int).
-- Plan: Translate each do binding to >>= while preserving the order of arguments.
withDo :: (Either String Int) -> (Either String Int) -> (Either String Int)
withDo x y = do
  a <- x
  b <- y
  pure (a + b)

withBind :: (Either String Int) -> (Either String Int) -> (Either String Int)
withBind x y = x >>= (\a -> y >>= (\b -> pure (a + b)))

compareForms :: (Either String Int) -> (Either String Int) -> ((Either String Int), (Either String Int), Bool)
compareForms x y = (a, b, a == b)
  where
    a = withDo x y
    b = withBind x y

main :: IO ()
main = do
  print (compareForms (Left "a") (Left "b"))  -- expected: (Left "a",Left "a",True)
  print (compareForms (Right 0) (Right 0))  -- expected: (Right 0,Right 0,True)
  print (compareForms (Right 2) (Right 3))  -- expected: (Right 5,Right 5,True)
  print (compareForms (Right 2) (Left "b"))  -- expected: (Left "b",Left "b",True)
  print (compareForms (Right (-2)) (Right 1))  -- expected: (Right (-1),Right (-1),True)
