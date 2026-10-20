-- Title: Implement labelled assertions and diagnose deliberate failures
{-
QUESTION
(14 marks) Implement TestSupport and Tests with the given exports.
assertEqual compares expected and actual values; assertTrue retains a
Boolean; assertApprox accepts a nonnegative tolerance and requires absolute
difference <= tolerance. Each returns (label, verdict). runSuite returns
"PASS n" when every check passes (including "PASS 0"), otherwise "FAIL "
followed by failed labels separated by single spaces, in original order.
suiteStatus returns ExitSuccess or ExitFailure 1. Tests.checks contains
both successful and deliberately unsuccessful checks as shown in Main.
Use finite Double values. Explain why an approximate check is appropriate
for computed floating values and why a negative tolerance is invalid.

Entry: Main.hs. From the parent of this bundle, run:
  runghc -iCapstone_TestHarnessAssertionsV2 Capstone_TestHarnessAssertionsV2/Main.hs
Type-check the starter (do not execute its undefined functions):
  ghc -fno-code -iCapstone_TestHarnessAssertionsV2 Capstone_TestHarnessAssertionsV2/Main.hs
All module names equal their flat file names. Main is the application.
Tests holds pure checks; TestSupport reports labels and models exit status.
Only Main.hs is an entry; exclude deliberately broken examples from a runner.
The printed ExitCode is a model: Main prints diagnostics and exits normally.
A production runner can pass suiteStatus to exitWith. Passing finite checks
is evidence, not proof. No keyboard input or external fixtures are required.
-}

import TestSupport
import Tests

main :: IO ()
main = do
  print (assertEqual "wrong-total" (4 :: Int) 5) -- expected: ("wrong-total",False)
  print (assertApprox "boundary" 0.25 2.0 (2.0 + 0.25)) -- expected: ("boundary",True)
  print (assertTrue "empty" (all even ([] :: [Int]))) -- expected: ("empty",True)
  putStrLn (runSuite []) -- expected: PASS 0
  putStrLn (runSuite checks) -- expected: FAIL wrong-total far negative-tolerance
  print (suiteStatus checks) -- expected: ExitFailure 1
