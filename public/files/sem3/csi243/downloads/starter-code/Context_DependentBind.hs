-- Title: Choose a second Maybe calculation from the first result
{-
QUESTION
Write divideAt :: [Int] -> Int -> Maybe Int. First safely select the
zero-based element at the given index. Then use >>= to divide 12 by
that selected denominator with div. Invalid indices or denominator zero
return Nothing. The second computation depends on the selected value;
independent applicative inputs cannot express that choice alone.
-}

divideAt :: [Int] -> Int -> Maybe Int
divideAt = undefined -- Your answer here

main :: IO ()
main = do
  print (divideAt [] 0)  -- expected: Nothing
  print (divideAt [3] 0)  -- expected: Just 4
  print (divideAt [0] 0)  -- expected: Nothing
  print (divideAt [2,4] 1)  -- expected: Just 3
  print (divideAt [3] 1)  -- expected: Nothing
  print (divideAt [3] (-1))  -- expected: Nothing
