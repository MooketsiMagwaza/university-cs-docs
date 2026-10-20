module StackCore (Stack, empty, push, pop, peek, size) where

newtype Stack a = Stack [a]

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.
-- The list head is the top. Clients cannot forge or inspect Stack directly.

empty :: Stack a
empty = Stack []

push :: a -> Stack a -> Stack a
push x (Stack xs) = Stack (x : xs)

pop :: Stack a -> Maybe (a, Stack a)
pop (Stack []) = Nothing
pop (Stack (x:xs)) = Just (x, Stack xs)

peek :: Stack a -> Maybe a
peek (Stack []) = Nothing
peek (Stack (x:_)) = Just x

size :: Stack a -> Int
size (Stack xs) = length xs
