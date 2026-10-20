-- Title: Report grade-book rows with a 40-mark pass boundary
{-
QUESTION
(20 marks) Implement Model, Core, Report, TestSupport and Tests.
Use Student String [Int]. average returns Nothing for [] or a mark outside
0..100. outcome returns invalid, missing, distinction (mean >= 70),
pass (mean >= 40), or fail, in that order. summary prefixes the name and
": ". summaries keeps every row; passNames uses a constructor-pattern
comprehension and preserves duplicate names. classAverage rejects the whole
class on any invalid mark; otherwise omit students with no marks and average
the remaining student means, returning Nothing if there are none.
Implement every exported signature and the six independent Tests checks.
Also explain why keeping duplicate rows is a reporting policy, not a claim
that duplicate names uniquely identify people. Contrast classAverage with
pooling all marks on the unequal fixture. (Written diagnostic: 4 marks.)

Entry: Main.hs. From the parent of this bundle, run:
  runghc -iCapstone_GradeBookSummaryV3 Capstone_GradeBookSummaryV3/Main.hs
Type-check the starter (do not execute its undefined functions):
  ghc -fno-code -iCapstone_GradeBookSummaryV3 Capstone_GradeBookSummaryV3/Main.hs
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
  print (summaries []) -- expected: []
  print (summaries [Student "A" [40], Student "A" [], Student "B" [101]]) -- expected: ["A: pass","A: missing","B: invalid"]
  print (passNames [Student "A" [40], Student "A" [70], Student "B" [39]]) -- expected: ["A","A"]
  print (classAverage [Student "A" [], Student "B" [100]]) -- expected: Just 100.0
  print (classAverage [Student "A" [100], Student "B" [101]]) -- expected: Nothing
  putStrLn (runSuite checks) -- expected: PASS 6
  print (suiteStatus checks) -- expected: ExitSuccess
