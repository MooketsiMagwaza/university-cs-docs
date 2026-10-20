-- Title: Sequence dependent Either validation failures
{-
QUESTION
Write withdraw :: Either String Int -> Int -> Either String Int.
Use >>= to obtain a balance. Reject negative balances with Left "balance",
then negative amounts with Left "amount", then amounts above the balance
with Left "funds"; otherwise return the remaining balance in Right.
An initial Left takes precedence over every validation.
-}

-- Read the question: Write a definition; withdraw has input/result type Either String Int -> Int -> Either String Int.
-- Plan: Bind the first result and choose the next computation from that value.
withdraw :: Either String Int -> Int -> Either String Int
withdraw initial amount = initial >>= step
  where
    step balance
      | balance < 0 = Left "balance"
      | amount < 0 = Left "amount"
      | amount > balance = Left "funds"
      | otherwise = Right (balance - amount)

main :: IO ()
main = do
  print (withdraw (Left "offline") (-1))  -- expected: Left "offline"
  print (withdraw (Right 0) 0)  -- expected: Right 0
  print (withdraw (Right (-1)) (-1))  -- expected: Left "balance"
  print (withdraw (Right 5) (-1))  -- expected: Left "amount"
  print (withdraw (Right 5) 6)  -- expected: Left "funds"
  print (withdraw (Right 5) 3)  -- expected: Right 2
