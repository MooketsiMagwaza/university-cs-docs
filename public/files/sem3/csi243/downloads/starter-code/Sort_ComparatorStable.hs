-- Title: Sort labelled scores by score with stable ties
{-
QUESTION
Write compareScore :: (String,Int) -> (String,Int) -> Ordering and
rankScores :: [(String,Int)] -> [(String,Int)]. Compare only scores in
ascending order using compare; use sortBy for ranking. Equal scores
must retain input order, rather than being sorted by the label.
-}

compareScore :: (String,Int) -> (String,Int) -> Ordering
compareScore = undefined -- Your answer here

rankScores :: [(String,Int)] -> [(String,Int)]
rankScores = undefined -- Your answer here

main :: IO ()
main = do
  print (rankScores [])  -- expected: []
  print (rankScores [("a",2)])  -- expected: [("a",2)]
  print (rankScores [("z",2),("a",2),("b",1)])  -- expected: [("b",1),("z",2),("a",2)]
  print (compareScore ("z",2) ("a",2))  -- expected: EQ
  print (compareScore ("a",1) ("b",3))  -- expected: LT
  print (rankScores [("a",3),("b",1),("c",2)])  -- expected: [("b",1),("c",2),("a",3)]
