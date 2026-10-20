-- Title: Extract components using tuple patterns
{-
QUESTION
Specify and implement fst and snd for pairs, using the names first and second.
fst returns the first component; snd returns the second component.
-}

first :: (a, b) -> a
first = undefined -- Your answer here

second :: (a, b) -> b
second = undefined -- Your answer here

main :: IO ()
main = do
  print (first (0, True))  -- expected: 0
  print (second (0, True))  -- expected: True
  print (first ("", 2))  -- expected: ""
  print (second ("x", 7))  -- expected: 7
  print (first ([1,2], False))  -- expected: [1,2]
  print (second (1, "ok"))  -- expected: "ok"
