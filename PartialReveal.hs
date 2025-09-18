#!/usr/bin/env cabal
{- cabal:
  build-depends: base, optparse-applicative
-}

{-|
Useful when you're using markdown slides (such as with maaslalani/slides) and
you want to partially reveal slides. Unfortunately the only way to do so is
duplicating the same slide multiple times but with progressively more content.
Instead of duplicating content in your hand-written source, feed it through
this script, which will duplicate the slide whenever it sees:

  <!-- pause -->

Give it an input file that looks like so:

  # Intro slide

  ---

  # Part 1
  Start here.

  <!-- pause -->

  # Part 2
  The second part.

  <!-- pause -->

  # Part 3
  The last part.

  ---

  # Next slide

You'll get back a presentation now with 5 slides.
-}

{-# LANGUAGE LambdaCase #-}

import Options.Applicative
import Control.Monad (join)

type Options = (String, String)
parseOptions :: Parser Options
parseOptions = (,)
  <$> argument str mempty
  <*> argument str mempty
opts :: ParserInfo Options
opts = info (parseOptions <**> helper) $ mconcat
  [ fullDesc
  , progDesc "Insert partial reveals to markdown slides"
  ]

main = do
  (inPath, outPath) <- execParser opts
  content <- readFile inPath
  writeFile outPath $ insertPartialReveals $ lines content

insertPartialReveals :: [String] -> String
insertPartialReveals = unlines . reverse . join . go [] []
  where
    go :: [[String]] -> [String] -> [String] -> [[String]]
    go emittedSlides slide = let
      x = undefined
      in \case
        (line:xs) | line == "---" -> go (slide : emittedSlides) [line] xs
        ("<!-- pause -->":xs) -> go (slide : emittedSlides) slide xs
        (line:xs) -> go emittedSlides (line:slide) xs
        [] -> slide : emittedSlides
