const dotenv = require('dotenv')
const mongoose = require('mongoose')
const { default: Post } = require('./dist/models/posts')
const { faker } = require('@faker-js/faker')

const data_length = 10
const max_lengths = {
  title: 30,
  description: 200,
  tags: 10,
}

const tag_options = [
  "react", "mongodb", "luffy", "ace", "zoro", "monkey", "express", "mern", "mera mera", "borther", "cook", "hook", "node.js"
]
const author_id_list = [
  "659dad936f3d374d5f581941",
  "659dad326f3d374d5f58193b",
  "659dacd96f3d374d5f581935",
  "659da4ef29f5d4b279befaf8",
]

dotenv.config();

const fake_data = []

for (let i = 0; i < data_length; i++) {
  let fake_tags = []
  for (let i = 0; i < randInt(5); i++) {
    fake_tags.push(tag_options[randInt(tag_options.length)].slice(0, 10))
  }

  fake_data.push({
    author_id: author_id_list[randInt(author_id_list.length)],
    description: faker.lorem.sentences(5).slice(0, 200),
    tags: fake_tags,
    title: faker.lorem.sentence({
      max: 10,
      min: 1
    }).slice(0, 30),
    time: Date.now(),
  })
}

// console.log(fake_data)

const promiseArr = fake_data.map((postData) => {
  return Post.create({
    ...postData
  })
})
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
  .then(async () => {
    console.log("Connected to database")

    const res_ = await Promise.all(promiseArr)
    console.log(res_)
  })
  .catch((err) => { console.error("Unable to connect database", err) })


function randInt(max) {
  return Math.floor(Math.random() * max)
}