-- Title: Compare a mean of group means with a pooled mean
{-
QUESTION
(16 marks) Implement every exported signature in Core, Report, TestSupport
and Tests. average handles any Int list and returns Nothing on [].
meanOfMeans ignores empty groups and gives each nonempty group equal weight;
pooledMean instead gives each observation equal weight. If no observations
remain, both return Nothing. totals returns (sum of observations, count).
policyGap tests whether the two Maybe results differ. In writing, calculate
both means of the unequal fixture, identify their denominators, and explain
why neither policy is automatically correct for every specification.

Entry: Main.hs. From the parent of this bundle, run:
  runghc -iCapstone_AveragePolicyGroups Capstone_AveragePolicyGroups/Main.hs
Type-check the starter (do not execute its undefined functions):
  ghc -fno-code -iCapstone_AveragePolicyGroups Capstone_AveragePolicyGroups/Main.hs
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
  print (meanOfMeans []) -- expected: Nothing
  print (pooledMean [[],[]]) -- expected: Nothing
  print (meanOfMeans [[100],[0,0]]) -- expected: Just 50.0
  print (totals [[100],[0,0]]) -- expected: (100,3)
  print (policyGap [[100],[0,0]]) -- expected: True
  print (pooledMean [[100],[0]]) -- expected: Just 50.0
  print (pooledMean [[100],[0,0,0]]) -- expected: Just 25.0
  print (meanOfMeans [[100],[0,0,0]]) -- expected: Just 50.0
  putStrLn (runSuite checks) -- expected: PASS 6
