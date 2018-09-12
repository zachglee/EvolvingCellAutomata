//A CellStats is an object that keeps track of certain stats about a population of cells,
//specifically those that only change when a cell is born or when a cell dies.
//Currently, this includes:
// - A count of the frequency of each uniquely named gene
// - A count of the frequency of all genes that contain a particular action
// - A count of the frequency of each color of cell

class CellStats {
	constructor() {
		this.geneCountsByName = {};
		this.geneCountsByAction = {};
		this.cellPopulationsByColor = {};
		//do I also want to keep track of percentage that are of each action?
	}

	//updates all stats this object keeps track of, given that the given cell was just born
	cellBorn(cell) {
		//update the cell populations by color
		if (this.cellPopulationsByColor[cell.color]) {
			this.cellPopulationsByColor[cell.color] += 1;
		} else {
			this.cellPopulationsByColor[cell.color] = 1;
		}
		//for every gene in the cell:
		for (var i = 0; i < cell.genes.length; i++) {
			var gene = cell.genes[i];
			//update the gene counts by name
			if (this.geneCountsByName[gene.name]) {
				this.geneCountsByName[gene.name] += 1;
			} else {
				this.geneCountsByName[gene.name] = 1;
			}
			//update the gene counts by action
			if (this.geneCountsByAction[gene.behavior.actionName]) {
				this.geneCountsByAction[gene.behavior.actionName] += 1;
			} else {
				this.geneCountsByAction[gene.behavior.actionName] = 1;
			}
		}
	}

	//updates all the stats this object keeps track of, given that the given cell just died
	cellDied(cell) {
		//update the cell populations by color
		if (this.cellPopulationsByColor[cell.color] > 0) { //note: undefined > 0 evaluates to false
			this.cellPopulationsByColor[cell.color] -= 1;
		} else {
			console.log("Something went wrong, cannot reduce a population that is nonexistent/zero")
		}
		//for every gene in the cell:
		for (var i = 0; i < cell.genes.length; i++) {
			var gene = cell.genes[i];
			//update the gene counts by name
			if (this.geneCountsByName[gene.name] > 0) {
				this.geneCountsByName[gene.name] -= 1;
			} else {
				console.log("Something went wrong, cannot reduce a geneCount that is nonexistent/zero")
			}
			//update the gene counts by action
			if (this.geneCountsByAction[gene.behavior.actionName] > 0) {
				this.geneCountsByAction[gene.behavior.actionName] -= 1;
			} else {
				console.log("Something went wrong, cannot reduce a geneCount that is nonexistent/zero")
			}
		}
	}
}