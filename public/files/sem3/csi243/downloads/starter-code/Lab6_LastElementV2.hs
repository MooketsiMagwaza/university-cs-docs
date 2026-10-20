-- Title: Return the last element safely using Maybe.
{-
QUESTION
Write safeLast :: [a] -> Maybe a recursively. Return Nothing for an
empty list and Just the last element otherwise. Keep the function
polymorphic and do not require Eq or Ord.
-}

safeLast :: [a] -> Maybe a
safeLast = undefined -- Your answer here

main :: IO ()
main = do
  print (safeLast ([] :: [Int]))  -- expected: Nothing
  print (safeLast ([0] :: [Int]))  -- expected: Just 0
  print (safeLast ([1,2,3] :: [Int]))  -- expected: Just 3
  print (safeLast "ab")  -- expected: Just 'b'
  print (safeLast [False])  -- expected: Just False
