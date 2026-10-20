-- Title: Run independent tests against an add-3 transform
{-
QUESTION
(16 marks) Implement Core, TestSupport and Tests. adjust adds 3 to
each Int; faultyAdjust deliberately adds 4 instead. suiteFor accepts
an implementation and uses three literal oracles: [], [0], and [-1,2].
checks tests adjust; mutantChecks tests faultyAdjust. Implement the same
labelled equality/Boolean/approximate helpers, report and status contracts
as follows: runSuite is "PASS n" or "FAIL " plus failed labels; suiteStatus
is ExitSuccess or ExitFailure 1. assertApprox rejects negative tolerance.
Explain why [] alone misses the bug and why passing all three is no proof.
Supplied PowerShell runner idea (explanation only, not another exercise):
  runghc -i<bundle> <bundle>/Main.hs
  $LASTEXITCODE
Main prints the predicted suite status while its real process exits 0;
a production runner must explicitly exitWith the predicted suiteStatus.
Do not claim that printed "ExitFailure 1" changes $LASTEXITCODE.

Entry: Main.hs. From the parent of this bundle, run:
  runghc -iCapstone_TestHarnessSuiteV3 Capstone_TestHarnessSuiteV3/Main.hs
Type-check the starter (do not execute its undefined functions):
  ghc -fno-code -iCapstone_TestHarnessSuiteV3 Capstone_TestHarnessSuiteV3/Main.hs
All module names equal their flat file names. Main is the application.
Tests holds pure checks; TestSupport reports labels and models exit status.
Only Main.hs is an entry; exclude deliberately broken examples from a runner.
The printed ExitCode is a model: Main prints diagnostics and exits normally.
A production runner can pass suiteStatus to exitWith. Passing finite checks
is evidence, not proof. No keyboard input or external fixtures are required.
-}

import Core
import TestSupport
import Tests

main :: IO ()
main = do
  print (adjust []) -- expected: []
  print (adjust [0]) -- expected: [3]
  putStrLn (runSuite checks) -- expected: PASS 3
  print (suiteStatus checks) -- expected: ExitSuccess
  putStrLn (runSuite mutantChecks) -- expected: FAIL singleton mixed
  print (suiteStatus mutantChecks) -- expected: ExitFailure 1
  putStrLn (runSuite (suiteFor (const []))) -- expected: FAIL singleton mixed
