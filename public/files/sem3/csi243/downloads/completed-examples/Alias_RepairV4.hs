-- Title: Repair a type declaration and use its representation
{-
QUESTION
The recursive synonym type Chain a = (a,Chain a) is not permitted.
Use the supplied recursive data type, which also has a finite base case.
Write repair to count Link constructors without inspecting their values.
Use the function signature repair :: Chain a -> Int. (6 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- repair :: Chain a -> Int
-- Plan: Distinguish an alias expansion from a data or newtype constructor.
data Chain a = End | Link a (Chain a)

repair :: Chain a -> Int
-- Use the alias directly, or explicitly match/build the real constructor.
repair End = 0
repair (Link _ rest) = 1 + repair rest

-- A recursive alias would expand forever; data introduces actual constructors.
-- End terminates a finite Chain; each Link contributes one to its length.

main :: IO ()
main = do
  print (repair (End :: Chain Int))  -- expected: 0
  print (repair (Link 1 End))  -- expected: 1
  print (repair (Link 1 (Link 2 End)))  -- expected: 2
  print (repair (Link True End))  -- expected: 1
  print (repair (Link "a" (Link "b" (Link "c" End))))  -- expected: 3
