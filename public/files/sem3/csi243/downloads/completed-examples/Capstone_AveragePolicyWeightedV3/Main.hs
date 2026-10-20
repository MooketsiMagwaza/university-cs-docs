-- Title: Compute a validated weighted mean with weights 2 and 2
{-
QUESTION
(16 marks) Implement Core, Report, TestSupport and Tests. A pair is
(mark, weight). Require marks in 0..100 and positive integer weights.
The list must be nonempty. weighted returns Left "invalid weights or marks"
for invalid data, otherwise Right (sum of mark*weight / sum of weights).
Use Integer intermediates for products and totals. validWeights implements
the predicate. decision returns "ERROR: " followed by the error, or "pass"
for a mean at least 60, otherwise "fail". Explain why a zero total weight
must be excluded and why weights do not have to add to 100.

Entry: Main.hs. From the parent of this bundle, run:
  runghc -iCapstone_AveragePolicyWeightedV3 Capstone_AveragePolicyWeightedV3/Main.hs
Type-check the starter (do not execute its undefined functions):
  ghc -fno-code -iCapstone_AveragePolicyWeightedV3 Capstone_AveragePolicyWeightedV3/Main.hs
All module names equal their flat file names. Main is the application.
Tests holds pure checks; TestSupport reports labels and models exit status.
Only Main.hs is an entry; exclude deliberately broken examples from a runner.
The printed ExitCode is a model: Main prints diagnostics and exits normally.
A production runner can pass suiteStatus to exitWith. Passing finite checks
is evidence, not proof. No keyboard input or external fixtures are required.
-}

import Core
import Report
import TestSupport
import Tests

main :: IO ()
main = do
  print (weighted [(40,2),(80,2)]) -- expected: Right 60.0
  print (weighted [(100,1)]) -- expected: Right 100.0
  print (weighted []) -- expected: Left "invalid weights or marks"
  print (weighted [(50,0)]) -- expected: Left "invalid weights or marks"
  print (weighted [(50,-1)]) -- expected: Left "invalid weights or marks"
  putStrLn (decision [(101,1)]) -- expected: ERROR: invalid weights or marks
  putStrLn (decision [(60,1)]) -- expected: pass
  putStrLn (runSuite checks) -- expected: PASS 5
