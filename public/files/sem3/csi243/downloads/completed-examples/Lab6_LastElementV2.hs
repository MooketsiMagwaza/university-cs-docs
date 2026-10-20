-- Title: Return the last element safely using Maybe.
{-
QUESTION
Write safeLast :: [a] -> Maybe a recursively. Return Nothing for an
empty list and Just the last element otherwise. Keep the function
polymorphic and do not require Eq or Ord.
-}

-- Read the question: Write [a] -> Maybe a, including absence as an output.
-- Plan: Use an empty base case and a singleton base case.
safeLast :: [a] -> Maybe a
-- Nothing represents absence; a singleton supplies the last value.
safeLast [] = Nothing
safeLast [x] = Just x
safeLast (_:xs) = safeLast xs

main :: IO ()
main = do
  print (safeLast ([] :: [Int]))  -- expected: Nothing
  print (safeLast ([0] :: [Int]))  -- expected: Just 0
  print (safeLast ([1,2,3] :: [Int]))  -- expected: Just 3
  print (safeLast "ab")  -- expected: Just 'b'
  print (safeLast [False])  -- expected: Just False
