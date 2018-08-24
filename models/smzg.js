/*eslint-disable*/
'use strict';

const config = require('config');
const knex = module.exports.Knex = require('knex')(config.get('geneKnex'));

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
  },

  checkitems() {
    return this.belongsToMany(Checkitem).through(PhenoCheck, 'phenotype_id', 'item_id').query(qb => {
      qb.where('level', 1);
    });
  }

});

var PhenoGeno = module.exports.PhenoGeno = Bookshelf.Model.extend({
  tableName: 'phenotype_genotype',
  genotype() {
    return this.belongsTo(Genotype, 'genotype_id');
  }
});

var Pubmed = module.exports.Pubmed = Bookshelf.Model.extend({
  tableName: 'pubmed'
});

var PhenoRsPub = module.exports.PhenoRsPub = Bookshelf.Model.extend({
  tableName: 'phenotype_snp_pubmed'
});

var PhenoCheck = module.exports.PhenoCheck = Bookshelf.Model.extend({
  tableName: 'phenotype_checkitem',
  phenotype() {
    return this.belongsTo(Phenotype, 'phenotype_id');
  }
});

var Checkitem = module.exports.Checkitem = Bookshelf.Model.extend({
  tableName: 'checkitem',

  classify() {
    return this.belongsTo(CheckClassify, 'classify_id');
  }
});

var CheckClassify = module.exports.CheckClassify = Bookshelf.Model.extend({
  tableName: 'checkitem_classify'
});

var Vitamin = module.exports.Vitamin = Bookshelf.Model.extend({
  tableName: 'vitamin_info',
  phenotype() {
    return this.belongsTo(Phenotype, 'phenotype_id');
  }
});