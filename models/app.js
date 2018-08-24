/*eslint-disable*/
'use strict';

const config = require('config');
const knex = module.exports.Knex = require('knex')(config.get('knex'));

const Bookshelf = require('bookshelf')(knex);
Bookshelf.plugin('pagination');
module.exports.Bookshelf = Bookshelf;

var UserRole = module.exports.UserRole = Bookshelf.Model.extend({
  tableName: 'gene_user_role'
});

var Product = module.exports.Product = Bookshelf.Model.extend({
  tableName: 'gene_product'
});

var TopChannel = module.exports.TopChannel = Bookshelf.Model.extend({
  tableName: 'gene_top_channel',

});

var SecChannel = module.exports.SecChannel = Bookshelf.Model.extend({
  tableName: 'gene_sec_channel',

  top_channel() {
    return this.belongsTo(TopChannel, 'top_channel_id');
  }
});

var Batch = module.exports.Batch = Bookshelf.Model.extend({
  tableName: 'gene_batch_bar_code',

  samples() {
    return this.hasMany(Sample, 'batch_id');
  },
  product() {
    return this.belongsTo(Product, 'product_id');
  },
  goods() {
    return this.belongsTo(Product, 'goods_id');
  },
  top_channel() {
    return this.belongsTo(TopChannel, 'top_channel_id');
  },
  sec_channel() {
    return this.belongsTo(SecChannel, 'sec_channel_id');
  }
});

var SampleOwner = module.exports.SampleOwner = Bookshelf.Model.extend({
  tableName: 'gene_sample_owner'
});

var Sample = module.exports.Sample = Bookshelf.Model.extend({
  tableName: 'gene_sample',

  batch() {
    return this.belongsTo(Batch, 'batch_id');
  },

  product() {
    return this.belongsTo(Product, 'product_id');
  },

  owner() {
    return this.belongsTo(SampleOwner, 'owner_id');
  },

  report() {
    return this.hasOne(Report, 'sample_id');
  },

  suit() {
    return this.belongsTo(Suit, 'suit_id');
  },
  goodsInfo() {
    return this.belongsTo(Product, 'goods_id');
  },
  goods() {
    return this.belongsTo(Product, 'goods_id').through(Suit, 'suit_id');
  },

  target() {
    return this.belongsTo(Target, 'target_id').through(Suit, 'suit_id');
  }
});

var Report = module.exports.Report = Bookshelf.Model.extend({
  tableName: 'gene_report',

  sample() {
    return this.belongsTo(Sample, 'sample_id');
  },

  product() {
    return this.belongsTo(Product, 'product_id').through(Sample, 'sample_id');
  },

  checker() {
    return this.belongsTo(SampleOwner, 'owner_id').through(Sample, 'sample_id');
  },

  subReports() {
    return this.hasMany(SubReport, 'report_id');
  }
});

var SubReport = module.exports.SubReport = Bookshelf.Model.extend({
  tableName: 'gene_sub_report',

  sample() {
    return this.belongsTo(Sample, 'sample_id');
  },

  product() {
    return this.belongsTo(Product, 'product_id');
  },

  checker() {
    return this.belongsTo(SampleOwner, 'owner_id').through(Sample, 'sample_id');
  }
});

module.exports.ReportCase = Bookshelf.Model.extend({
  tableName: 'gene_report_case',

  product() {
    return this.belongsTo(Product, 'product_id');
  }
});

var Target = module.exports.Target = Bookshelf.Model.extend({
  tableName: 'gene_target',

  caller() {
    return this.belongsTo(ApiCaller, 'caller_id');
  }
});

var Goods = module.exports.Goods = Bookshelf.Model.extend({
  tableName: 'gene_product'
});

var Suit = module.exports.Suit = Bookshelf.Model.extend({
  tableName: 'gene_suit',

  goods() {
    return this.belongsTo(Product, 'goods_id');
  },

  samples() {
    return this.hasMany(Sample, 'suit_id');
  },

  target() {
    return this.belongsTo(Target, 'target_id');
  },

  order() {
    return this.hasOne(Order, 'suit_id');
  }
});

