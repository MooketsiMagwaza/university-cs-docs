-- Title: Define the infinite letters stream
{-
QUESTION
Write letters :: String as a self-referential list using (:), not repeat. [4]
Every element must be 'a'. The supplied tests observe only finite prefixes.
-}

-- Read the question: Write letters :: String.
-- Plan: Tie the tail back to the stream; take limits the demand.
letters :: String
letters = 'a' : letters  -- Produce a head before referring to the tail.

main :: IO ()
main = do
  print (take 0 letters)  -- expected: ""
  print (take 1 letters)  -- expected: "a"
  print (take 2 letters)  -- expected: "aa"
  print (take 3 letters)  -- expected: "aaa"
  print (take 5 letters)  -- expected: "aaaaa"
