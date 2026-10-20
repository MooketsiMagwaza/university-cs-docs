-- Title: Compose mark validation with a narrower pass contract
{-
QUESTION
Write award :: Int -> Either String Int. First validate a mark:
0..100 produces Right mark, otherwise Left "mark". Then a stage requiring
mark>=50 returns Right (mark+5); a lower mark gives Left "fail".
Use >>= to sequence stages. The first postcondition 0<=m<=100 does not
imply the second precondition m>=50; insert a check rather than assuming
composition is valid. The total wrapper defines both failure partitions.
A postcondition alone proves partial correctness, not termination;
here both stages have no recursion and terminate.
-}

award :: Int -> Either String Int
award = undefined -- Your answer here

main :: IO ()
main = do
  print (award (-1))  -- expected: Left "mark"
  print (award 0)  -- expected: Left "fail"
  print (award 49)  -- expected: Left "fail"
  print (award 50)  -- expected: Right 55
  print (award 100)  -- expected: Right 105
  print (award 101)  -- expected: Left "mark"
