-- Title: Use a parameterised association-table alias
{-
QUESTION
Given type Assoc k v = [(k,v)], write keys :: Assoc String Int -> [String] to
return every key in order, including duplicates.
Fully expand the signature and explain the order of k and v. (6 marks)
-}

type Assoc k v = [(k,v)]

keys :: Assoc String Int -> [String]
keys = undefined -- Your answer here

main :: IO ()
main = do
  print (keys [])  -- expected: []
  print (keys [("a",1)])  -- expected: ["a"]
  print (keys [("a",1),("b",2)])  -- expected: ["a","b"]
  print (keys [("a",1),("a",3)])  -- expected: ["a","a"]
  print (keys [("",0)])  -- expected: [""]
