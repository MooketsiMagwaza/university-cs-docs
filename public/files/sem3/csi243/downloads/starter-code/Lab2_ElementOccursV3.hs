-- Title: Count occurrences in a list of String values
{-
QUESTION
Specify and implement elementOccurs recursively. Count occurrences of a given
String in a list. Use list first, target second.
For example, elementOccurs ["red","blue","red"] "red" = 2.
-}

elementOccurs :: [String] -> String -> Int
elementOccurs = undefined -- Your answer here

main :: IO ()
main = do
  print (elementOccurs ["red","blue","red"] "red")  -- expected: 2
  print (elementOccurs [] "red")  -- expected: 0
  print (elementOccurs ["red"] "red")  -- expected: 1
  print (elementOccurs ["blue"] "red")  -- expected: 0
  print (elementOccurs ["",""] "")  -- expected: 2
