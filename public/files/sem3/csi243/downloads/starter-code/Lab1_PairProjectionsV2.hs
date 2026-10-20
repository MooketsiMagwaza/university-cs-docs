-- Title: Extract components using tuple patterns
{-
QUESTION
Write first and second to extract the first and second components of a triple.
-}

first :: (a, b, c) -> a
first = undefined -- Your answer here

second :: (a, b, c) -> b
second = undefined -- Your answer here

main :: IO ()
main = do
  print (first (0, True, ""))  -- expected: 0
  print (second (0, True, ""))  -- expected: True
  print (first ("", 2, False))  -- expected: ""
  print (second ("x", 7, False))  -- expected: 7
  print (first ([1,2], False, 0))  -- expected: [1,2]
