module TestSupport (assertEqual, assertTrue, assertApprox, runSuite, suiteStatus) where

import System.Exit (ExitCode(..))

-- Read the question: Implement labelled assertions, a report and a pure exit-status decision.

-- Plan: Compare values directly, retaining the label for a failing check.
assertEqual :: Eq a => String -> a -> a -> (String, Bool)
assertEqual label expected actual = (label, expected == actual)

-- Plan: A predicate already supplies the Boolean verdict.
assertTrue :: String -> Bool -> (String, Bool)
assertTrue label condition = (label, condition)

-- Plan: Reject negative tolerance; include the boundary in the comparison.
assertApprox :: String -> Double -> Double -> Double -> (String, Bool)
assertApprox label tolerance expected actual =
  (label, tolerance >= 0 && abs (expected - actual) <= tolerance)

-- Plan: Constructor patterns select failed labels in their original order.
runSuite :: [(String, Bool)] -> String
runSuite checks = case [label | (label, False) <- checks] of
  [] -> "PASS " ++ show (length checks)
  labels -> "FAIL " ++ unwords labels

-- Plan: Model the conventional runner status; the empty suite succeeds.
suiteStatus :: [(String, Bool)] -> ExitCode
suiteStatus checks
  | and [ok | (_, ok) <- checks] = ExitSuccess
  | otherwise = ExitFailure 1
