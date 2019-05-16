// -------- C O N S T A N T   P A R A M E T E R S -------- //

var WORLD_WIDTH = 200;
var WORLD_HEIGHT = 80;
var CELL_WIDTH = 6; //px
var CELL_HEIGHT = 6; //px
var CELL_GENOME_SIZE = 10;
var CELL_STARTING_FOOD = 100;
var STARTING_POPULATION = Math.floor((WORLD_WIDTH * WORLD_HEIGHT) / 10);
var STARTING_OBSTACLES = Math.floor((WORLD_WIDTH * WORLD_HEIGHT) / 400);
var OBSTACLE_LENGTH = Math.floor((WORLD_WIDTH * WORLD_HEIGHT) / 25);
var GENE_POOL_SIZE = 200;
var INITIAL_FOOD_SQUARES = Math.floor((WORLD_WIDTH * WORLD_HEIGHT) / 300);

// -------- V A R I A B L E   P A R A M E T E R S -------- //

//I might one day turn these into functions that take in a World, but for now they're constants

var MAX_CELL_FOOD = 150;
var FOOD_SQUARES_PER_TICK = Math.floor((WORLD_WIDTH * WORLD_HEIGHT) / 400);
var FOOD_PER_SQUARE = 10;
var DECOMPOSE_THRESHOLD = 100;
var MUTATION_CHANCE = .15;
var MAX_FOOD_DIFFUSION_RATE = 3.0;
var INACTIVITY_REFUND = 1; //how much food to refund a cell if it has performs no behaviors in a tick