/*eslint-disable*/
'use strict';

const config = require('config');
const knex = module.exports.Knex = require('knex')(config.get('sportKnex'));

const Bookshelf = require('bookshelf')(knex);
module.exports.Bookshelf = Bookshelf;

var Genotype = module.exports.Genotype = Bookshelf.Model.extend({
  tableName: 'genotype',

  phenoGenos() {
    return this.hasMany(PhenoGeno, 'genotype_id');
  },

  gene() {
    return this.belongsTo(Gene, 'gene_id');
  }
});

var Gene = module.exports.Gene = Bookshelf.Model.extend({
  tableName: 'gene'
});

var Phenotype = module.exports.Phenotype = Bookshelf.Model.extend({
  tableName: 'phenotype',

  genoRs() {
    return this.belongsToMany(Genotype).through(PhenoGeno, 'phenotype_id', 'genotype_id').query(qb => {
      qb.groupBy('rsid', 'phenotype_id');
    });
  },

  pubmeds() {
    return this.belongsToMany(Pubmed).through(PhenoRsPub, 'phenotype_id', 'pubmed_id').query(qb => {
      qb.groupBy('pubmed_id');
    });
  }
});

var PhenoGeno = module.exports.PhenoGeno = Bookshelf.Model.extend({
  tableName: 'phenotype_genotype'
});

var Pubmed = module.exports.Pubmed = Bookshelf.Model.extend({
  tableName: 'pubmed'
});

var PhenoRsPub = module.exports.PhenoRsPub = Bookshelf.Model.extend({
  tableName: 'phenotype_snp_pubmed'
});