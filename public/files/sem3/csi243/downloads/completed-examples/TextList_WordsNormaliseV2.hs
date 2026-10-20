-- Title: Split text into words and report their lengths
{-
QUESTION
Write wordLengths :: String -> [Int]. Use words followed by map length.
Tabs and newlines separate words just as spaces do; punctuation stays in a word.
-}

-- Read the question: Write wordLengths :: String -> [Int]; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
wordLengths :: String -> [Int]
-- Key step: the library operation also handles empty input.
wordLengths = map length . words

main :: IO ()
main = do
  print (wordLengths "")  -- expected: []
  print (wordLengths "x")  -- expected: [1]
  print (wordLengths "  red blue ")  -- expected: [3,4]
  print (wordLengths "a\tbb\nccc")  -- expected: [1,2,3]
  print (wordLengths "hi, all!")  -- expected: [3,4]
