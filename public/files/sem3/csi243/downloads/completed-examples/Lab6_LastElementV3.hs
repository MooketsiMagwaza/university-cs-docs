-- Title: Return the penultimate element safely.
{-
QUESTION
Write penultimate :: [a] -> Maybe a recursively. Return the second-last
element wrapped in Just. Return Nothing when fewer than two elements
are present. Do not add an equality constraint.
-}

-- Read the question: Write a polymorphic lookup returning Maybe a.
-- Plan: Match short lists first; recurse until exactly two values remain.
penultimate :: [a] -> Maybe a
-- Exactly two elements reveal the answer; longer lists shrink.
penultimate [] = Nothing
penultimate [_] = Nothing
penultimate [x,_] = Just x
penultimate (_:xs) = penultimate xs

main :: IO ()
main = do
  print (penultimate ([] :: [Int]))  -- expected: Nothing
  print (penultimate ([1] :: [Int]))  -- expected: Nothing
  print (penultimate ([1,2] :: [Int]))  -- expected: Just 1
  print (penultimate "abcd")  -- expected: Just 'c'
  print (penultimate [True,False,False])  -- expected: Just False
