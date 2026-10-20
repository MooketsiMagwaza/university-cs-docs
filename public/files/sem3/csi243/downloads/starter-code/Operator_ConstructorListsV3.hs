-- Title: Use right-associated cons patterns to swap a list prefix
{-
QUESTION
Write swapFront :: [a] -> [a] swapping the first two elements when
present, otherwise leaving the list unchanged. Use a constructor pattern
x:y:rest, which means x:(y:rest). (5 marks)
Explain why the pattern needs no equality test and why a symbolic value
operator definition could not replace the cons constructors in it.
-}

swapFront :: [a] -> [a]
swapFront = undefined -- Your answer here

main :: IO ()
main = do
  print (swapFront ([] :: [Int]))  -- expected: []
  print (swapFront [1 :: Int])  -- expected: [1]
  print (swapFront [1,2,3 :: Int])  -- expected: [2,1,3]
  print (swapFront "abc")  -- expected: "bac"
  print (swapFront [True,False])  -- expected: [False,True]
