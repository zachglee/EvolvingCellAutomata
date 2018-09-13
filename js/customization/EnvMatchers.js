// -------- E N V   M A T C H E R S -------- //

//An EnvrionmentMatcher is a: (Posn, World) -> Boolean
//Behaviorally they will be used to determine if something
//is true about a particular location in the World
//(For example, does a particular location have a Cell in it?)

var empty = function(posn, world, asker) {
	return world.get(posn) && !world.get(posn).content;
}

var object = function(posn, world, asker) {
	return !world.get(posn) || (world.get(posn).content && !world.get(posn).content.isCell)
}

var obstacle = function(posn, world, asker) {
	return world.get(posn) && world.get(posn).content && world.get(posn).content.isObstacle;
}

var marked = function(posn, world, asker) {
	return world.get(posn) && world.get(posn).content.marked;
}

var cell = function(posn, world, asker) {
	return world.get(posn) && world.get(posn).content && world.get(posn).content.isCell;
}

var corpse = function(posn, world, asker) {
	return cell(posn, world, asker) && world.get(posn).content.food < 0;
}

var selfCell = function(posn, world, asker) {
	return cell(posn, world, asker) && world.get(posn).content.color === asker.color;
}

var foreignCell = function(posn, world, asker) {
	return cell(posn, world, asker) && world.get(posn).content.color !== asker.color;
}

var any = function(posn, world, asker) {
	return true;
}

var food = function(posn, world, asker) {
	return world.get(posn) && !!world.get(posn).food
}

var fat = function(posn, world, asker) {
	return asker.food > REPRODUCE_COST;
}

const MATCHER_SPEC = {
	"empty": empty,
	"obstacle": obstacle,
	//"cell": cell,
	"food": food,
	"selfCell": selfCell,
	"foreignCell": foreignCell/*, fat*/
}