-- Title: Validate a roster using exact names
{-
QUESTION
(18 marks) Implement Model, Core, Report, TestSupport and Tests.
Marks must lie in 0..100. Missing marks and an empty roster are valid.
A name containing only whitespace is invalid. Name keys use exact names.
key implements that policy; validate returns the ORIGINAL roster on success.
Check all empty names first, then all invalid marks, then duplicate keys;
return Left "empty name", Left "invalid mark", or Left "duplicate name".
rosterReport returns "ERROR: " plus the error or "OK: n students".
Do not merge rows, alter stored names or drop invalid data. Explain why
nub-based duplicate detection can take quadratic equality comparisons.

Entry: Main.hs. From the parent of this bundle, run:
  runghc -iCapstone_ValidationRoster Capstone_ValidationRoster/Main.hs
Type-check the starter (do not execute its undefined functions):
  ghc -fno-code -iCapstone_ValidationRoster Capstone_ValidationRoster/Main.hs
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
  putStrLn (rosterReport []) -- expected: OK: 0 students
  putStrLn (rosterReport [Student "A" [0,100]]) -- expected: OK: 1 students
  putStrLn (rosterReport [Student "A" [], Student "A" []]) -- expected: ERROR: duplicate name
  putStrLn (rosterReport [Student "Ada" [], Student "ada" []]) -- expected: OK: 2 students
  putStrLn (rosterReport [Student " " [-1]]) -- expected: ERROR: empty name
  putStrLn (rosterReport [Student "A" [101]]) -- expected: ERROR: invalid mark
  putStrLn (runSuite checks) -- expected: PASS 5
