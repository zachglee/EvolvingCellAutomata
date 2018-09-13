// -------- C O N S T A N T   P A R A M E T E R S -------- //

var WORLD_WIDTH = 200;
var WORLD_HEIGHT = 80;
var CELL_GENOME_SIZE = 10;
var CELL_STARTING_FOOD = 100;
var STARTING_POPULATION = Math.floor((WORLD_WIDTH * WORLD_HEIGHT) / 10);
var STARTING_OBSTACLES = Math.floor((WORLD_WIDTH * WORLD_HEIGHT) / 300);
var OBSTACLE_LENGTH = Math.floor((WORLD_WIDTH * WORLD_HEIGHT) / 100);
var GENE_POOL_SIZE = 200;
var INITIAL_FOOD_SQUARES = Math.floor((WORLD_WIDTH * WORLD_HEIGHT) / 250);

// -------- V A R I A B L E   P A R A M E T E R S -------- //

//I might one day turn these into functions that take in a World, but for now they're constants

var MAX_CELL_FOOD = 150;
var FOOD_SQUARES_PER_TICK = Math.floor((WORLD_WIDTH * WORLD_HEIGHT) / 300);
var FOOD_PER_SQUARE = 10;
var DECOMPOSE_THRESHOLD = 100;
var MUTATION_CHANCE = .10