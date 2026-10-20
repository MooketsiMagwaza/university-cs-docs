-- Title: Read character rows as columns
{-
QUESTION
Write textColumns :: [String] -> [String] using transpose.
Keep column order and skip missing characters in short or empty rows.
-}

textColumns :: [String] -> [String]
textColumns = undefined -- Your answer here

main :: IO ()
main = do
  print (textColumns [])  -- expected: []
  print (textColumns [""])  -- expected: []
  print (textColumns ["ab","cd"])  -- expected: ["ac","bd"]
  print (textColumns ["abc","d","ef"])  -- expected: ["ade","bf","c"]
  print (textColumns ["","xy"])  -- expected: ["x","y"]
