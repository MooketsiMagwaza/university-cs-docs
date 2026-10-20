module Client (choose, report) where

import SignalCore (Signal, stop, go, code)

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.
-- Import Signal explicitly because choose names the type in its signature.

choose :: Bool -> Signal
choose False = stop
choose True = go

report :: [Bool] -> [Int]
report = map (code . choose)
