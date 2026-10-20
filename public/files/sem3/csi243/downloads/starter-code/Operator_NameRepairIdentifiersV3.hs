-- Title: Repair an underscore name and distinguish scope from type errors
{-
QUESTION
Repair this deliberately commented definition:
-- total-score (x, y) = x - y
Write total_score' :: (Int,Int) -> Int with the intended behaviour.
A hyphen is an operator character, not part of an identifier. An internal
underscore and trailing apostrophe are legal. (5 marks)
Classify these commented failures without inventing compiler wording:
-- answer = missingScore 1 -- scope error if missingScore is not declared
-- wrong = total_score' (True, 0) -- type error
-- let = 3 -- parse error: reserved word used as a binding name
Explain that lowercase type variables and uppercase type constructors
occupy different roles; a value name cannot replace a type constructor.
-}

total_score' :: (Int,Int) -> Int
total_score' = undefined -- Your answer here

main :: IO ()
main = do
  print (total_score' (0,0))  -- expected: 0
  print (total_score' (9,4))  -- expected: 5
  print (total_score' (4,9))  -- expected: -5
  print (total_score' (-1,2))  -- expected: -3
  print (total_score' (1,0))  -- expected: 1
