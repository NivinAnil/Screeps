require("dotenv").config();

module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-screeps");

  grunt.initConfig({
    screeps: {
      options: {
        email: "nivinanil244@gmail.com",
        token: process.env.TOKEN,
        branch: "default",
        //server: 'season'
      },
      dist: {
        src: ["dist/*.js"],
      },
    },
  });
};
