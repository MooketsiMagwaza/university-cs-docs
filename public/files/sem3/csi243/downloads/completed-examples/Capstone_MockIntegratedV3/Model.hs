module Model (Sensor(..)) where

data Sensor = Sensor String [Int] deriving (Eq, Show)
