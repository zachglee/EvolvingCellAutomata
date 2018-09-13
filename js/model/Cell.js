//A Cell is a GameObject with a List of Genes that describe its behavior

//The cells are what will mutate and evolve over the course of the simulation
//They'll die if they run out of food. Every tick they will execute one gene --
//the first one they find whose AdjacencyEnvironment matches the current environment.

class Cell extends GameObject {
	constructor(food, marked, genes, birthtick, color) {
		super(food, marked)
		this.genes = genes;
		this.geneDeck = genes.slice(0, genes.length);
		this.color = color;
		//metadata
		this.isCell = true;
		this.birthtick = birthtick;
		this.age = 0;
		this.startTickingFromGene = 0; //maybe obsolete?
		this.decay = 0; //how long the cell has spent with food < 0
		this.maxFood = MAX_CELL_FOOD;
	}



	//performs the side effects that should occur this tick,
	//given this cell at the given posn, in the given world
	tick(posn, world) {
		if (this.age > 0) { //as long as this cell wasn't born this tick:
			if (this.food > -1) { //if this cell is not dead:
				this.food -= 1; //cells must spend 1 food per tick to survive
				//this.decay = 0;
			} else {
				this.decay += 1;
			}
			for (var i = 0; i < this.geneDeck.length; i++) {
				//once we find a gene that performs its behavior, tick it and remove it from the deck
				if (this.geneDeck[i].tick(this, posn, world)) {
					this.geneDeck.splice(i, 1)
					this.startTickingFromGene = i;
					return;
				}
				//tick genes until we find one that performs its behavior. Stop once we do that one
				/*if (this.genes[i].tick(this, posn, world)) {
					//this.startTickingFromGene += 1; //or I make it jump to the last gene ticked
					this.startTickingFromGene = i+1;
					return;
				}*/
			}
			//if we get through all the genes, without finding one that works, delete the first gene. If we run out of genes, reset the gene deck
			if (this.geneDeck.length == 0) {
				this.geneDeck = this.genes.slice(0, this.genes.length)
				this.startTickingFromGene = 0;
			} else {
				this.geneDeck.splice(0, 1)
				this.food += .8;
			}
		}
		if (this.food > this.maxFood) {
			this.food = this.maxFood;
		}
		this.age += 1;
	}

	genMutantGenes() {
		var mutantGenes = this.genes.slice(0, this.genes.length) //get a copy of the genes so we don't mutate the old ones
		//if (Math.random() < .5) {
			var genesToRemove = Math.floor(Math.random() * Math.ceil(CELL_GENOME_SIZE / 6)) + 1; //decide how many to remove
			var genesToAdd = Math.floor(Math.random() * Math.ceil(CELL_GENOME_SIZE / 6)) + 1; //decide how many to add*/
			for (var g = 0; g < genesToRemove; g++) {
				mutantGenes.splice(Math.floor(Math.random() * mutantGenes.length), 1);
			}
			for (var g = 0; g < genesToRemove; g++) {
				mutantGenes.splice(Math.floor(Math.random() * mutantGenes.length), 0, genGene());
			}
			/*var genesToChange = Math.floor(Math.random() * 4) + 1;
			for (var g = 0; g < genesToChange; g++) {
				mutantGenes.splice(Math.floor(Math.random() * mutantGenes.length), 1, genGene());
			}*/
		//}
		shuffle(mutantGenes);
		return mutantGenes;
	}

	//() -> Cell
	//returns a cell (with a possibly mutated genome) that is a copy of this cell, with the given amount of food
	newChild(food) {
		var isMutant = Math.random() < MUTATION_CHANCE;
		var newGenes;
		if (isMutant && this.genes.length > 3) {
			newGenes = this.genMutantGenes();
		} else {
			newGenes = this.genes.slice(0, this.genes.length);
		}
		return new Cell(food, this.marked, newGenes, this.birthtick + this.age, genomeToColor(newGenes));
	}

	drawAt(posn, world, ctx) {
		var canvasPosn = posn.toCanvasPosn(world);
		ctx.fillStyle = this.color;
		ctx.fillRect(canvasPosn.x, canvasPosn.y, squareWidth(world), squareHeight(world));
	}
}