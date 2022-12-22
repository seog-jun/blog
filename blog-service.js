const Sequelize = require("sequelize");
const env = require("dotenv");
env.config();

var sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

var Post = sequelize.define("Post", {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
});

var Category = sequelize.define("Category", {
  category: Sequelize.STRING,
});
Post.belongsTo(Category, { foreignKey: "category" });

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("Unable to sync the database!!!");
      });
  });
};

module.exports.getAllPosts = function () {
  return new Promise((resolve, reject) => {
    Post.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("No results returned");
      });
  });
};

module.exports.getPostsByCategory = function (category) {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { category: category } })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("No results returned");
      });
  });
};

module.exports.getPostsByMinDate = function (minDateStr) {
  return new Promise((resolve, reject) => {
    const { gte } = Sequelize.Op;
    Post.findAll({
      where: {
        postDate: {
          [gte]: new Date(minDateStr),
        },
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("No results returned");
      });
  });
};

module.exports.getPostById = function (id) {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { id: id } })
      .then((data) => {
        resolve(data[0]);
      })
      .catch(() => {
        reject("No results returned");
      });
  });
};

module.exports.addPost = function (postData) {
  return new Promise((resolve, reject) => {
    for (let x in postData) {
      postData[x] = postData[x] == "" ? null : postData[x];
    }
    postData.published = postData.published ? true : false;
    postData.postDate = new Date();

    Post.create(postData)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("Unable to create post");
      });
  });
};

module.exports.getPublishedPosts = function () {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { published: true } })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("No results returned");
      });
  });
};

module.exports.getPublishedPostsByCategory = function (category) {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        published: true,
        category: category,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("No results returned");
      });
  });
};

module.exports.getCategories = function () {
  return new Promise((resolve, reject) => {
    Category.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("No results returned");
      });
  });
};

module.exports.addCategory = function (categoryData) {
  return new Promise((resolve, reject) => {
    for (let x in categoryData) {
      categoryData[x] = categoryData[x] == "" ? null : categoryData[x];
    }

    Category.create(categoryData)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("Unable to create category");
      });
  });
};

module.exports.deleteCategoryById = function (id) {
  return new Promise((resolve, reject) => {
    Category.destroy({
      where: { id: id },
    })
      .then(() => {
        console.log("Category deleted");
        resolve();
      })
      .catch(() => {
        console.log("Category delete error");
        reject();
      });
  });
};

module.exports.deletePostById = function (id) {
  return new Promise((resolve, reject) => {
    Post.destroy({
      where: { id: id },
    })
      .then(() => {
        console.log("Post deleted");
        resolve();
      })
      .catch(() => {
        console.log("Post delete error");
        reject();
      });
  });
};
