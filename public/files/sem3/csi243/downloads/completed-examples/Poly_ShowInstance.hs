-- Title: Write Show by hand for Result
{-
QUESTION
Given data Result = Pass | Fail, write a Show instance. [4]
Pass must display as passed, Fail must display as failed.
The output contains no quotation marks. Do not derive Show.
-}

-- Read the question: Write .
-- Plan: Give one show equation per constructor.
data Result = Pass | Fail

instance Show Result where
  show Pass = "passed"  -- Required rendering.
  show Fail = "failed"  -- Required rendering.

main :: IO ()
main = do
  print (Pass)  -- expected: passed
  print (Fail)  -- expected: failed
  print ([Pass,Fail])  -- expected: [passed,failed]
  print (([] :: [Result]))  -- expected: []
  print (Just Pass)  -- expected: Just passed
