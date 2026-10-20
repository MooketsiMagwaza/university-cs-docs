-- Title: Classify a modular grade book at 60 and 80
{-
QUESTION
(20 marks) Implement Model, Core, Report, TestSupport and Tests.
Use Student String [Int]. average returns Nothing for [] or a mark outside
0..100. outcome returns invalid, missing, distinction (mean >= 80),
pass (mean >= 60), or fail, in that order. summary prefixes the name and
": ". summaries keeps every row; passNames uses a constructor-pattern
comprehension and preserves duplicate names. classAverage rejects the whole
class on any invalid mark; otherwise omit students with no marks and average
the remaining student means, returning Nothing if there are none.
Implement every exported signature and the six independent Tests checks.

Entry: Main.hs. From the parent of this bundle, run:
  runghc -iCapstone_GradeBookOutcomesV2 Capstone_GradeBookOutcomesV2/Main.hs
Type-check the starter (do not execute its undefined functions):
  ghc -fno-code -iCapstone_GradeBookOutcomesV2 Capstone_GradeBookOutcomesV2/Main.hs
All module names equal their flat file names. Main is the application.
Tests holds pure checks; TestSupport reports labels and models exit status.
Only Main.hs is an entry; exclude deliberately broken examples from a runner.
The printed ExitCode is a model: Main prints diagnostics and exits normally.
A production runner can pass suiteStatus to exitWith. Passing finite checks
is evidence, not proof. No keyboard input or external fixtures are required.
-}

import Model
import Core
import Report
import TestSupport
import Tests

main :: IO ()
main = do
  print (average []) -- expected: Nothing
  putStrLn (outcome (Student "Ada" [60])) -- expected: pass
  putStrLn (outcome (Student "Ada" [80])) -- expected: distinction
  putStrLn (outcome (Student "Ada" [59])) -- expected: fail
  putStrLn (summary (Student "Bo" [])) -- expected: Bo: missing
  putStrLn (summary (Student "Cy" [101])) -- expected: Cy: invalid
  print (classAverage [Student "A" [100], Student "B" [0,100]]) -- expected: Just 75.0
  print (classAverage []) -- expected: Nothing
  putStrLn (runSuite checks) -- expected: PASS 6
