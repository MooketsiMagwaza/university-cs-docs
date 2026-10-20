-- Title: Compare do notation with its bind rewrite
{-
QUESTION
Write withDo and withBind, each taking two inputs of type Maybe Int
and returning their sum in the same context. withDo must use do notation;
withBind must use >>= and pure. Write compareForms returning both
results and their equality. Both use the same input order. Monad has
Applicative as a superclass; do notation here is ordinary bind syntax,
not imperative mutation. For lists, each bind introduces branching.
-}

withDo :: (Maybe Int) -> (Maybe Int) -> (Maybe Int)
withDo = undefined -- Your answer here

withBind :: (Maybe Int) -> (Maybe Int) -> (Maybe Int)
withBind = undefined -- Your answer here

compareForms :: (Maybe Int) -> (Maybe Int) -> ((Maybe Int), (Maybe Int), Bool)
compareForms = undefined -- Your answer here

main :: IO ()
main = do
  print (compareForms (Nothing) (Just 2))  -- expected: (Nothing,Nothing,True)
  print (compareForms (Just 0) (Just 0))  -- expected: (Just 0,Just 0,True)
  print (compareForms (Just 2) (Just 3))  -- expected: (Just 5,Just 5,True)
  print (compareForms (Just 2) (Nothing))  -- expected: (Nothing,Nothing,True)
  print (compareForms (Just (-2)) (Just 1))  -- expected: (Just (-1),Just (-1),True)
