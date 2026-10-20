-- Title: Repair a type declaration and use its representation
{-
QUESTION
The recursive synonym type Chain a = (a,Chain a) is not permitted.
Use the supplied recursive data type, which also has a finite base case.
Write repair to count Link constructors without inspecting their values.
Use the function signature repair :: Chain a -> Int. (6 marks)
-}

data Chain a = End | Link a (Chain a)

repair :: Chain a -> Int
repair = undefined -- Your answer here

main :: IO ()
main = do
  print (repair (End :: Chain Int))  -- expected: 0
  print (repair (Link 1 End))  -- expected: 1
  print (repair (Link 1 (Link 2 End)))  -- expected: 2
  print (repair (Link True End))  -- expected: 1
  print (repair (Link "a" (Link "b" (Link "c" End))))  -- expected: 3
