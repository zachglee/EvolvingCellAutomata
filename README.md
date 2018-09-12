# Evolving Cellular Automata

Visual in-browswer simulation of digital organisms based on Cellular Automata evolving in varied environments.

## Overview

The simulation is run on a rectangular grid of squares on which organisms move and interact with their environment. There are only a few defined actions which organisms can take (reproduction, movement, etc.) and, like Cellular Automata, each organism has a set of rules that dictate in which situations it will execute certain actions. It is these rules, or 'genes' which are subject to mutation when organisms reproduce.

Organims die when they spend long enough without food. Food is a resource that enters the world periodically, and may be distributed according to some function. (Perhaps spawning around particular areas of the World, or completely randomly, or increasing and decreasing in some kind of day/night cycle.)

## Design

The `World` is the top-level object, which contains the grid of `Squares`, which can in turn contain `Cells` or `Obstacles`. `Cells` possess `Genes`. All `Genes` have `Behaviors` they can execute under certain circumstances, thereby allowing `Cells` to interact with the `World`. Those 'certain circumstances' are determined by the `Gene`'s `Matchers`, which check if certain things are true about a `Cell`'s environment.

The design of the model restricts knowledge about the position of objects to the top level `World` layer. (It's the only one that has the grid of `Squares`) So none of the component objects know anything about their own positions. This decision, while it means I have to pass the World object to any function that wants to modify a position, allows me to have a single point of truth for position. It also allows component objects to exist independent of their position.

### World and Main Loop

The `World` has the grid of `Squares` (in a 2d array) and an `int` tickNum field to track what tick we're on. The `World` measures time in ticks, where each tick is a discrete simulation step. The World has a `tick()` function, and a `draw()` function, which together form the main update/render flow of the program. The main loop in `index.html` calls these two functions every frame.

### Gene Overview

This is one of the more complex parts of the application. I will explain with an example of a gene. Lets say we have a gene, named **RunAway**.

This gene's data is set up to make its cell `Move` in the `Down` direction when the following criteria are met:
* `The Square in the Up direction contains a Cell`
* `The Square in the Right direction contains Anything (which includes being Empty)`
* `The Square in the Down direction is Empty`
* `The Square in the Left direction contains Anything`

These three parts: the `Action` to take, the `Direction` to take it in, and the criteria under which to perform it, are the three parts of the gene. Here they are formalized:
* `direction`: An integer `[0-3]`, which corresponds to one of the directions `[Up=0, Right=1, Down=2, Left=3]`. Describes which adjacent `Square` will be the target of the `Action`.
* `action`: One of several pre-defined functions, which the designer has implemented and made available to the genes. (At the time of this writing, they are `Reproduce`, `Move`, `Transfer`, `Dig`, `Eat`) `Actions` are functions which have the signature: `(cellPosn, targetPosn, world) -> Side Effect of The Action, done by the cell, on the target`
* `matchers`: A set of 4 `Matchers` which are used to check the 4 adjacent `Squares` for certain criteria. A `Matcher` is just a function with the signature: `(posn, world, asker) -> Boolean`. They say if a particular thing is true of the given posn in the given world if the asker cell is asking. In our example, the first `Matcher` we had in our set of four returned `true` if the `Square` at the given posn contained a `Cell`. Similar to `Actions`, a set of `Matchers` are implemented by the designer and those are the only ones that are available to `Genes`.

Together the `Action` and `Direction` form a `Behavior`. (I wrapped those two up in this `Behavior` type to make things a bit more modular.)

So our example gene would look like this:

```
{
  name: "RunAway",
  behavior: {
             direction: 2, //recall 2 refers to Down
             action: Move
            }
  matchers: [Cell, Any, Empty, Any]
}
```

So what I said about the gene's `Behavior` is true, but it actually will perform its `Behavior` in more than just that case. For example it will also perform its `Behavior` under the following circumstances:

* `The Square in the Up direction contains Anything`
* `The Square in the Right direction a Cell`
* `The Square in the Down direction contains Anything`
* `The Square in the Left direction is Empty`

See the difference? It's the same set of `Matchers` as before, just rotated 90 degrees clockwise. Any rotation of a set of `Matchers` like this is called an `Isomorphism`. And the rule for when a gene executes its `Behavior` is: when its Matchers OR ANY ISOMORPHISM of its Matchers matches the adjacent squares. In the case that an `Isomorphism` matched, the `Direction` of the `Behavior` will be rotated accordingly. So in our example here, we would actually `Move` `Left` if this `Isomorphism` was what matched.

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