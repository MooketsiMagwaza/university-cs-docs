-- Title: Extract lowercase vowels with a comprehension
{-
QUESTION
Write vowels :: String -> String using a comprehension. [3]
Keep only characters in "aeiou"; uppercase vowels are excluded.
-}

-- Read the question: Write vowels :: String -> String.
-- Plan: Use membership as the comprehension test.
vowels :: String -> String
vowels text = [c | c <- text, elem c "aeiou"]  -- Preserve order and repeats.

main :: IO ()
main = do
  print (vowels "")  -- expected: ""
  print (vowels "b")  -- expected: ""
  print (vowels "education")  -- expected: "euaio"
  print (vowels "AEIOU")  -- expected: ""
  print (vowels "banana")  -- expected: "aaa"
