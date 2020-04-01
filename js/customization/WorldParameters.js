// -------- C O N S T A N T   P A R A M E T E R S -------- //

var WORLD_WIDTH = 200;
var WORLD_HEIGHT = 80;
var CELL_WIDTH = 6; //px
var CELL_HEIGHT = 6; //px
var CELL_GENOME_SIZE = 6;
var CELL_STARTING_FOOD = 100;
var STARTING_POPULATION = Math.floor((WORLD_WIDTH * WORLD_HEIGHT) / 10);
var STARTING_OBSTACLES = Math.floor((WORLD_WIDTH * WORLD_HEIGHT) / 400);
var OBSTACLE_LENGTH = Math.floor((WORLD_WIDTH * WORLD_HEIGHT) / 25);
var GENE_POOL_SIZE = 200;
var INITIAL_FOOD_SQUARES = Math.floor((WORLD_WIDTH * WORLD_HEIGHT) / 300);

// -------- V A R I A B L E   P A R A M E T E R S -------- //

//I might one day turn these into functions that take in a World, but for now they're constants

var MAX_CELL_FOOD = 200; // maximum amount of food a cell can store
var FOOD_SQUARES_PER_TICK = Math.floor((WORLD_WIDTH * WORLD_HEIGHT) / 3200); // number of squares to populate with food each tick
var FOOD_PER_SQUARE = 80; // amount of food to populate a square with once we have decided to put food on it
var DECOMPOSE_THRESHOLD = 50; // how many ticks a cell can go without food before decomposing into an Obstacle
var MUTATION_CHANCE = .10; // when reproducing, the chance to produce offspring with mutated genes
var MAX_FOOD_DIFFUSION_RATE = 5.0;
// ^^ when cells are adjacent to each other, food will diffuse from the cell with more food
// to the cell with less food, proportional to the food disparity, maxing out at this number
var INACTIVITY_REFUND = 1; //how much food to refund a cell if it has performs no behaviors in a tick