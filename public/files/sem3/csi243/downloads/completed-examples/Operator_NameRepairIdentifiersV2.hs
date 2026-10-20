-- Title: Repair a reserved word and discard a tuple component
{-
QUESTION
Repair this deliberately commented definition:
-- case (x, _) = x * 2
Write caseValue :: (Int,String) -> Int with the intended behaviour.
The word case is reserved; caseValue is legal. Use _ for the unused text.
Explain why _name would bind a value but _ does not. (4 marks)
-}

-- Read the question: Repair a reserved identifier and write a tuple-to-Int function.
-- Plan: Choose a legal name and discard the unused component with a wildcard.
caseValue :: (Int,String) -> Int
-- The wildcard deliberately introduces no name.
caseValue (x, _) = x * 2

main :: IO ()
main = do
  print (caseValue (0,""))  -- expected: 0
  print (caseValue (3,"ignored"))  -- expected: 6
  print (caseValue (-2,"x"))  -- expected: -4
  print (caseValue (1,"one"))  -- expected: 2
  print (caseValue (4,""))  -- expected: 8
