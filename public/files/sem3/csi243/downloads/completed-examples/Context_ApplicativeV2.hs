-- Title: Lift a ternary total over independent Either values
{-
QUESTION
Write combine :: Either String Int -> Either String Int ->
Either String Int -> Either String Int. Lift the ternary function
\a b c -> a + b + c using <$> and <*>. Return the first Left from
left to right; Either does not accumulate errors. The arguments are
independent computations, unlike a bind whose next input uses a result.
-}

-- Read the question: Write a definition; combine has input/result type Either String Int -> Either String Int -> Either String Int -> Either String Int.
-- Plan: Lift the stated function and apply its independent wrapped arguments in order.
combine :: Either String Int -> Either String Int -> Either String Int -> Either String Int
combine a b c = (\x y z -> x + y + z) <$> a <*> b <*> c -- First Left wins.

main :: IO ()
main = do
  print (combine (Right 0) (Right 0) (Right 0))  -- expected: Right 0
  print (combine (Right 2) (Right 3) (Right 4))  -- expected: Right 9
  print (combine (Left "a") (Left "b") (Left "c"))  -- expected: Left "a"
  print (combine (Right 1) (Left "b") (Left "c"))  -- expected: Left "b"
  print (combine (Right 1) (Right 2) (Left "c"))  -- expected: Left "c"
