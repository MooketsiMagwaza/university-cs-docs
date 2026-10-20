-- Title: Concatenate text using the standard append operator
{-
QUESTION
Write catText :: String -> String -> String using (++). The lecture
name cat is informal: define your own function, rather than assuming cat
is in Prelude. Keep every character, including spaces and newlines.
-}

-- Read the question: Write catText :: String -> String -> String; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
catText :: String -> String -> String
-- Key step: the library operation also handles empty input.
catText left right = left ++ right

main :: IO ()
main = do
  print (catText "" "")  -- expected: ""
  print (catText "a" "")  -- expected: "a"
  print (catText "" "b")  -- expected: "b"
  print (catText "a " " b")  -- expected: "a  b"
  print (catText "a\n" "b")  -- expected: "a\nb"
