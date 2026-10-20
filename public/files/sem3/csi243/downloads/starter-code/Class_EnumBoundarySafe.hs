-- Title: Guard succ at the upper Boolean endpoint
{-
QUESTION
Write nextValue :: (Eq a, Enum a, Bounded a) => a -> Maybe a. (4 marks)
Use succ only below maxBound. Explain why succ True would fail.
Use the conventional finite Bool and Ordering enumerations for the tests.
-}

nextValue :: (Eq a, Enum a, Bounded a) => a -> Maybe a
nextValue = undefined -- Your answer here

main :: IO ()
main = do
  print (nextValue False)  -- expected: Just True
  print (nextValue True)  -- expected: Nothing
  print (nextValue LT)  -- expected: Just EQ
  print (nextValue EQ)  -- expected: Just GT
  print (nextValue GT)  -- expected: Nothing
