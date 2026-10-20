-- Title: Find the first position of a requested word
{-
QUESTION
Write wordIndex :: String -> [String] -> Maybe Int using elemIndex.
Match case sensitively and return only the first zero-based index.
-}

wordIndex :: String -> [String] -> Maybe Int
wordIndex = undefined -- Your answer here

main :: IO ()
main = do
  print (wordIndex "a" [])  -- expected: Nothing
  print (wordIndex "a" ["a"])  -- expected: Just 0
  print (wordIndex "a" ["A"])  -- expected: Nothing
  print (wordIndex "cat" ["dog","cat","cat"])  -- expected: Just 1
  print (wordIndex "" ["x",""])  -- expected: Just 1
