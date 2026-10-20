module StackCore (Stack, empty, push, pop, peek, size) where

newtype Stack a = Stack [a]

empty :: Stack a
empty = undefined -- Your answer here

push :: a -> Stack a -> Stack a
push = undefined -- Your answer here

pop :: Stack a -> Maybe (a, Stack a)
pop = undefined -- Your answer here

peek :: Stack a -> Maybe a
peek = undefined -- Your answer here

size :: Stack a -> Int
size = undefined -- Your answer here
