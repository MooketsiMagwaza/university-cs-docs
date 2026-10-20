-- Title: Use a parameterised association-table alias
{-
QUESTION
Given type Assoc k v = [(k,v)], write lookupAll :: String -> Assoc String Int -> [Int] to
return all values for a given key in entry order.
Fully expand the signature and explain the order of k and v. (6 marks)
-}

type Assoc k v = [(k,v)]

lookupAll :: String -> Assoc String Int -> [Int]
lookupAll = undefined -- Your answer here

main :: IO ()
main = do
  print (lookupAll "a" [])  -- expected: []
  print (lookupAll "a" [("a",1)])  -- expected: [1]
  print (lookupAll "z" [("a",1)])  -- expected: []
  print (lookupAll "a" [("a",1),("b",2),("a",3)])  -- expected: [1,3]
  print (lookupAll "" [("",0)])  -- expected: [0]
