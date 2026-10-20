-- Title: Return the penultimate element safely.
{-
QUESTION
Write penultimate :: [a] -> Maybe a recursively. Return the second-last
element wrapped in Just. Return Nothing when fewer than two elements
are present. Do not add an equality constraint.
-}

penultimate :: [a] -> Maybe a
penultimate = undefined -- Your answer here

main :: IO ()
main = do
  print (penultimate ([] :: [Int]))  -- expected: Nothing
  print (penultimate ([1] :: [Int]))  -- expected: Nothing
  print (penultimate ([1,2] :: [Int]))  -- expected: Just 1
  print (penultimate "abcd")  -- expected: Just 'c'
  print (penultimate [True,False,False])  -- expected: Just False
