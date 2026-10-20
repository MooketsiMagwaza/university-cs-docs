module TestSupport (assertEqual, assertTrue, assertApprox, runSuite, suiteStatus) where

import System.Exit (ExitCode(..))

assertEqual :: Eq a => String -> a -> a -> (String, Bool)
assertEqual = undefined -- Your answer here

assertTrue :: String -> Bool -> (String, Bool)
assertTrue = undefined -- Your answer here

assertApprox :: String -> Double -> Double -> Double -> (String, Bool)
assertApprox = undefined -- Your answer here

runSuite :: [(String, Bool)] -> String
runSuite = undefined -- Your answer here

suiteStatus :: [(String, Bool)] -> ExitCode
suiteStatus = undefined -- Your answer here