var Order = module.exports.Order = Bookshelf.Model.extend({
  tableName: 'gene_order',

  goods() {
    return this.belongsTo(Product, 'goods_id');
  },

  suit() {
    return this.belongsTo(Suit, 'suit_id');
  },

  secChannel() {
    return this.belongsTo(SecChannel, 'sec_channel_id')
  }
});

module.exports.CorpOrder = Bookshelf.Model.extend({
  tableName: 'gene_corp_order'
});

var ApiCaller = module.exports.ApiCaller = Bookshelf.Model.extend({
  tableName: 'gene_api_caller'
});

var GenoScore = module.exports.GenotypeScore = Bookshelf.Model.extend({
  tableName: 'gene_slim_genoscore'
});

var GeneSlimDistribution = module.exports.GeneSlimDistribution = Bookshelf.Model.extend({
  tableName: 'gene_slim_distribution'
});

var Genotype = module.exports.Genotype = Bookshelf.Model.extend({
  tableName: 'gene_genotype',

  score() {
    return this.hasOne(GenoScore, 'genotype_id');
  }
});


var UserSecChannel = module.exports.UserSecChannel = Bookshelf.Model.extend({
  tableName: 'gene_user_sec_channel',
});


/**
 * 优惠券（码）规则
 */
var CouponRule = module.exports.CouponRule = Bookshelf.Model.extend({
  tableName: 'gene_coupon_rule'
});

/**
 * 优惠券（码）
 */
var Coupon = module.exports.Coupon = Bookshelf.Model.extend({
  tableName: 'gene_coupon',

  rule() {
    return this.belongsTo(CouponRule, 'rule_id');
  }
});

var Permission = module.exports.Permission = Bookshelf.Model.extend({
  tableName: 'gene_permission'
});

var RolePermission = module.exports.RolePermission = Bookshelf.Model.extend({
  tableName: 'gene_role_permission'
});

/**
 * 基因样本检测位点结果
 */
var ResultSnp = module.exports.ResultSnp = Bookshelf.Model.extend({
  tableName: 'gene_result_snp',

  sample() {
    return this.belongsTo(Sample, 'sample_id');
  },

  owner() {
    return this.belongsTo(SampleOwner, 'owner_id');
  }
});

/**
 * 基因样本检测突变结果
 */
var ResultGene = module.exports.ResultGene = Bookshelf.Model.extend({
  tableName: 'gene_result_gene',

  sample() {
    return this.belongsTo(Sample, 'sample_id');
  },

  owner() {
    return this.belongsTo(SampleOwner, 'owner_id');
  }
});

/**
 * 基因样本检测表型结果
 */
var ResultPhenotype = module.exports.ResultPhenotype = Bookshelf.Model.extend({
  tableName: 'gene_result_phenotype',

  sample() {
    return this.belongsTo(Sample, 'sample_id');
  },

  owner() {
    return this.belongsTo(SampleOwner, 'owner_id');
  }
});

/**
 * 基因报告生成规则定义
 */
var ReportRule = module.exports.ReportRule = Bookshelf.Model.extend({
  tableName: 'gene_report_rule'
});

/*
 * 问卷调查
 */
var Question = module.exports.Question = Bookshelf.Model.extend({
  tableName: 'gene_question',
  answers() {
    return this.hasMany(Answer, 'question_id');
  },
});

var Answer = module.exports.Answer = Bookshelf.Model.extend({
  tableName: 'gene_answer',
  answers() {
    return this.hasMany(AnswerPheno, 'answer_id');
  },
});

var AnswerPheno = module.exports.AnswerPheno = Bookshelf.Model.extend({
  tableName: 'gene_answer_pheno'
});

var QuestionResult = module.exports.QuestionResult = Bookshelf.Model.extend({
  tableName: 'gene_question_result'
});