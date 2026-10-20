module SignalCore (Signal(Go), stop, go, code) where

data Signal = Stop | Go

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.
-- Exporting the type name and exporting its constructors are separate decisions.

stop :: Signal
stop = Stop

go :: Signal
go = Go

code :: Signal -> Int
code Stop = -1
code Go = 1
