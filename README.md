# Evolving Cellular Automata

Visual in-browswer simulation of digital organisms based on Cellular Automata evolving in varied environments.

## Overview

The simulation is run on a rectangular grid of squares on which organisms move and interact with their environment. There are only a few defined actions which organisms can take (reproduction, movement, etc.) and, like Cellular Automata, each organism has a set of rules that dictate in which situations it will execute certain actions. It is these rules, or 'genes' which are subject to mutation when organisms reproduce.

Organims die when they spend long enough without food. Food is a resource that enters the world periodically, and may be distributed according to some function. (Perhaps spawning around particular areas of the World, or completely randomly, or increasing and decreasing in some kind of day/night cycle.)

## Design

The `World` is the top-level object, which contains the grid of `Squares`, which can in turn contain `Cells` or `Obstacles`. `Cells` possess `Genes`. All `Genes` have `Behaviors` they can execute under certain circumstances, thereby allowing `Cells` to interact with the `World`. Those 'certain circumstances' are determined by the `Gene`'s `Matchers`, which check if certain things are true about a `Cell`'s environment.

The design of the model restricts knowledge about the position of objects to the top level `World` layer. (It's the only one that has the grid of `Squares`) So none of the component objects know anything about their own positions. This decision, while it means I have to pass the World object to any function that wants to modify a position, allows me to have a single point of truth for position. It also allows component objects to exist independent of their position.

### World and Main Loop

The World has the grid of `Squares` (in a 2d array) and an `int` tickNum field to track what tick we're on. The `World` measures time in ticks, where each tick is a discrete simulation step. The World has a `tick()` function, and a `draw()` function, which together form the main update/render flow of the program. The main loop in `index.html` calls these two functions every frame.

### The Gene System

This is one of the non-obvious parts of the application. 

### A Few Convenience Data Definitions
* A Direction is a natural number `[0-3]` which represents one of the 4 directions. `[0=up, 1=right, 2=down, 3=left]`
* A Position is a `{x:int, y:int}` representing a coordinate on a grid of squares.
* An Environment is the set of 4 Squares immediately adjacent to any given Cell. `[UpSquare, RightSquare, DownSquare, LeftSquare]`

### Square
A Square is a `{food:int, content:[Cell,Obstacle]}`. Every square can have any positive amount of food on it, and its content can be null/undefined or can be a Cell or Obstacle.

### Obstacle
An Obstacle has no special functionality. It just exists to be of type Obstacle, so that other code can react to it being an Obstacle.

### Cell
A Cell has a list of Genes, an amount of food (int) it has, and then a bunch of bookkeeping data like its age, decay (how many ticks it's spent without food<0), color, and maxFood. (The maximum amount of food the cell can hold.)