-- Title: Project first components polymorphically
{-
QUESTION
Write firsts :: [(a,b)] -> [a] without class constraints. [4]
Preserve pair order and return each first component.
-}

firsts :: [(a,b)] -> [a]
firsts = undefined  -- Your answer here

main :: IO ()
main = do
  print (firsts ([] :: [(Int,Bool)]))  -- expected: []
  print (firsts [(1,True)])  -- expected: [1]
  print (firsts [(1,True),(2,False)])  -- expected: [1,2]
  print (firsts [('a',0),('b',1)])  -- expected: "ab"
  print (firsts [("",1),("cat",2)])  -- expected: ["","cat"]
