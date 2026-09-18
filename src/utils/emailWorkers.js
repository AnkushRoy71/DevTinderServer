const { Worker } = require("bullmq");
const { connection } = require("./connection");

const myWorker = new Worker(
  "emails",
  async (job) => {
    console.log("this is job", job.id);
  },
  { connection },
);

myWorker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

myWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

module.exports = myWorker;