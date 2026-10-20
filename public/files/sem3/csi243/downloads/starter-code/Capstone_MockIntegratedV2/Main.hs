-- Title: Complete an independent modular practical for parcel deliveries
{-
QUESTION
Timed mock (35 minutes, 24 marks): implement Model, Core, Report,
TestSupport and Tests for parcel deliveries. The constructor is
Parcel String [Int]. All observations must be nonnegative. average returns
Nothing for empty/invalid data. outcome distinguishes invalid, missing,
high (mean >= 3), and low. summary is name ++ ": " ++ outcome.
highNames uses a constructor-pattern comprehension, keeping duplicate names.
classAverage rejects the class on any invalid observation, otherwise skips
missing items and averages the item means, not all pooled observations.
countedTotal returns (sum, number of cons cells visited) by one recursion.
Implement the assertion/report/status contracts from the exported signatures:
equality, Boolean verdict, nonnegative absolute tolerance, "PASS n" or
"FAIL " plus failed labels, and ExitSuccess or ExitFailure 1.
Mark scheme: model/exports 2; safe mean 3; outcomes 3; reporting 3;
class mean 4; counted recursion 3; independent tests/harness 4; diagnostic 2.
Written diagnostic: compare one traversal with two separate full traversals
under a one-visit-per-cons model (n versus 2n, both linear). Explain why this
is not an exact allocation or wall-clock claim. Repair a division-by-zero
mean and explain why empty groups cannot be assigned an invented zero.

Entry: Main.hs. From the parent of this bundle, run:
  runghc -iCapstone_MockIntegratedV2 Capstone_MockIntegratedV2/Main.hs
Type-check the starter (do not execute its undefined functions):
  ghc -fno-code -iCapstone_MockIntegratedV2 Capstone_MockIntegratedV2/Main.hs
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
  putStrLn (summary (Parcel "A" [])) -- expected: A: missing
  putStrLn (summary (Parcel "B" [-1])) -- expected: B: invalid
  putStrLn (summary (Parcel "C" [3])) -- expected: C: high
  putStrLn (summary (Parcel "D" [2])) -- expected: D: low
  print (classAverage []) -- expected: Nothing
  print (classAverage [Parcel "A" [20], Parcel "B" [0,20]]) -- expected: Just 15.0
  print (highNames [Parcel "A" [3], Parcel "A" [4]]) -- expected: ["A","A"]
  print (countedTotal []) -- expected: (0,0)
  putStrLn (runSuite checks) -- expected: PASS 5
